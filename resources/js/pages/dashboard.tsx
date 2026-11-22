import AppLayout from '@/layouts/app-layout';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

interface GepSummary {
    id: number;
    hely: string;
    tipus: string;
    ipcim: string;
}

interface SzoftverSummary {
    id: number;
    nev: string;
    kategoria?: string | null;
}

interface TelepitesSummary {
    id: number;
    gep_id: number;
    szoftver_id: number;
    verzio?: string | null;
    datum?: string | null;
    gep?: GepSummary | null;
    szoftver?: SzoftverSummary | null;
}

interface UzenetSummary {
    id: number;
    name: string;
    email: string;
    subject?: string | null;
    message: string;
    created_at?: string | null;
}

interface DashboardStats {
    gepekCount: number;
    asztaliCount: number;
    notebookCount: number;
    szoftverekCount: number;
    kategoriakCount: number;
    telepitesekCount: number;
}

interface DashboardPageProps extends SharedData {
    stats?: DashboardStats;
    legutobbiTelepitesek?: TelepitesSummary[];
    legutobbiUzenetek?: UzenetSummary[];
}

export default function Dashboard() {
    const { props } = usePage<DashboardPageProps>();
    const user = props.auth.user as { name?: string; role?: string; is_admin?: boolean | number } | null;
    const isAdmin = Boolean(user && (user.role === 'admin' || Boolean(user.is_admin)));

    const stats: DashboardStats = {
        gepekCount: props.stats?.gepekCount ?? 0,
        asztaliCount: props.stats?.asztaliCount ?? 0,
        notebookCount: props.stats?.notebookCount ?? 0,
        szoftverekCount: props.stats?.szoftverekCount ?? 0,
        kategoriakCount: props.stats?.kategoriakCount ?? 0,
        telepitesekCount: props.stats?.telepitesekCount ?? 0,
    };

    const legutobbiTelepitesek = props.legutobbiTelepitesek ?? [];
    const legutobbiUzenetek = props.legutobbiUzenetek ?? [];

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-5 p-4 sm:p-6">
                {/* Fejléc és navigáció */}
                <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                                Szia, {user?.name}!
                            </h1>
                            <p className="text-sm text-neutral-500">
                                Szerepkör: <strong>{isAdmin ? 'admin' : (user?.role ?? 'user')}</strong>
                            </p>
                        </div>
                    </div>

                    <nav className="flex flex-wrap gap-2">
                        <Link
                            href="/"
                            className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                        >
                            Főoldal
                        </Link>
                        <Link
                            href="/adatbazis"
                            className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                        >
                            Adatbázis
                        </Link>
                        <Link
                            href="/diagram"
                            className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                        >
                            Diagram
                        </Link>
                        <Link
                            href="/kapcsolat"
                            className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                        >
                            Kapcsolat
                        </Link>
                        {isAdmin && (
                            <>
                                <Link
                                    href="/uzenetek"
                                    className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                                >
                                    Üzenetek
                                </Link>
                                <Link
                                    href="/crud"
                                    className="rounded-lg bg-amber-600 px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-amber-700"
                                >
                                    CRUD
                                </Link>
                            </>
                        )}
                    </nav>
                </div>

                {/* 3 statisztikai kártya */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Link
                        href="/adatbazis"
                        className="rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
                    >
                        <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                            Gépek
                        </div>
                        <div className="mt-2 text-3xl font-semibold text-neutral-900 dark:text-white">
                            {stats.gepekCount}
                        </div>
                        <div className="mt-2 text-xs text-neutral-500">
                            {stats.asztaliCount} asztali · {stats.notebookCount} notebook
                        </div>
                    </Link>

                    <Link
                        href="/diagram"
                        className="rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
                    >
                        <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                            Szoftverek
                        </div>
                        <div className="mt-2 text-3xl font-semibold text-neutral-900 dark:text-white">
                            {stats.szoftverekCount}
                        </div>
                        <div className="mt-2 text-xs text-neutral-500">
                            {stats.kategoriakCount} kategória
                        </div>
                    </Link>

                    <Link
                        href={isAdmin ? '/crud' : '/adatbazis'}
                        className="rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
                    >
                        <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                            Telepítések
                        </div>
                        <div className="mt-2 text-3xl font-semibold text-neutral-900 dark:text-white">
                            {stats.telepitesekCount}
                        </div>
                        <div className="mt-2 text-xs text-neutral-500">
                            {isAdmin ? 'Rögzített példányok · CRUD' : 'Rögzített példányok'}
                        </div>
                    </Link>
                </div>

                {/* Alsó rész: Legutóbbi telepítések + adminnál mellette az üzenetek */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div
                        className={`rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 ${
                            isAdmin ? 'lg:col-span-2' : 'lg:col-span-3'
                        }`}
                    >
                        <div className="mb-3 flex items-center justify-between gap-2">
                            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                                Legutóbbi telepítések
                            </h2>
                            {isAdmin && (
                                <Link
                                    href="/crud"
                                    className="text-xs font-medium text-amber-700 hover:underline dark:text-amber-400"
                                >
                                    Szerkesztés
                                </Link>
                            )}
                        </div>

                        <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-neutral-200 bg-neutral-50 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
                                    <tr>
                                        <th className="px-4 py-2.5 font-medium">Gép</th>
                                        <th className="px-4 py-2.5 font-medium">Szoftver</th>
                                        <th className="px-4 py-2.5 font-medium">Verzió</th>
                                        <th className="px-4 py-2.5 font-medium">Dátum</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                    {legutobbiTelepitesek.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-4 py-6 text-center text-neutral-500"
                                            >
                                                Még nincs telepítési adat.
                                            </td>
                                        </tr>
                                    ) : (
                                        legutobbiTelepitesek.map((t) => (
                                            <tr
                                                key={t.id}
                                                className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40"
                                            >
                                                <td className="px-4 py-2.5 font-medium text-neutral-800 dark:text-neutral-200">
                                                    {t.gep
                                                        ? `${t.gep.hely} (${t.gep.tipus}, ${t.gep.ipcim})`
                                                        : `Gép #${t.gep_id}`}
                                                </td>
                                                <td className="px-4 py-2.5 text-neutral-700 dark:text-neutral-300">
                                                    {t.szoftver?.nev ?? `Szoftver #${t.szoftver_id}`}
                                                </td>
                                                <td className="px-4 py-2.5 text-neutral-600 dark:text-neutral-400">
                                                    {t.verzio ?? '—'}
                                                </td>
                                                <td className="px-4 py-2.5 whitespace-nowrap text-neutral-600 dark:text-neutral-400">
                                                    {t.datum ?? '—'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {isAdmin && (
                        <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 lg:col-span-1">
                            <div>
                                <div className="mb-3 flex items-center justify-between gap-2">
                                    <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                                        Üzenetek
                                    </h2>
                                    <Link
                                        href="/uzenetek"
                                        className="text-xs font-medium text-neutral-600 hover:underline dark:text-neutral-400"
                                    >
                                        Összes
                                    </Link>
                                </div>

                                {legutobbiUzenetek.length === 0 ? (
                                    <p className="rounded-lg border border-neutral-200 p-4 text-center text-xs text-neutral-500 dark:border-neutral-800">
                                        Nincs új üzenet.
                                    </p>
                                ) : (
                                    <div className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
                                        {legutobbiUzenetek.map((m) => (
                                            <div key={m.id} className="p-3 text-xs">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="truncate font-medium text-neutral-900 dark:text-neutral-100">
                                                        {m.subject || 'Üzenet'}
                                                    </span>
                                                    {m.created_at && (
                                                        <span className="shrink-0 text-[11px] text-neutral-400">
                                                            {String(m.created_at).slice(0, 10)}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-0.5 truncate text-neutral-500">
                                                    {m.name}
                                                </p>
                                                <p className="mt-1 line-clamp-2 text-neutral-700 dark:text-neutral-300">
                                                    {m.message}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-2">
                                <Link
                                    href="/uzenetek"
                                    className="block w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-center text-xs font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                                >
                                    Üzenetek megnyitása
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}