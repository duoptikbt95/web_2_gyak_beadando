import PublicLayout from '@/layouts/PublicLayout';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState } from 'react';

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

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedTelepitesek {
    data: TelepitesItem[];
    total?: number;
    links?: PaginationLink[];
}

interface DatabaseProps {
    gepek: GepItem[];
    szoftverek: SzoftverItem[];
    telepitesek: PaginatedTelepitesek | TelepitesItem[];
    filters?: {
        search?: string;
    };
}

export default function Index({
    gepek,
    szoftverek,
    telepitesek,
    filters,
}: DatabaseProps) {
    const [activeTab, setActiveTab] = useState<'telepitesek' | 'gepek' | 'szoftverek'>(
        'telepitesek',
    );
    const [search, setSearch] = useState(filters?.search ?? '');

    const telepitesLista = Array.isArray(telepitesek)
        ? telepitesek
        : (telepitesek?.data ?? []);
    const telepitesOsszes = Array.isArray(telepitesek)
        ? telepitesek.length
        : (telepitesek?.total ?? telepitesLista.length);
    const lapozoLinkek = Array.isArray(telepitesek) ? [] : (telepitesek?.links ?? []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/adatbazis',
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
            '/adatbazis',
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <PublicLayout>
            <Head title="Adatbázis" />

            <div className="mx-auto w-full max-w-6xl px-6 py-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="mb-1 text-2xl font-bold">
                            Adatbázis leltár
                        </h1>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            A gépek, szoftverek és telepítések adatai külön fülekre bontva.
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
                            Telepítések ({telepitesOsszes})
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
                    <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
                                <tr>
                                    <th className="px-4 py-3">Gép</th>
                                    <th className="px-4 py-3">Szoftver</th>
                                    <th className="px-4 py-3">Verzió</th>
                                    <th className="px-4 py-3">Dátum</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {telepitesLista.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-8 text-center text-neutral-500"
                                        >
                                            Nincs megjeleníthető telepítés.
                                        </td>
                                    </tr>
                                ) : (
                                    telepitesLista.map((t) => (
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
                                            <td className="px-4 py-3">
                                                {t.verzio ?? '—'}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {t.datum ?? '—'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {lapozoLinkek.length > 3 && (
                            <div className="flex flex-wrap items-center justify-center gap-1 border-t border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950">
                                {lapozoLinkek.map((link, idx) =>
                                    link.url ? (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            preserveScroll
                                            className={`rounded-md px-3 py-1 text-xs font-medium ${
                                                link.active
                                                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                                                    : 'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={idx}
                                            className="rounded-md px-3 py-1 text-xs text-neutral-400"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ),
                                )}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'gepek' && (
                    <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
                                <tr>
                                    <th className="px-4 py-3">ID</th>
                                    <th className="px-4 py-3">Hely</th>
                                    <th className="px-4 py-3">Típus</th>
                                    <th className="px-4 py-3">IP-cím</th>
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
                                    gepek.map((gep) => (
                                        <tr
                                            key={gep.id}
                                            className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                                        >
                                            <td className="px-4 py-3">{gep.id}</td>
                                            <td className="px-4 py-3 font-medium">{gep.hely}</td>
                                            <td className="px-4 py-3">{gep.tipus}</td>
                                            <td className="px-4 py-3">{gep.ipcim}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'szoftverek' && (
                    <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
                                <tr>
                                    <th className="px-4 py-3">ID</th>
                                    <th className="px-4 py-3">Név</th>
                                    <th className="px-4 py-3">Kategória</th>
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
                                    szoftverek.map((szoftver) => (
                                        <tr
                                            key={szoftver.id}
                                            className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                                        >
                                            <td className="px-4 py-3">{szoftver.id}</td>
                                            <td className="px-4 py-3 font-medium">{szoftver.nev}</td>
                                            <td className="px-4 py-3">{szoftver.kategoria ?? '—'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}