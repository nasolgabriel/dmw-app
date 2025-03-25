<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\ServiceCounter; // Ensure this model is imported

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required'
        ]);
        
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            
            // Generate token if using Sanctum
            $token = null;
            if (method_exists($user, 'createToken')) {
                $token = $user->createToken('auth_token')->plainTextToken;
            }
            
            // If the user has an assigned counter_id, activate that counter
            if ($user->counter_id) {
                $counter = ServiceCounter::find($user->counter_id);
                if ($counter) {
                    // Set the counter to active and associate with user
                    $counter->status = 'active';
                    $counter->user_id = $user->id;
                    $counter->save();
                }
            }
            // If counter_id was provided in the request, override the default counter
            elseif ($request->has('counter_id')) {
                $counter = ServiceCounter::findOrFail($request->counter_id);
                $counter->status = 'active';
                $counter->user_id = $user->id;
                $counter->save();
                
                // Update the user's default counter
                $user->counter_id = $counter->id;
                $user->save();
            }
            
            return response()->json([
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]);
        }
        
        return response()->json(['message' => 'Invalid credentials'], 401);
    }
    
    public function logout(Request $request)
    {
        try {
            $user = $request->user();
            
            // Deactivate the counter if it's active
            if ($user->counter_id) {
                ServiceCounter::where('id', $user->counter_id)
                    ->where('user_id', $user->id)
                    ->update([
                        'status' => 'inactive',
                        'user_id' => null
                    ]);
            }
            
            // Revoke token if using Sanctum
            if (method_exists($user, 'currentAccessToken')) {
                $user->currentAccessToken()->delete();
            }
            
            return response()->json(['message' => 'Successfully logged out']);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}