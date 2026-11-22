import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';

interface UserItem {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    created_at?: string;
}

interface PageProps {
    auth?: {
        user?: {
            id?: number;
            name?: string;
            is_admin?: boolean | number;
            role?: string;
        } | null;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    errors?: Record<string, string>;
    [key: string]: unknown;
}

export default function Jogosultsagok({ users }: { users: UserItem[] }) {
    const { props } = usePage<PageProps>();
    const currentUser = props.auth?.user;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    // Meglévő felhasználó új jelszavához
    const [editingPasswordUserId, setEditingPasswordUserId] = useState<number | null>(null);
    const [newPassword, setNewPassword] = useState('');

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            '/jogosultsagok',
            { name, email, password, is_admin: isAdmin },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setName('');
                    setEmail('');
                    setPassword('');
                    setIsAdmin(false);
                },
            }
        );
    };

    const handleRoleChange = (user: UserItem, newIsAdmin: boolean) => {
        router.patch(
            `/jogosultsagok/${user.id}`,
            { is_admin: newIsAdmin },
            { preserveScroll: true }
        );
    };

    const handleOpenPasswordForm = (userId: number) => {
        if (editingPasswordUserId === userId) {
            setEditingPasswordUserId(null);
            setNewPassword('');
        } else {
            setEditingPasswordUserId(userId);
            setNewPassword('');
        }
    };

    const handlePasswordSubmit = (e: React.FormEvent, userId: number) => {
        e.preventDefault();
        router.patch(
            `/jogosultsagok/${userId}/password`,
            { password: newPassword },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingPasswordUserId(null);
                    setNewPassword('');
                },
            }
        );
    };

    const handleDeleteUser = (user: UserItem) => {
        if (!window.confirm(`Biztosan törlöd ezt a felhasználót: ${user.name} (${user.email})?`)) {
            return;
        }
        router.delete(`/jogosultsagok/${user.id}`, { preserveScroll: true });
    };

    return (
        <PublicLayout>
            <Head title="Jogosultságok kezelése" />

            <main className="mx-auto w-full max-w-6xl px-6 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">
                        Felhasználói jogosultságok és fiókok kezelése
                    </h1>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                        Új felhasználó felvétele, szerepkör módosítása, jelszó beállítása és fiókok törlése.
                    </p>
                </div>

                {props.flash?.success && (
                    <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                        {props.flash.success}
                    </div>
                )}

                {props.flash?.error && (
                    <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                        {props.flash.error}
                    </div>
                )}

                {props.errors?.password && editingPasswordUserId !== null && (
                    <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                        {props.errors.password}
                    </div>
                )}

                {/* Új felhasználó űrlap */}
                <form
                    onSubmit={handleCreateUser}
                    className="mb-8 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                >
                    <h2 className="mb-4 text-base font-semibold">
                        Új felhasználó felvétele
                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label className="mb-1 block text-xs font-medium">
                                Név
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
                            />
                            {props.errors?.name && (
                                <p className="mt-1 text-xs text-red-600">{props.errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium">
                                E-mail cím
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
                            />
                            {props.errors?.email && (
                                <p className="mt-1 text-xs text-red-600">{props.errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium">
                                Jelszó
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
                            />
                            {editingPasswordUserId === null && props.errors?.password && (
                                <p className="mt-1 text-xs text-red-600">{props.errors.password}</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                                className="rounded border-neutral-300"
                            />
                            Adminisztrátori jogosultság adása
                        </label>

                        <button
                            type="submit"
                            className="rounded-md bg-neutral-900 px-4 py-2 text-xs font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                        >
                            Felhasználó létrehozása
                        </button>
                    </div>
                </form>

                {/* Felhasználók táblázata */}
                <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <table className="min-w-full divide-y divide-neutral-200 text-sm dark:divide-neutral-800">
                        <thead className="bg-neutral-100 text-left text-xs font-semibold uppercase text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                            <tr>
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">Név</th>
                                <th className="px-4 py-3">E-mail</th>
                                <th className="px-4 py-3">Szerepkör</th>
                                <th className="px-4 py-3 text-right">Műveletek</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                            {users.map((u) => {
                                const isSelf = currentUser?.id === u.id;
                                const isEditingPwd = editingPasswordUserId === u.id;

                                return (
                                    <React.Fragment key={u.id}>
                                        <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                            <td className="px-4 py-3 text-neutral-500">#{u.id}</td>
                                            <td className="px-4 py-3 font-medium">
                                                {u.name}{' '}
                                                {isSelf && (
                                                    <span className="ml-1 rounded bg-neutral-200 px-2 py-0.5 text-xs text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200">
                                                        Te
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                                                {u.email}
                                            </td>
                                            <td className="px-4 py-3">
                                                {u.is_admin ? (
                                                    <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                                                        Admin
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                                                        Felhasználó
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="inline-flex flex-wrap items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenPasswordForm(u.id)}
                                                        className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                                                    >
                                                        Új jelszó
                                                    </button>

                                                    {!isSelf && (
                                                        <>
                                                            {u.is_admin ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRoleChange(u, false)}
                                                                    className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                                                                >
                                                                    Admin jog elvétele
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRoleChange(u, true)}
                                                                    className="rounded-md bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700"
                                                                >
                                                                    Adminná tétel
                                                                </button>
                                                            )}

                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteUser(u)}
                                                                className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                                                            >
                                                                Törlés
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>

                                        {isEditingPwd && (
                                            <tr className="bg-neutral-50 dark:bg-neutral-800/40">
                                                <td colSpan={5} className="px-4 py-3">
                                                    <form
                                                        onSubmit={(e) => handlePasswordSubmit(e, u.id)}
                                                        className="flex flex-wrap items-center justify-end gap-2"
                                                    >
                                                        <span className="mr-auto text-xs text-neutral-600 dark:text-neutral-400">
                                                            Új jelszó beállítása ehhez a fiókhoz: <strong>{u.name}</strong>
                                                        </span>
                                                        <input
                                                            type="password"
                                                            value={newPassword}
                                                            onChange={(e) => setNewPassword(e.target.value)}
                                                            placeholder="Új jelszó..."
                                                            required
                                                            className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-950"
                                                        />
                                                        <button
                                                            type="submit"
                                                            className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                                                        >
                                                            Jelszó mentése
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setEditingPasswordUserId(null);
                                                                setNewPassword('');
                                                            }}
                                                            className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                                                        >
                                                            Mégse
                                                        </button>
                                                    </form>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </main>
        </PublicLayout>
    );
}