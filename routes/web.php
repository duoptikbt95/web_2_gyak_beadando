<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DatabaseController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\AdminCrudController;
use App\Http\Controllers\DiagramController;
use App\Http\Controllers\UserRoleController;

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

    // Telepítések CRUD
    Route::get('/crud', [AdminCrudController::class, 'index'])->name('crud.index');
    Route::post('/crud', [AdminCrudController::class, 'store'])->name('crud.store');
    Route::put('/crud/{telepites}', [AdminCrudController::class, 'update'])->name('crud.update');
    Route::delete('/crud/{telepites}', [AdminCrudController::class, 'destroy'])->name('crud.destroy');

    // Gépek CRUD
    Route::post('/crud/gepek', [AdminCrudController::class, 'storeGep'])->name('crud.gepek.store');
    Route::put('/crud/gepek/{gep}', [AdminCrudController::class, 'updateGep'])->name('crud.gepek.update');
    Route::delete('/crud/gepek/{gep}', [AdminCrudController::class, 'destroyGep'])->name('crud.gepek.destroy');

    // Szoftverek CRUD
    Route::post('/crud/szoftverek', [AdminCrudController::class, 'storeSzoftver'])->name('crud.szoftverek.store');
    Route::put('/crud/szoftverek/{szoftver}', [AdminCrudController::class, 'updateSzoftver'])->name('crud.szoftverek.update');
    Route::delete('/crud/szoftverek/{szoftver}', [AdminCrudController::class, 'destroySzoftver'])->name('crud.szoftverek.destroy');
});

Route::get('/adatbazis', [DatabaseController::class, 'index'])->name('adatbazis');
Route::get('/kapcsolat', [ContactController::class, 'create'])->name('kapcsolat.create');
Route::post('/kapcsolat', [ContactController::class, 'store'])->name('kapcsolat.store');
Route::get('/diagram', [DiagramController::class, 'index'])->name('diagram.index');

Route::middleware(['auth'])->group(function () {
    Route::get('/jogosultsagok', [UserRoleController::class, 'index'])->name('jogosultsagok.index');
    Route::post('/jogosultsagok', [UserRoleController::class, 'store'])->name('jogosultsagok.store');
    Route::patch('/jogosultsagok/{targetUser}', [UserRoleController::class, 'update'])->name('jogosultsagok.update');
    Route::patch('/jogosultsagok/{targetUser}/password', [UserRoleController::class, 'updatePassword'])->name('jogosultsagok.password');
    Route::delete('/jogosultsagok/{targetUser}', [UserRoleController::class, 'destroy'])->name('jogosultsagok.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';