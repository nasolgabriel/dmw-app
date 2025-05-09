<?php

namespace App\Http\Controllers\API;

use App\Models\ServiceCounter;
use App\Models\Service;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Queue;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;
class ServiceCounterController extends Controller
{
    
/**
 * Get the latest client assigned to a specific counter
 *
 * @param int $counterId
 * @return JsonResponse
 */
public function getLatestClientInCounter(int $counterId): JsonResponse
{
    try {
        $counter = ServiceCounter::find($counterId);
        
        if (!$counter) {
            return response()->json([
                'success' => false,
                'message' => 'Counter not found'
            ], 404);
        }
        
        // Find the latest queue entry for this counter that is being processed
        $latestQueue = Queue::where('counter_id', $counterId)
            ->where('status', 'processing')
            ->orderBy('updated_at', 'desc')
            ->with(['client', 'service:id,abbreviation,description'])
            ->first();
        
        if (!$latestQueue) {
            return response()->json([
                'success' => true,
                'message' => 'No active client in this counter',
                'data' => null
            ]);
        }
        
        // Get client data
        $client = $latestQueue->client;
        
        // Format the response data to match the frontend interface
        $responseData = [
            'queue_id' => $latestQueue->id,
            'ticket_number' => $latestQueue->ticket_number,
            'client' => [
                'id' => $client->id,
                'firstname' => $client->firstName ?? $client->firstname ?? null,
                'middlename' => $client->middleName ?? $client->middlename ?? null,
                'lastname' => $client->lastName ?? $client->lastname ?? null,
                'suffix' => $client->suffix ?? null,
                'age' => $client->age ?? null,
                'birthday' => $client->birthday ?? null,
                'sex' => $client->sex ?? null,
                'contact' => $client->contact ?? null,
                'address' => $client->address ?? null,
                'email' => $client->email ?? null,
                'passport_number' => $client->passport_number ?? null,
                'purpose' => $client->purpose ?? null,
                'priority' => $client->priority ?? false,
                'status' => $latestQueue->status
            ],
            'service' => $latestQueue->service,
            'status' => $latestQueue->status,
            'counter_number' => $counter->counter_number,
            'processed_at' => Carbon::parse($latestQueue->updated_at)->setTimezone('Asia/Manila')->format('Y-m-d H:i:s')
        ];
        
        return response()->json([
            'success' => true,
            'data' => $responseData
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to retrieve latest client: ' . $e->getMessage()
        ], 500);
    }
}

    public function index()
    {
        return response()->json(ServiceCounter::with('service')->get());
    }
    
    public function show($id)
    {
        $counter = ServiceCounter::with('service')->findOrFail($id);
        return response()->json($counter);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'counter_number' => 'required|integer|min:1|max:12',
            'service_id' => 'required|exists:services,id',
            'assigned_staff' => 'nullable|string|max:100',
            'status' => 'required|in:active,inactive,maintenance'
        ]);
        
        // Validate counter_number and service_id combinations
        $this->validateCounterService($validated['counter_number'], $validated['service_id']);
        
        $counter = ServiceCounter::create($validated);
        return response()->json($counter, 201);
    }
    
    
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'counter_number' => 'required|integer|min:1|max:12',
            'service_id' => 'required|exists:services,id',
            'assigned_staff' => 'nullable|string|max:100',
            'status' => 'required|in:active,inactive,maintenance'
        ]);
        
        // Validate counter_number and service_id combinations
        $this->validateCounterService($validated['counter_number'], $validated['service_id']);
        
        $counter = ServiceCounter::findOrFail($id);
        $counter->update($validated);
        
        return response()->json($counter);
    }
    
    public function destroy($id)
    {
        $counter = ServiceCounter::findOrFail($id);
        $counter->delete();
        
        return response()->json(null, 204);
    }
    
    private function validateCounterService($counterNumber, $serviceId)
    {
        $service = Service::findOrFail($serviceId);
        
        if ($counterNumber >= 1 && $counterNumber <= 3) {
            // Counter 1-3 can only be LA (service_id = 1)
            if ($serviceId != 1) {
                abort(422, 'Counters 1-3 can only provide Legal Assistance (LA) services.');
            }
        } elseif ($counterNumber >= 4 && $counterNumber <= 7) {
            // Counter 4-7 can be BM, DH, I, A, or G (service_id = 2-6)
            if ($serviceId < 2 || $serviceId > 6) {
                abort(422, 'Counters 4-7 can only provide BM, DH, I, A, or G services.');
            }
        } elseif ($counterNumber >= 8 && $counterNumber <= 10) {
            // Counter 8-10 can be FA, S, or L (service_id = 7-9)
            if ($serviceId < 7 || $serviceId > 9) {
                abort(422, 'Counters 8-10 can only provide FA, S, or L services.');
            }
        } elseif ($counterNumber == 11 || $counterNumber == 12) {
            // Counter 11-12 can be PIF or O (service_id = 10-11)
            if ($serviceId < 10 || $serviceId > 11) {
                abort(422, 'Counters 11-12 can only provide PIF or O services.');
            }
        }
        
        return true;
    }
    
    public function  getCountersByService($serviceId)
    {
        $counters = ServiceCounter::where('service_id', $serviceId)
                                 ->with('service')
                                 ->get();
                                 
        return response()->json($counters);
    }
    

