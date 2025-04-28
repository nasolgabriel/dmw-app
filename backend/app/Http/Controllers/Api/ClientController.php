<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Queue;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ClientController extends Controller
{ /**
    * Display a listing of the clients.
    *
    * @return JsonResponse
    */
   public function index(): JsonResponse
   {
       $clients = Client::all();
       
       return response()->json([
           'success' => true,
           'data' => $clients
       ]);
   }
    
    /**
     * Store a newly created client in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    /**
 * Store a newly created client in storage.
 *
 * @param Request $request
 * @return JsonResponse
 */
      /**
     * Store a newly created client in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'firstName' => 'required|string|max:255',
            'middleName' => 'nullable|string|max:255',
            'lastName' => 'required|string|max:255',
            'contact' => 'required|string|max:20',
            'purpose' => 'required|string|max:255',
            'priority' => 'boolean',
            'age' => 'integer',
            'birthday' => 'date',
            'sex' => 'string|in:male,female,other',
            'passport_number' => 'nullable|string|max:255',
            'email' => 'nullable|string|email|max:255',
            'address' => 'nullable|string|max:255',
            // Remove status validation to allow default
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Merge default status 'in queue'
        $clientData = $validator->validated();
        $clientData['status'] = 'in queue';

        $client = Client::create($clientData);

        return response()->json([
            'success' => true,
            'message' => 'Client created successfully',
            'data' => $client
        ], 201);
    }

    /**
 * Display the specified client with their assigned ticket.
 *
 * @param int $id
 * @return JsonResponse
 */
public function show(int $id): JsonResponse
{
    $client = Client::find($id);
    
    if (!$client) {
        return response()->json([
            'success' => false,
            'message' => 'Client not found'
        ], 404);
    }

    // Get the client's active ticket from the queue if exists
    $ticket = Queue::where('client_id', $client->id)
                  ->where('status', '!=', 'completed')
                  ->orderBy('created_at', 'desc')
                  ->first();

    return response()->json([
        'success' => true,
        'data' => [
            'client' => $client,
            'ticket_number' => $ticket ? $ticket->ticket_number : null
        ]
    ]);
}

    /**
     * Update the specified client in storage.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $client = Client::find($id);
        
        if (!$client) {
            return response()->json([
                'success' => false,
                'message' => 'Client not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'firstName' => 'sometimes|string|max:255',
            'middleName' => 'sometimes|nullable|string|max:255',
            'lastName' => 'sometimes|string|max:255',
            'contact' => 'required|string|max:20',
            'purpose' => 'sometimes|string|max:255',
            'priority' => 'sometimes|boolean',
            'age' => 'sometimes|integer',
            'birthday' => 'sometimes|date',
            'sex' => 'sometimes|string|in:male,female,other',
            'status' => 'sometimes|string|in:waiting,in queue,served,cancelled',
            'passport_number' => 'sometimes|nullable|string|max:255',
            'email' => 'sometimes|nullable|string|email|max:255',
            'address' => 'sometimes|nullable|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $client->update($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Client updated successfully',
            'data' => $client
        ]);
    }

    /**
     * Update client status to "in queue".
     *
     * @param int $id
     * @return JsonResponse
     */
    public function addToQueue(int $id): JsonResponse
    {
        $client = Client::find($id);
        
        if (!$client) {
            return response()->json([
                'success' => false,
                'message' => 'Client not found'
            ], 404);
        }

        $client->status = 'in queue';
        $client->save();

        // The Observer will handle queue creation based on status change

        return response()->json([
            'success' => true,
            'message' => 'Client added to queue successfully',
            'data' => $client->load('queueEntries')
        ]);
    }

    /**
     * Remove the specified client from storage.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $client = Client::find($id);
        
        if (!$client) {
            return response()->json([
                'success' => false,
                'message' => 'Client not found'
            ], 404);
        }

        $client->delete();

        return response()->json([
            'success' => true,
            'message' => 'Client deleted successfully'
        ]);
    }
}