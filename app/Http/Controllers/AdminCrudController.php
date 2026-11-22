<?php

namespace App\Http\Controllers;

use App\Models\Gep;
use App\Models\Szoftver;
use App\Models\Telepites;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminCrudController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));

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
            ->get();

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

        return Inertia::render('Crud/Index', [
            'telepitesek' => $telepitesek,
            'gepek' => $gepek,
            'szoftverek' => $szoftverek,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'gep_id' => ['required', 'integer', 'exists:gepek,id'],
            'szoftver_id' => ['required', 'integer', 'exists:szoftverek,id'],
            'verzio' => ['nullable', 'string', 'max:255'],
            'datum' => ['nullable', 'date'],
        ]);

        Telepites::create($validated);

        return redirect()->back()->with('success', 'Telepítés sikeresen rögzítve.');
    }

    public function update(Request $request, Telepites $telepites): RedirectResponse
    {
        $validated = $request->validate([
            'gep_id' => ['required', 'integer', 'exists:gepek,id'],
            'szoftver_id' => ['required', 'integer', 'exists:szoftverek,id'],
            'verzio' => ['nullable', 'string', 'max:255'],
            'datum' => ['nullable', 'date'],
        ]);

        $telepites->update($validated);

        return redirect()->back()->with('success', 'Telepítés frissítve.');
    }

    public function destroy(Telepites $telepites): RedirectResponse
    {
        $telepites->delete();

        return redirect()->back()->with('success', 'Telepítés törölve.');
    }

    // --- Gépek CRUD ---

    private function gepRules(): array
    {
        return [
            'hely' => ['required', 'string', 'max:10'],
            'tipus' => ['required', 'in:asztali,notebook'],
            'ipcim' => ['required', 'ip', 'max:20'],
        ];
    }

    private function gepMessages(): array
    {
        return [
            'hely.required' => 'A hely megadása kötelező.',
            'hely.max' => 'A hely legfeljebb 10 karakter lehet.',
            'tipus.in' => 'A típus csak asztali vagy notebook lehet.',
            'ipcim.required' => 'Az IP-cím megadása kötelező.',
            'ipcim.ip' => 'Érvényes IP-címet adj meg.',
        ];
    }

    public function storeGep(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->gepRules(), $this->gepMessages());

        Gep::create($validated);

        return redirect()->back()->with('success', 'Gép sikeresen rögzítve.');
    }

    public function updateGep(Request $request, Gep $gep): RedirectResponse
    {
        $validated = $request->validate($this->gepRules(), $this->gepMessages());

        $gep->update($validated);

        return redirect()->back()->with('success', 'Gép frissítve.');
    }

    public function destroyGep(Gep $gep): RedirectResponse
    {
        // a gép telepítései az idegen kulcs (cascadeOnDelete) miatt vele együtt törlődnek
        $gep->delete();

        return redirect()->back()->with('success', 'Gép törölve.');
    }

    // --- Szoftverek CRUD ---

    private function szoftverRules(): array
    {
        return [
            'nev' => ['required', 'string', 'max:100'],
            'kategoria' => ['required', 'string', 'max:60'],
        ];
    }

    private function szoftverMessages(): array
    {
        return [
            'nev.required' => 'A szoftver nevének megadása kötelező.',
            'nev.max' => 'A név legfeljebb 100 karakter lehet.',
            'kategoria.required' => 'A kategória megadása kötelező.',
            'kategoria.max' => 'A kategória legfeljebb 60 karakter lehet.',
        ];
    }

    public function storeSzoftver(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->szoftverRules(), $this->szoftverMessages());

        Szoftver::create($validated);

        return redirect()->back()->with('success', 'Szoftver sikeresen rögzítve.');
    }

    public function updateSzoftver(Request $request, Szoftver $szoftver): RedirectResponse
    {
        $validated = $request->validate($this->szoftverRules(), $this->szoftverMessages());

        $szoftver->update($validated);

        return redirect()->back()->with('success', 'Szoftver frissítve.');
    }

    public function destroySzoftver(Szoftver $szoftver): RedirectResponse
    {
        // a szoftver telepítései az idegen kulcs (cascadeOnDelete) miatt vele együtt törlődnek
        $szoftver->delete();

        return redirect()->back()->with('success', 'Szoftver törölve.');
    }
}