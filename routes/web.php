<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DatabaseController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DiagramController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/uzenetek', [ContactController::class, 'index'])->name('uzenetek.index');
    Route::delete('/uzenetek/{message}', [ContactController::class, 'destroy'])->name('uzenetek.destroy');
});

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin-teszt', function () {
        return 'Csak admin látja!';
    });
});

Route::get('/adatbazis', [DatabaseController::class, 'index'])->name('adatbazis');
Route::get('/kapcsolat', [ContactController::class, 'create'])->name('kapcsolat.create');
Route::post('/kapcsolat', [ContactController::class, 'store'])->name('kapcsolat.store');
Route::get('/diagram', [DiagramController::class, 'index'])->name('diagram.index');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';