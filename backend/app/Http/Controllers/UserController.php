<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        // Retrieve all users from the database
        $users = User::all();
        
        // Return the users as a JSON response
        return response()->json($users);
    }
    public function updateDefaultCounter(Request $request)
{
    $validated = $request->validate([
        'counter_id' => 'required|exists:service_counters,id'
    ]);
    
    $user = $request->user();
    $user->counter_id = $validated['counter_id'];
    $user->save();
    
    return response()->json([
        'message' => 'Default counter updated successfully',
        'user' => $user
    ]);
}
}
