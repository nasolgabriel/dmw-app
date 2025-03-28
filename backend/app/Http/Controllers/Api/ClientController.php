<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ClientController extends Controller
{
    /**
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
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'contact' => 'required|string|max:255',
            'email' => 'required|email|max:255',          // Added
            'passport_number' => 'required|string|max:50', // Added (adjust max length)
            'address' => 'required|string|max:500',       // Added
            'purpose' => 'required|string|max:255',
            'age' => 'required|integer',
            'sex' => 'required|string|in:male,female,other',
            'status' => 'required|string|in:waiting,in queue,served,cancelled'
        ]); 

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $client = Client::create($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Client created successfully',
            'data' => $client
        ], 201);
    }

    /**
     * Display the specified client.
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

        return response()->json([
            'success' => true,
            'data' => $client
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
            'name' => 'sometimes|string|max:255',
            'contact' => 'sometimes|string|max:255',
            'purpose' => 'sometimes|string|max:255',
            'age' => 'sometimes|integer',
            'sex' => 'sometimes|string|in:male,female,other',
            'status' => 'sometimes|string|in:waiting,in queue,served,cancelled'
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