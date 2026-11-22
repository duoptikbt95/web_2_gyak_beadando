<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class UserRoleController extends Controller
{
    private function isAdmin($user): bool
    {
        return (bool) ($user && ((bool) ($user->is_admin ?? false) || ($user->role ?? '') === 'admin'));
    }

    public function index(Request $request)
    {
        if (! $this->isAdmin($request->user())) {
            abort(403, 'Nincs jogosultságod az oldal megtekintéséhez.');
        }

        $users = User::orderBy('id')->get()->map(function ($u) {
            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'is_admin' => (bool) ($u->is_admin ?? false) || ($u->role ?? '') === 'admin',
                'created_at' => optional($u->created_at)->format('Y-m-d H:i'),
            ];
        });

        return Inertia::render('Jogosultsagok', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        if (! $this->isAdmin($request->user())) {
            abort(403, 'Nincs jogosultságod felhasználó létrehozásához.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', Password::defaults()],
            'is_admin' => ['nullable', 'boolean'],
        ]);

        $isAdmin = (bool) ($validated['is_admin'] ?? false);

        $newUser = new User();
        $newUser->name = $validated['name'];
        $newUser->email = $validated['email'];
        $newUser->password = Hash::make($validated['password']);

        if (Schema::hasColumn('users', 'is_admin')) {
            $newUser->is_admin = $isAdmin;
        }
        if (Schema::hasColumn('users', 'role')) {
            $newUser->role = $isAdmin ? 'admin' : 'user';
        }

        $newUser->save();

        return back()->with('success', "Új felhasználó létrehozva: {$newUser->name}");
    }

    public function update(Request $request, User $targetUser)
    {
        $currentUser = $request->user();

        if (! $this->isAdmin($currentUser)) {
            abort(403, 'Nincs jogosultságod a módosításhoz.');
        }

        if ($currentUser->id === $targetUser->id) {
            return back()->with('error', 'A saját admin jogosultságodat nem módosíthatod.');
        }

        $validated = $request->validate([
            'is_admin' => ['required', 'boolean'],
        ]);

        if (Schema::hasColumn('users', 'is_admin')) {
            $targetUser->is_admin = $validated['is_admin'];
        }

        if (Schema::hasColumn('users', 'role')) {
            $targetUser->role = $validated['is_admin'] ? 'admin' : 'user';
        }

        $targetUser->save();

        return back()->with('success', "{$targetUser->name} jogosultsága frissítve.");
    }

    public function destroy(Request $request, User $targetUser)
    {
        $currentUser = $request->user();

        if (! $this->isAdmin($currentUser)) {
            abort(403, 'Nincs jogosultságod felhasználó törléséhez.');
        }

        if ($currentUser->id === $targetUser->id) {
            return back()->with('error', 'A saját fiókodat nem törölheted.');
        }

        $deletedName = $targetUser->name;
        $targetUser->delete();

        return back()->with('success', "Felhasználó törölve: {$deletedName}");
    }
    public function updatePassword(Request $request, User $targetUser)
    {
        if (! $this->isAdmin($request->user())) {
            abort(403, 'Nincs jogosultságod jelszó módosításához.');
        }

        $validated = $request->validate([
            'password' => ['required', Password::defaults()],
        ]);

        $targetUser->password = Hash::make($validated['password']);
        $targetUser->save();

        return back()->with('success', "{$targetUser->name} új jelszava sikeresen beállítva.");
    }
}