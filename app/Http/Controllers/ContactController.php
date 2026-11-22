<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    private function isAdmin($user): bool
    {
        return (bool) ($user && ((bool) ($user->is_admin ?? false) || ($user->role ?? '') === 'admin'));
    }

    public function create(): Response
    {
        return Inertia::render('Contact/Index');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:150'],
            'subject' => ['nullable', 'string', 'max:150'],
            'message' => ['required', 'string', 'min:5', 'max:2000'],
        ], [
            'name.required' => 'A név megadása kötelező.',
            'email.required' => 'Az e-mail cím megadása kötelező.',
            'email.email' => 'Érvényes e-mail címet adj meg.',
            'message.required' => 'Az üzenet szövegének megadása kötelező.',
            'message.min' => 'Az üzenet legyen legalább 5 karakter hosszú.',
        ]);

        Message::create($validated);

        return back()->with('success', 'Köszönjük! Az üzeneted sikeresen elmentettük.');
    }

    public function index(): Response
    {
        $messages = Message::orderBy('created_at', 'desc')->get();

        return Inertia::render('Contact/Messages', [
            'messages' => $messages,
        ]);
    }

    public function destroy(Request $request, Message $message): RedirectResponse
    {
        if (! $this->isAdmin($request->user())) {
            abort(403, 'Nincs jogosultságod üzenet törléséhez.');
        }

        $message->delete();

        return back()->with('success', 'Az üzenet sikeresen törölve.');
    }
}