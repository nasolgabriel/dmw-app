<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Queue;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use App\Models\Service;
use App\Models\ServiceCounter;
class QueueController extends Controller
{
/**
 * Get all available divisions with their active queue tickets
 *
 * @return JsonResponse
 */
/**
 * Get all available divisions with their active queue tickets
 *
 * @return JsonResponse
 */
public function getDivisions(): JsonResponse
{
    try {
        // Fetch distinct divisions from services table
        $divisions = Service::select('division')
            ->distinct()
            ->orderBy('division')
            ->get()
            ->pluck('division')
            ->filter(); // Remove any null or empty values
        
        // Collect information for each division including active queue tickets
        $divisionsWithData = $divisions->map(function($division) {
            // Find all services in this division
            $services = Service::where('division', $division)->get();
            $serviceIds = $services->pluck('id')->toArray();
            
            // Get active queues for this division with ticket numbers
            // Include the client relationship to access priority
            $activeQueues = Queue::whereIn('service_id', $serviceIds)
                ->whereNotIn('status', ['completed', 'cancelled'])
                ->with(['service:id,abbreviation,description', 'counter', 'client:id,priority,firstName,lastName'])
                ->select('id', 'ticket_number', 'service_id', 'client_id', 'counter_id', 'status', 'created_at')
                ->orderBy('created_at')
                ->get();
            
            // Transform and map active tickets
            $activeTickets = $activeQueues->map(function($queue) {
                return [
                    'id' => $queue->id,
                    'ticket_number' => $queue->ticket_number,
                    'service' => $queue->service ? $queue->service->abbreviation : null,
                    'client_name' => $queue->client ? $queue->client->firstName . ' ' . $queue->client->lastName : null,
                    'priority' => $queue->client ? $queue->client->priority : false,
                    'counter_id' => $queue->counter_id,
                    'status' => $queue->status,
                    'created_at' => Carbon::parse($queue->created_at)->setTimezone('Asia/Manila')->format('Y-m-d H:i:s')
                ];
            });
            
            // Sort active tickets - priority first, then by creation time
            $sortedActiveTickets = $activeTickets->sortBy([
                ['priority', 'desc'], // Sort by priority in descending order (true comes first)
                ['created_at', 'asc']  // Then sort by creation date (oldest first)
            ])->values(); // Use values() to reset array indexes
                
            return [
                'name' => $division,
                'active_queues_count' => $activeQueues->count(),
                'services_count' => count($serviceIds),
                'active_tickets' => $sortedActiveTickets
            ];
        });
        
        return response()->json([
            'success' => true,
            'data' => $divisionsWithData
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to retrieve divisions: ' . $e->getMessage()
        ], 500);
    }
}
/**
 * Change the division of a queue ticket.
 *
 * @param Request $request
 * @param int $id
 * @return JsonResponse
 */
public function changeDivision(Request $request, int $id): JsonResponse
{
    // Find the queue entry
    $queueEntry = Queue::find($id);
    
    if (!$queueEntry) {
        return response()->json([
            'success' => false,
            'message' => 'Queue entry not found'
        ], 404);
    }
    
    // Validate the request
    $validator = Validator::make($request->all(), [
        'division' => 'required|string',
        'service_id' => 'nullable|exists:services,id',
        'reason' => 'nullable|string|max:255',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'errors' => $validator->errors()
        ], 422);
    }
    
    // If service_id is provided directly, use it
    if ($request->has('service_id') && $request->service_id) {
        $serviceId = $request->service_id;
    } else {
        // Otherwise, get the first service from the selected division
        $division = $request->division;
        $service = Service::where('division', $division)->first();
        
        if (!$service) {
            return response()->json([
                'success' => false,
                'message' => 'No services found in the selected division'
            ], 404);
        }
        
        $serviceId = $service->id;
    }
    
    // Update the service assignment
    $queueEntry->service_id = $serviceId;
    
