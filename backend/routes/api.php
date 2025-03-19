<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\API\ClientController;
use App\Http\Controllers\API\QueueController;
use App\Http\Controllers\API\ServiceController;
use App\Http\Controllers\API\ServiceCounterController;

// Authenticated user route
Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// Service routes - CRUD operations for services
Route::apiResource('services', ServiceController::class);

// Service Counter routes - CRUD operations for counters
Route::apiResource('counters', ServiceCounterController::class);

// Custom routes for specific functionalities
Route::get('counters/service/{serviceId}', [ServiceCounterController::class, 'getCountersByService']);
//Route::get('/counters/available', [ServiceCounterController::class, 'getAvailableCounters']);
Route::put('counters/{id}/status', [ServiceCounterController::class, 'updateStatus']);
Route::put('counters/{id}/assign-staff', [ServiceCounterController::class, 'assignStaff']);
Route::get('counters/number/{counterNumber}', [ServiceCounterController::class, 'getByCounterNumber']);
//Route::get('counters/stats', [ServiceCounterController::class, 'getCounterStatistics']);

// Client Routes
Route::prefix('clients')->group(function () {
    Route::get('/', [ClientController::class, 'index']);
    Route::post('/', [ClientController::class, 'store']);
    Route::get('/{id}', [ClientController::class, 'show']);
    Route::put('/{id}', [ClientController::class, 'update']);
    Route::delete('/{id}', [ClientController::class, 'destroy']);
    Route::post('/{id}/add-to-queue', [ClientController::class, 'addToQueue']);
});

// Queue Routes
Route::prefix('queues')->group(function () {
    Route::get('/', [QueueController::class, 'index']);
    Route::get('/active', [QueueController::class, 'activeQueue']);
    Route::post('/', [QueueController::class, 'store']);
    Route::get('/{id}', [QueueController::class, 'show']);
    Route::put('/{id}/status', [QueueController::class, 'updateStatus']);
    Route::delete('/{id}', [QueueController::class, 'destroy']);
    Route::get('/next', [QueueController::class, 'nextInQueue']);
});

// Auth Routes
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
});