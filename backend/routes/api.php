<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\API\ClientController;
use App\Http\Controllers\API\QueueController;
use App\Http\Controllers\API\ServiceController;
use App\Http\Controllers\API\ServiceCounterController;
use App\Http\Controllers\UserController;

// Authenticated user routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/user/default-counter', [UserController::class, 'updateDefaultCounter']);
    Route::post('/service-counters/{id}/next-ticket', [ServiceCounterController::class, 'getNextTicket']);
    Route::post('/counters/{counterId}/pick-ticket/{ticketId}', [ServiceCounterController::class, 'pickTicket']);
});

// Auth Routes
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::post('/service-counters/{id}/link', [ServiceCounterController::class, 'linkUserToCounter']);
    Route::post('/service-counters/{id?}/unlink', [ServiceCounterController::class, 'unlinkUserFromCounter']);
    Route::get('/service-counters/user', [ServiceCounterController::class, 'getUserCounter']);
});

// Service routes - CRUD operations for services
Route::apiResource('services', ServiceController::class);

// Custom routes for specific functionalities
Route::get('/counters/available', [ServiceCounterController::class, 'getAvailableCounters']);
Route::get('counters/service/{serviceId}', [ServiceCounterController::class, 'getCountersByService']);
Route::put('counters/{id}/status', [ServiceCounterController::class, 'updateStatus']);
Route::put('counters/{id}/assign-staff', [ServiceCounterController::class, 'assignStaff']);
Route::get('counters/number/{counterNumber}', [ServiceCounterController::class, 'getByCounterNumber']);
Route::get('counters/stats', [ServiceCounterController::class, 'getCounterStatistics']);
Route::get('counters/{counterId}/latest-client', [ServiceCounterController::class, 'getLatestClientInCounter']);

// Service Counter routes - CRUD operations for counters
Route::apiResource('counters', ServiceCounterController::class);

Route::prefix('clients')->group(function () {
    Route::get('/', [ClientController::class, 'index']);
    Route::post('/', [ClientController::class, 'store']);
    // New route to get client by ID at /current
    Route::get('/{id}/current', [ClientController::class, 'current']);
    Route::get('/{id}', [ClientController::class, 'show']);
    Route::put('/{id}', [ClientController::class, 'update']);
    Route::delete('/{id}', [ClientController::class, 'destroy']);
    Route::post('/{id}/add-to-queue', [ClientController::class, 'addToQueue']);
});

Route::prefix('queues')->group(function () {
    Route::post('/{id}/change-division', [QueueController::class, 'changeDivision']);
    Route::get('/', [QueueController::class, 'index']);
    Route::get('/active', [QueueController::class, 'activeQueue']);
    Route::post('/', [QueueController::class, 'store']);
    
    // Place specific routes BEFORE dynamic parameter routes
    Route::get('/division', [QueueController::class, 'getDivisions']);
    Route::get('/division/{division}', [QueueController::class, 'getDivisionQueues'])
        ->where('division', '.*');
    Route::get('/next', [QueueController::class, 'nextInQueue']);
    
    // Place dynamic parameter routes at the end
    Route::get('/{id}', [QueueController::class, 'show']);
    Route::put('/{id}/status', [QueueController::class, 'updateStatus']);
    Route::delete('/{id}', [QueueController::class, 'destroy']);
});