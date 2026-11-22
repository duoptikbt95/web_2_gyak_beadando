import PublicLayout from '@/layouts/PublicLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

interface GepItem {
    id: number;
    hely: string;
    tipus: string;
    ipcim: string;
}

interface SzoftverItem {
    id: number;
    nev: string;
    kategoria?: string | null;
}

interface TelepitesItem {
    id: number;
    gep_id: number;
    szoftver_id: number;
    verzio?: string | null;
    datum?: string | null;
    gep?: GepItem | null;
    szoftver?: SzoftverItem | null;
}

interface CrudProps {
    telepitesek: TelepitesItem[];
    gepek: GepItem[];
    szoftverek: SzoftverItem[];
    filters?: {
        search?: string;
    };
}

export default function CrudIndex({
    telepitesek,
    gepek,
    szoftverek,
    filters,
}: CrudProps) {
    const [activeTab, setActiveTab] = useState<'telepitesek' | 'gepek' | 'szoftverek'>(
        'telepitesek',
    );
    const [search, setSearch] = useState(filters?.search ?? '');

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            '/crud',
            search.trim() ? { search: search.trim() } : {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleClearSearch = () => {
        setSearch('');
        router.get(
            '/crud',
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    // --- Telepítés CRUD state ---
    const [editingTelepitesId, setEditingTelepitesId] = useState<number | null>(null);
    const telepitesForm = useForm<{
        gep_id: number | '';
        szoftver_id: number | '';
        verzio: string;
        datum: string;
    }>({
        gep_id: gepek[0]?.id ?? '',
        szoftver_id: szoftverek[0]?.id ?? '',
        verzio: '',
        datum: new Date().toISOString().slice(0, 10),
    });

    const startEditTelepites = (item: TelepitesItem) => {
        setEditingTelepitesId(item.id);
        telepitesForm.setData({
            gep_id: item.gep_id,
            szoftver_id: item.szoftver_id,
            verzio: item.verzio ?? '',
            datum: item.datum ? item.datum.slice(0, 10) : '',
        });
    };

    const cancelEditTelepites = () => {
        setEditingTelepitesId(null);
        telepitesForm.reset();
    };

    const handleTelepitesSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (editingTelepitesId !== null) {
            telepitesForm.put(`/crud/${editingTelepitesId}`, {
                onSuccess: () => cancelEditTelepites(),
            });
        } else {
            telepitesForm.post('/crud', {
                onSuccess: () => telepitesForm.reset(),
            });
        }
    };

    const handleDeleteTelepites = (id: number) => {
        if (confirm('Biztosan törlöd ezt a telepítési bejegyzést?')) {
            router.delete(`/crud/${id}`);
        }
    };

    // --- Gép CRUD state ---
    const [editingGepId, setEditingGepId] = useState<number | null>(null);
    const gepForm = useForm<{
        hely: string;
        tipus: string;
        ipcim: string;
    }>({
        hely: '',
        tipus: 'asztali',
        ipcim: '',
    });

    const startEditGep = (gep: GepItem) => {
        setEditingGepId(gep.id);
        gepForm.setData({
            hely: gep.hely,
            tipus: gep.tipus,
            ipcim: gep.ipcim,
        });
    };

    const cancelEditGep = () => {
        setEditingGepId(null);
        gepForm.reset();
    };

    const handleGepSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (editingGepId !== null) {
            gepForm.put(`/crud/gepek/${editingGepId}`, {
                onSuccess: () => cancelEditGep(),
            });
        } else {
            gepForm.post('/crud/gepek', {
                onSuccess: () => cancelEditGep(),
            });
        }
    };

    const handleDeleteGep = (id: number) => {
        if (confirm('Biztosan törlöd ezt a gépet?')) {
            router.delete(`/crud/gepek/${id}`);
        }
    };

    // --- Szoftver CRUD state ---
    const [editingSzoftverId, setEditingSzoftverId] = useState<number | null>(null);
    const szoftverForm = useForm<{
        nev: string;
        kategoria: string;
    }>({
        nev: '',
        kategoria: '',
    });

    const startEditSzoftver = (szoftver: SzoftverItem) => {
        setEditingSzoftverId(szoftver.id);
        szoftverForm.setData({
            nev: szoftver.nev,
            kategoria: szoftver.kategoria ?? '',
        });
    };

    const cancelEditSzoftver = () => {
        setEditingSzoftverId(null);
        szoftverForm.reset();
    };

    const handleSzoftverSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (editingSzoftverId !== null) {
            szoftverForm.put(`/crud/szoftverek/${editingSzoftverId}`, {
                onSuccess: () => cancelEditSzoftver(),
            });
        } else {
            szoftverForm.post('/crud/szoftverek', {
                onSuccess: () => cancelEditSzoftver(),
            });
        }
    };

    const handleDeleteSzoftver = (id: number) => {
        if (confirm('Biztosan törlöd ezt a szoftvert?')) {
            router.delete(`/crud/szoftverek/${id}`);
        }
    };

    return (
        <PublicLayout>
            <Head title="Admin CRUD" />

            <div className="mx-auto w-full max-w-6xl px-6 py-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="mb-1 text-2xl font-bold">
                            Admin CRUD – Minden adat kezelése
                        </h1>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Telepítések, gépek és szoftverek létrehozása, módosítása és törlése.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab('telepitesek')}
                            className={`rounded-md px-4 py-2 text-sm font-medium ${
                                activeTab === 'telepitesek'
                                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                                    : 'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300'
                            }`}
                        >
                            Telepítések ({telepitesek.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('gepek')}
                            className={`rounded-md px-4 py-2 text-sm font-medium ${
                                activeTab === 'gepek'
                                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                                    : 'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300'
                            }`}
                        >
                            Gépek ({gepek.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('szoftverek')}
                            className={`rounded-md px-4 py-2 text-sm font-medium ${
                                activeTab === 'szoftverek'
                                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                                    : 'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300'
                            }`}
                        >
                            Szoftverek ({szoftverek.length})
                        </button>
                    </div>
                </div>

                <form
                    onSubmit={handleSearchSubmit}
                    className="mb-6 flex flex-wrap items-center gap-2"
                >
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Keresés hely, típus, IP, szoftver, kategória vagy verzió alapján..."
                        className="w-full max-w-md rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-neutral-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
                    />
                    <button
                        type="submit"
                        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                    >
                        Szűrés
                    </button>
                    {(search || filters?.search) && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        >
                            Szűrés törlése
                        </button>
                    )}
                </form>

                {activeTab === 'telepitesek' && (
                    <>
                        <form
                            onSubmit={handleTelepitesSubmit}
                            className="mb-8 grid grid-cols-1 gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-5 dark:border-neutral-800 dark:bg-neutral-900"
                        >
                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase">
                                    Gép (Hely / Típus / IP)
                                </label>
                                <select
                                    value={telepitesForm.data.gep_id}
                                    onChange={(e) =>
                                        telepitesForm.setData(
                                            'gep_id',
                                            e.target.value ? Number(e.target.value) : '',
                                        )
                                    }
                                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                                >
                                    {gepek.map((g) => (
                                        <option key={g.id} value={g.id}>
                                            {g.hely} ({g.tipus} – {g.ipcim})
                                        </option>
                                    ))}
                                </select>
                                {telepitesForm.errors.gep_id && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {telepitesForm.errors.gep_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase">
                                    Szoftver
                                </label>
                                <select
                                    value={telepitesForm.data.szoftver_id}
                                    onChange={(e) =>
                                        telepitesForm.setData(
                                            'szoftver_id',
                                            e.target.value ? Number(e.target.value) : '',
                                        )
                                    }
                                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                                >
                                    {szoftverek.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.nev}
                                            {s.kategoria ? ` (${s.kategoria})` : ''}
                                        </option>
                                    ))}
                                </select>
                                {telepitesForm.errors.szoftver_id && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {telepitesForm.errors.szoftver_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase">
                                    Verzió
                                </label>
                                <input
                                    type="text"
                                    value={telepitesForm.data.verzio}
                                    onChange={(e) =>
                                        telepitesForm.setData('verzio', e.target.value)
                                    }
                                    placeholder="pl. ver16.04"
                                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                                />
                                {telepitesForm.errors.verzio && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {telepitesForm.errors.verzio}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase">
                                    Dátum
                                </label>
                                <input
                                    type="date"
                                    value={telepitesForm.data.datum}
                                    onChange={(e) =>
                                        telepitesForm.setData('datum', e.target.value)
                                    }
                                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                                />
                                {telepitesForm.errors.datum && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {telepitesForm.errors.datum}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-end gap-2">
                                <button
                                    type="submit"
                                    disabled={telepitesForm.processing}
                                    className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50 dark:bg-white dark:text-neutral-900"
                                >
                                    {editingTelepitesId !== null ? 'Mentés' : 'Hozzáadás'}
                                </button>
                                {editingTelepitesId !== null && (
                                    <button
                                        type="button"
                                        onClick={cancelEditTelepites}
                                        className="rounded-md border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                                    >
                                        Mégse
                                    </button>
                                )}
                            </div>
                        </form>

                        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
                                    <tr>
                                        <th className="px-4 py-3">Gép</th>
                                        <th className="px-4 py-3">Szoftver</th>
                                        <th className="px-4 py-3">Verzió</th>
                                        <th className="px-4 py-3">Dátum</th>
                                        <th className="px-4 py-3 text-right">Műveletek</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                    {telepitesek.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-4 py-8 text-center text-neutral-500"
                                            >
                                                Nincs megjeleníthető telepítés.
                                            </td>
                                        </tr>
                                    ) : (
                                        telepitesek.map((t) => (
                                            <tr
                                                key={t.id}
                                                className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                                            >
                                                <td className="px-4 py-3 font-medium">
                                                    {t.gep
                                                        ? `${t.gep.hely} (${t.gep.tipus}, ${t.gep.ipcim})`
                                                        : `Gép #${t.gep_id}`}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {t.szoftver?.nev ?? `Szoftver #${t.szoftver_id}`}
                                                    {t.szoftver?.kategoria ? (
                                                        <span className="ml-1.5 text-xs text-neutral-500">
                                                            ({t.szoftver.kategoria})
                                                        </span>
                                                    ) : null}
                                                </td>
                                                <td className="px-4 py-3">{t.verzio ?? '—'}</td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {t.datum ?? '—'}
                                                </td>
                                                <td className="px-4 py-3 text-right whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => startEditTelepites(t)}
                                                        className="mr-2 rounded-md border border-neutral-300 px-2.5 py-1 text-xs font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                                                    >
                                                        Szerkesztés
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteTelepites(t.id)}
                                                        className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700"
                                                    >
                                                        Törlés
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeTab === 'gepek' && (
                    <>
                        <form
                            onSubmit={handleGepSubmit}
                            className="mb-8 grid grid-cols-1 gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4 dark:border-neutral-800 dark:bg-neutral-900"
                        >
                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase">
                                    Hely (pl. T305)
                                </label>
                                <input
                                    type="text"
                                    value={gepForm.data.hely}
                                    onChange={(e) => gepForm.setData('hely', e.target.value)}
                                    placeholder="pl. T305"
                                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                                />
                                {gepForm.errors.hely && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {gepForm.errors.hely}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase">
                                    Típus
                                </label>
                                <select
                                    value={gepForm.data.tipus}
                                    onChange={(e) => gepForm.setData('tipus', e.target.value)}
                                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                                >
                                    <option value="asztali">asztali</option>
                                    <option value="notebook">notebook</option>
                                </select>
                                {gepForm.errors.tipus && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {gepForm.errors.tipus}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase">
                                    IP-cím
                                </label>
                                <input
                                    type="text"
                                    value={gepForm.data.ipcim}
                                    onChange={(e) => gepForm.setData('ipcim', e.target.value)}
                                    placeholder="pl. 192.168.3.50"
                                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                                />
                                {gepForm.errors.ipcim && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {gepForm.errors.ipcim}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-end gap-2">
                                <button
                                    type="submit"
                                    disabled={gepForm.processing}
                                    className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50 dark:bg-white dark:text-neutral-900"
                                >
                                    {editingGepId !== null ? 'Mentés' : 'Új gép'}
                                </button>
                                {editingGepId !== null && (
                                    <button
                                        type="button"
                                        onClick={cancelEditGep}
                                        className="rounded-md border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                                    >
                                        Mégse
                                    </button>
                                )}
                            </div>
                        </form>

                        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
                                    <tr>
                                        <th className="px-4 py-3">Hely</th>
                                        <th className="px-4 py-3">Típus</th>
                                        <th className="px-4 py-3">IP-cím</th>
                                        <th className="px-4 py-3 text-right">Műveletek</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                    {gepek.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-4 py-8 text-center text-neutral-500"
                                            >
                                                Nincs a szűrésnek megfelelő gép.
                                            </td>
                                        </tr>
                                    ) : (
                                        gepek.map((g) => (
                                            <tr
                                                key={g.id}
                                                className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                                            >
                                                <td className="px-4 py-3 font-medium">{g.hely}</td>
                                                <td className="px-4 py-3">{g.tipus}</td>
                                                <td className="px-4 py-3">{g.ipcim}</td>
                                                <td className="px-4 py-3 text-right whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => startEditGep(g)}
                                                        className="mr-2 rounded-md border border-neutral-300 px-2.5 py-1 text-xs font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                                                    >
                                                        Szerkesztés
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteGep(g.id)}
                                                        className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700"
                                                    >
                                                        Törlés
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeTab === 'szoftverek' && (
                    <>
                        <form
                            onSubmit={handleSzoftverSubmit}
                            className="mb-8 grid grid-cols-1 gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-3 dark:border-neutral-800 dark:bg-neutral-900"
                        >
                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase">
                                    Szoftver neve
                                </label>
                                <input
                                    type="text"
                                    value={szoftverForm.data.nev}
                                    onChange={(e) => szoftverForm.setData('nev', e.target.value)}
                                    placeholder="pl. Visual Studio Code"
                                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                                />
                                {szoftverForm.errors.nev && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {szoftverForm.errors.nev}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase">
                                    Kategória
                                </label>
                                <input
                                    type="text"
                                    value={szoftverForm.data.kategoria}
                                    onChange={(e) =>
                                        szoftverForm.setData('kategoria', e.target.value)
                                    }
                                    placeholder="pl. fejlesztő környezet"
                                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                                />
                                {szoftverForm.errors.kategoria && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {szoftverForm.errors.kategoria}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-end gap-2">
                                <button
                                    type="submit"
                                    disabled={szoftverForm.processing}
                                    className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50 dark:bg-white dark:text-neutral-900"
                                >
                                    {editingSzoftverId !== null ? 'Mentés' : 'Új szoftver'}
                                </button>
                                {editingSzoftverId !== null && (
                                    <button
                                        type="button"
                                        onClick={cancelEditSzoftver}
                                        className="rounded-md border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                                    >
                                        Mégse
                                    </button>
                                )}
                            </div>
                        </form>

                        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
                                    <tr>
                                        <th className="px-4 py-3">Név</th>
                                        <th className="px-4 py-3">Kategória</th>
                                        <th className="px-4 py-3 text-right">Műveletek</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                    {szoftverek.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="px-4 py-8 text-center text-neutral-500"
                                            >
                                                Nincs a szűrésnek megfelelő szoftver.
                                            </td>
                                        </tr>
                                    ) : (
                                        szoftverek.map((s) => (
                                            <tr
                                                key={s.id}
                                                className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                                            >
                                                <td className="px-4 py-3 font-medium">{s.nev}</td>
                                                <td className="px-4 py-3">{s.kategoria ?? '—'}</td>
                                                <td className="px-4 py-3 text-right whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => startEditSzoftver(s)}
                                                        className="mr-2 rounded-md border border-neutral-300 px-2.5 py-1 text-xs font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                                                    >
                                                        Szerkesztés
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteSzoftver(s.id)}
                                                        className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700"
                                                    >
                                                        Törlés
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </PublicLayout>
    );
}