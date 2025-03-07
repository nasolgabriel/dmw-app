<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});
// In routes/api.php
Route::get('/users', [UserController::class, 'index']);


require __DIR__.'/auth.php';