    // Clear the counter assignment since it's changing divisions
    $queueEntry->counter_id = null;
    
    // Set status to "in queue"
    $queueEntry->status = 'in queue';
    
    // Save the changes
    $queueEntry->save();
    
    // Get the division name for the response
    $newDivision = Service::find($serviceId)->division;
    
    return response()->json([
        'success' => true,
        'message' => "Queue ticket division changed to {$newDivision} and status set to in queue",
        'data' => $queueEntry->load(['client', 'service', 'counter'])
    ]);
}
/**
 * Get queues for a specific division, excluding completed queues
 * 
 * @param string $division Division name or ID
 * @return \Illuminate\Http\JsonResponse
 */
public function getDivisionQueues($division)
{
    try {
        // URL decode the division name
        $division = urldecode($division);
        
        // First, check if this is a division name (non-numeric)
        if (!is_numeric($division)) {
            // Find all services in this division by name
            $services = Service::where('division', $division)->get();
        } else {
            // If numeric, it might be a service ID
            $service = Service::find($division);
            $services = $service ? collect([$service]) : collect();
        }
        
        // If no services found
        if ($services->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Division not found or no services in this division: ' . $division
            ], 404);
        }
        
        // Get all service IDs in this division
        $serviceIds = $services->pluck('id')->toArray();
        $divisionName = $services->first()->division;
        
        // Get queues for all services in this division, excluding completed queues
        $queues = Queue::whereIn('service_id', $serviceIds)
            ->whereNotIn('status', ['completed', 'cancelled']) // Add this line to exclude completed and cancelled queues
            ->with([
                'client:id,priority,firstName,middleName,lastName', 
                'service:id,abbreviation,description'
            ])
            ->select('id', 'service_id', 'ticket_number', 'status', 'created_at', 'client_id', 'counter_id')
            ->orderBy('created_at')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => [
                'division' => $divisionName,
                'services' => $services->map(function($service) {
                    return [
                        'id' => $service->id,
                        'abbreviation' => $service->abbreviation,
                        'description' => $service->description
                    ];
                }),
                'queues' => $queues
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to retrieve division queues: ' . $e->getMessage()
        ], 500);
    }
}
    /**
     * Display a listing of queue entries.
     *
     * @return JsonResponse
     */
    public function 
    index(): JsonResponse
    {
        $queueEntries = Queue::with('client')->get();
        
        return response()->json([
            'success' => true,
            'data' => $queueEntries
        ]);
    }

     /**
     * Display active queue entries (not completed or cancelled), sorted by priority.
     *
     * @return JsonResponse
     */
    public function activeQueue(): JsonResponse
{
    $activeQueue = Queue::with('client')
        ->join('clients', 'queues.client_id', '=', 'clients.id')
        ->whereIn('queues.status', ['in queue', 'processing'])
        ->orderBy('clients.priority', 'desc') // Priority clients first
        ->orderBy('queues.created_at', 'asc') // Then by creation time
        ->select('queues.*')
        ->get()
        ->map(function ($queue) {
            // Convert to local time
            $queue->created_at = Carbon::parse($queue->created_at)->setTimezone('Asia/Manila')->toDateTimeString();
            return $queue;
        });

    return response()->json([
        'success' => true,
        'data' => $activeQueue
    ]);
}

    /**
     * Store a new queue entry manually.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'client_id' => 'required|exists:clients,id',
            'service_id' => 'nullable|exists:services,id',
            'status' => 'required|string|in:in queue,processing,completed,cancelled'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Generate ticket number as a 3-digit sequential number resetting daily
        $clientCountToday = Queue::whereDate('created_at', date('Y-m-d'))->count() + 1;
        $ticketNumber = str_pad($clientCountToday, 3, '0', STR_PAD_LEFT);

        $queueEntry = Queue::create([
            'ticket_number' => $ticketNumber,
            'client_id' => $request->client_id,
            'service_id' => $request->service_id,
            'status' => $request->status
        ]);

        // Update client status if not already in queue
        $client = Client::find($request->client_id);
        if ($client && $client->status !== 'in queue') {
            $client->status = 'in queue';
            $client->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Queue entry created successfully',
            'data' => $queueEntry->load('client')
        ], 201);
    }

    /**
     * Display the specified queue entry.
     *
     * @param int $id
     * @return JsonResponse
     */
  /**
     * Display the specified queue entry.
     *
     * @param string|int $id
     * @return JsonResponse
     */
    public function show($id): JsonResponse
    {
       

        // Try to find by ticket number first
        $queueEntry = Queue::with(['client', 'service', 'counter'])
            ->where('ticket_number', $id)
            ->first();

        // If not found by ticket number, try to find by ID
        if (!$queueEntry) {
            // Ensure $id is a valid integer
            if (!is_numeric($id)) {
                
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid queue entry identifier',
                    'received_id' => $id
                ], 400);
            }

            $queueEntry = Queue::with(['client', 'service', 'counter'])
                ->find((int)$id);
        }
        
        if (!$queueEntry) {
            return response()->json([
                'success' => false,
                'message' => 'Queue entry not found',
                'received_id' => $id
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $queueEntry
        ]);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
{
    $queueEntry = Queue::find($id);
    
    if (!$queueEntry) {
        return response()->json([
            'success' => false,
            'message' => 'Queue entry not found'
        ], 404);
    }

    $validator = Validator::make($request->all(), [
        'status' => 'required|string|in:in queue,processing,completed,cancelled'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'errors' => $validator->errors()
        ], 422);
    }

    $queueEntry->status = $request->status;
    $queueEntry->save();

    // If status is completed or cancelled, update client status to served
    if (in_array($request->status, ['completed', 'cancelled'])) {
        $client = Client::find($queueEntry->client_id);
        if ($client) {
            $client->status = 'served';
            $client->save();
        }
    }

    return response()->json([
        'success' => true,
        'data' => [
            'status' => $queueEntry->status
        ]
    ]);
}


    /**
     * Remove the specified queue entry from storage.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $queueEntry = Queue::find($id);
        
        if (!$queueEntry) {
            return response()->json([
                'success' => false,
                'message' => 'Queue entry not found'
            ], 404);
        }

        $queueEntry->delete();

        return response()->json([
            'success' => true,
            'message' => 'Queue entry deleted successfully'
        ]);
    }

/**
     * Get the next client in the queue, prioritizing clients with priority flag.
     *
     * @return JsonResponse
     */
    public function nextInQueue(): JsonResponse
    {
        // First check for priority clients
        $nextInQueue = Queue::with('client')
            ->join('clients', 'queues.client_id', '=', 'clients.id')
            ->where('queues.status', 'waiting')
            ->where('clients.priority', true)
            ->orderBy('queues.created_at', 'asc')
            ->select('queues.*')
            ->first();
        
        // If no priority clients, get the next regular client
        if (!$nextInQueue) {
            $nextInQueue = Queue::with('client')
                ->join('clients', 'queues.client_id', '=', 'clients.id')
                ->where('queues.status', 'waiting')
                ->where('clients.priority', false)
                ->orderBy('queues.created_at', 'asc')
                ->select('queues.*')
                ->first();
        }
        
        if (!$nextInQueue) {
            return response()->json([
                'success' => false,
                'message' => 'No clients waiting in queue'
            ], 404);
        }

        // Update status to processing
        $nextInQueue->status = 'processing';
        $nextInQueue->save();

        // Format response with priority at top level
        $responseData = $nextInQueue->load('client')->toArray();
        $responseData['priority'] = $nextInQueue->client->priority ?? false;

        return response()->json([
            'success' => true,
            'message' => 'Next client in queue retrieved',
            'data' => $responseData
        ]);
    }
}