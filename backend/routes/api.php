<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\API\ClientController;
use App\Http\Controllers\API\QueueController;


Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});


Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])
        ->middleware('auth:api');
});
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
