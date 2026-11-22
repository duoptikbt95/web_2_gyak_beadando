<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DatabaseController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin-teszt', function () {
        return 'Csak admin látja!';
    });
});

Route::get('/adatbazis', [DatabaseController::class, 'index'])->name('adatbazis');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';