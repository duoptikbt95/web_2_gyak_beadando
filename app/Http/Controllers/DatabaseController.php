<?php

namespace App\Http\Controllers;

use App\Models\Gep;
use App\Models\Szoftver;
use App\Models\Telepites;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DatabaseController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->input('search', ''));

        $gepek = Gep::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('hely', 'like', "%{$search}%")
                      ->orWhere('tipus', 'like', "%{$search}%")
                      ->orWhere('ipcim', 'like', "%{$search}%");
                });
            })
            ->orderBy('hely')
            ->get();

        $szoftverek = Szoftver::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nev', 'like', "%{$search}%")
                      ->orWhere('kategoria', 'like', "%{$search}%");
                });
            })
            ->orderBy('nev')
            ->get();

        $telepitesek = Telepites::with(['gep', 'szoftver'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('verzio', 'like', "%{$search}%")
                      ->orWhere('datum', 'like', "%{$search}%")
                      ->orWhereHas('gep', function ($sub) use ($search) {
                          $sub->where('hely', 'like', "%{$search}%")
                              ->orWhere('tipus', 'like', "%{$search}%")
                              ->orWhere('ipcim', 'like', "%{$search}%");
                      })
                      ->orWhereHas('szoftver', function ($sub) use ($search) {
                          $sub->where('nev', 'like', "%{$search}%")
                              ->orWhere('kategoria', 'like', "%{$search}%");
                      });
                });
            })
            ->latest('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Database/Index', [
            'gepek' => $gepek,
            'szoftverek' => $szoftverek,
            'telepitesek' => $telepitesek,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
}