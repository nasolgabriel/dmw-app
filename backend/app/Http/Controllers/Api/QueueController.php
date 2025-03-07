<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Queue;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class QueueController extends Controller
{
    /**
     * Display a listing of queue entries.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $queueEntries = Queue::with('client')->get();
        
        return response()->json([
            'success' => true,
            'data' => $queueEntries
        ]);
    }

    /**
     * Display active queue entries (not completed or cancelled).
     *
     * @return JsonResponse
     */
    public function activeQueue(): JsonResponse
    {
        $activeQueue = Queue::with('client')
            ->whereIn('status', ['waiting', 'processing'])
            ->orderBy('created_at', 'asc')
            ->get();
        
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
            'status' => 'required|string|in:waiting,processing,completed,cancelled'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Generate ticket number
        $ticketNumber = 'T' . date('Ymd') . '-' . str_pad((Queue::count() + 1), 3, '0', STR_PAD_LEFT);
        
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
    public function show(int $id): JsonResponse
    {
        $queueEntry = Queue::with('client')->find($id);
        
        if (!$queueEntry) {
            return response()->json([
                'success' => false,
                'message' => 'Queue entry not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $queueEntry
        ]);
    }

    /**
     * Update the specified queue entry status.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
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
            'status' => 'required|string|in:waiting,processing,completed,cancelled'
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
            'message' => 'Queue status updated successfully',
            'data' => $queueEntry->load('client')
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
     * Get the next client in the queue.
     *
     * @return JsonResponse
     */
    public function nextInQueue(): JsonResponse
    {
        $nextInQueue = Queue::with('client')
            ->where('status', 'waiting')
            ->orderBy('created_at', 'asc')
            ->first();
        
        if (!$nextInQueue) {
            return response()->json([
                'success' => false,
                'message' => 'No clients waiting in queue'
            ], 404);
        }

        // Update status to processing
        $nextInQueue->status = 'processing';
        $nextInQueue->save();

        return response()->json([
            'success' => true,
            'message' => 'Next client in queue retrieved',
            'data' => $nextInQueue
        ]);
    }
}