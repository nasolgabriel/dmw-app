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
}