public function updateStatus(Request $request, $id)
{
    $validated = $request->validate([
        'status' => 'required|in:active,inactive,maintenance'
    ]);
    
    $counter = ServiceCounter::findOrFail($id);
    $counter->status = $validated['status'];
    $counter->save();
    
    return response()->json($counter);
}

public function assignStaff(Request $request, $id)
{
    $validated = $request->validate([
        'assigned_staff' => 'required|string|max:100'
    ]);
    
    $counter = ServiceCounter::findOrFail($id);
    $counter->assigned_staff = $validated['assigned_staff'];
    $counter->save();
    
    return response()->json($counter);
}

public function getByCounterNumber($counterNumber)
{
    $counter = ServiceCounter::where('counter_number', $counterNumber)
                           ->with('service')
                           ->first();
                           
    if (!$counter) {
        return response()->json(['message' => 'Counter not found'], 404);
    }
    
    return response()->json($counter);
}

public function getCounterStatistics()
{
    $stats = [
        'total_counters' => ServiceCounter::count(),
        'active_counters' => ServiceCounter::where('status', 'active')->count(),
        'inactive_counters' => ServiceCounter::where('status', 'inactive')->count(),
        'maintenance_counters' => ServiceCounter::where('status', 'maintenance')->count(),
        'counters_by_service' => []
    ];
    
    $services = Service::all();
    foreach ($services as $service) {
        $stats['counters_by_service'][] = [
            'service' => $service->abbreviation,
            'description' => $service->description,
            'counter_count' => ServiceCounter::where('service_id', $service->id)->count()
        ];
    }
    
    return response()->json($stats);
}
public function getAvailableCounters()
{
    $counters = ServiceCounter::where('status', 'active')->get();
    return response()->json($counters);
}

public function linkUserToCounter(Request $request, $counterId)
{
    $counter = ServiceCounter::findOrFail($counterId);
    
    // Set the counter as active and link it to the authenticated user
    $counter->status = 'active';
    $counter->user_id = auth()->id();
    $counter->save();
    
    return response()->json([
        'message' => 'Counter linked to user and activated',
        'counter' => $counter
    ]);
}

public function unlinkUserFromCounter(Request $request, $counterId = null)
{
    if ($counterId) {
        // Unlink specific counter
        $counter = ServiceCounter::findOrFail($counterId);
        
        // Only allow unlinking if the counter belongs to the authenticated user
        if ($counter->user_id == auth()->id()) {
            $counter->status = 'inactive';
            $counter->user_id = null;
            $counter->save();
            
            return response()->json([
                'message' => 'Counter unlinked from user and deactivated',
                'counter' => $counter
            ]);
        } else {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    } else {
        // Unlink all counters for the authenticated user
        ServiceCounter::where('user_id', auth()->id())
            ->update([
                'status' => 'inactive',
                'user_id' => null
            ]);
            
        return response()->json([
            'message' => 'All counters unlinked from user and deactivated'
        ]);
    }
}

public function getUserCounter()
{
    $counter = ServiceCounter::where('user_id', auth()->id())->first();
    
    if ($counter) {
        return response()->json($counter);
    } else {
        return response()->json(['message' => 'No counter assigned to this user'], 404);
    }
}
/**
 * Get the next ticket from the queue for a specific counter
 *
 * @param Request $request
 * @param int $counterId
 * @return \Illuminate\Http\JsonResponse
 */
public function getNextTicket(Request $request, $counterId)
{
    // Find the counter
    $counter = ServiceCounter::with('service')->findOrFail($counterId);
    
    // Get the service associated with this counter
    $serviceId = $counter->service_id;
    
    // Find the next ticket in the queue for this service
    // Assuming you have a Queue or Ticket model
    $nextTicket = Queue::where('service_id', $serviceId)
                      ->where('status', 'waiting')
                      ->orderBy('created_at', 'asc')
                      ->first();
    
    if (!$nextTicket) {
        return response()->json([
            'message' => 'No tickets in queue for this service',
            'counter' => $counter
        ], 404);
    }
    
    // Update the ticket status to 'processing' and assign it to this counter
    $nextTicket->status = 'processing';
    $nextTicket->counter_id = $counterId;
    $nextTicket->called_at = now();
    $nextTicket->save();
    
    // You could also update the counter status if needed
    // $counter->status = 'busy';
    // $counter->save();
    
    return response()->json([
        'message' => 'Ticket assigned to counter',
        'ticket' => $nextTicket,
        'counter' => $counter
    ]);
}


public function pickTicket(Request $request, $counterId, $ticketId)
{
    // Validate the counter ID
    $counter = ServiceCounter::find($counterId);
    if (!$counter) {
        return response()->json([
            'message' => 'Counter not found'
        ], 404);
    }

    // Find the specified ticket in the queue
    $ticket = Queue::where('id', $ticketId)
                   ->where('status', 'in queue')
                   ->first();

    if (!$ticket) {
        return response()->json([
            'message' => 'Ticket not found or not in queue status',
            'counter' => $counter
        ], 404);
    }

    // Update the ticket status to 'processing' and assign it to this counter
    $ticket->status = 'processing';
    $ticket->counter_id = $counterId;
    $ticket->called_at = now();
    $ticket->save();

    return response()->json([
        'message' => 'Ticket assigned to counter',
        'ticket' => $ticket,
        'counter' => $counter
    ]);
}

    
}
