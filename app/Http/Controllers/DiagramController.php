<?php

namespace App\Http\Controllers;

use App\Models\Gep;
use App\Models\Szoftver;
use App\Models\Telepites;
use Inertia\Inertia;

class DiagramController extends Controller
{
    public function index()
    {
        $szoftverek = Szoftver::withCount('telepitesek')
            ->orderByDesc('telepitesek_count')
            ->get()
            ->map(function ($szoftver) {
                return [
                    'id' => $szoftver->id,
                    'nev' => $szoftver->nev ?? $szoftver->megnevezes ?? ('Szoftver #' . $szoftver->id),
                    'darab' => (int) $szoftver->telepitesek_count,
                ];
            });

     $gepek = Gep::withCount('telepitesek')
            ->orderByDesc('telepitesek_count')
            ->get()
            ->map(function ($gep) {
                $hely = $gep->hely ?? ('Gép #' . $gep->id);
                $tipus = $gep->tipus ? " ({$gep->tipus})" : '';

                return [
                    'id' => $gep->id,
                    'nev' => "{$hely}{$tipus}",
                    'ipcim' => $gep->ipcim,
                    'darab' => (int) $gep->telepitesek_count,
                ];
            });
            
        return Inertia::render('Diagram', [
            'summary' => [
                'gepekCount' => Gep::count(),
                'szoftverekCount' => Szoftver::count(),
                'telepitesekCount' => Telepites::count(),
            ],
            'szoftverStatisztika' => $szoftverek,
            'gepStatisztika' => $gepStatisztika = $gepek,
        ]);
    }
}