import PublicLayout from '@/layouts/PublicLayout';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user && (auth.user as any).role === 'admin';

    return (
        <PublicLayout>
            <Head title="Főoldal - Szoftverleltár" />

            <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-12 sm:py-16">
                {/* Hero szekció */}
                <section className="mb-12 rounded-2xl border border-neutral-200/90 bg-gradient-to-b from-white to-neutral-50/70 px-6 py-10 text-center shadow-sm sm:px-12 sm:py-12 dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-950">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-xs font-medium text-amber-800 dark:border-amber-800/60 dark:bg-amber-950/50 dark:text-amber-300">
                        <span>Gépek · Szoftverek · Telepítések</span>
                    </div>

                    <h1 className="mx-auto mb-4 max-w-3xl text-3xl font-bold tracking-tight text-neutral-900 sm:text-5xl dark:text-white">
                        Intézményi Szoftver- és{' '}
                        <span className="text-amber-700 dark:text-amber-400">
                            Gépnyilvántartás
                        </span>
                    </h1>

                    <p className="mx-auto mb-7 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-400">
                        Egy helyen átláthatod az intézmény gépparkját, a telepített szoftvereket és a
                        legfontosabb statisztikákat — gyorsan, felesleges körök nélkül.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href="/adatbazis"
                            className="rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                        >
                            Adatbázis megnyitása
                        </Link>
                        <Link
                            href="/diagram"
                            className="rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                        >
                            Diagramok megnézése
                        </Link>
                        {auth.user && (
                            <Link
                                href="/dashboard"
                                className="rounded-xl border border-amber-300 bg-amber-50/70 px-5 py-2.5 text-sm font-medium text-amber-900 transition hover:bg-amber-100/80 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-950/70"
                            >
                                Dashboard
                            </Link>
                        )}
                    </div>
                </section>

                {/* Kártyák rácsa */}
                <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <Link
                        href="/adatbazis"
                        className="group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600"
                    >
                        <div>
                            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-2xl dark:bg-neutral-800">
                                🗄️
                            </div>
                            <h2 className="mb-2 text-lg font-semibold text-neutral-900 group-hover:text-amber-700 dark:text-white dark:group-hover:text-amber-400">
                                Adatbázis leltár
                            </h2>
                            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                                Gépek, szoftverek és a hozzájuk tartozó telepítések böngészése egy
                                átlátható felületen.
                            </p>
                        </div>
                        <div className="mt-5 text-xs font-medium text-neutral-500 transition group-hover:translate-x-0.5 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
                            Leltár böngészése →
                        </div>
                    </Link>

                    <Link
                        href="/diagram"
                        className="group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600"
                    >
                        <div>
                            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-2xl dark:bg-neutral-800">
                                📊
                            </div>
                            <h2 className="mb-2 text-lg font-semibold text-neutral-900 group-hover:text-amber-700 dark:text-white dark:group-hover:text-amber-400">
                                Statisztika & Diagram
                            </h2>
                            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                                Géptípusok aránya és a telepített szoftverek megoszlása vizuális
                                diagramokon.
                            </p>
                        </div>
                        <div className="mt-5 text-xs font-medium text-neutral-500 transition group-hover:translate-x-0.5 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
                            Kimutatások megnyitása →
                        </div>
                    </Link>

                    <Link
                        href="/kapcsolat"
                        className="group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600"
                    >
                        <div>
                            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-2xl dark:bg-neutral-800">
                                ✉️
                            </div>
                            <h2 className="mb-2 text-lg font-semibold text-neutral-900 group-hover:text-amber-700 dark:text-white dark:group-hover:text-amber-400">
                                Kapcsolatfelvétel
                            </h2>
                            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                                Kérdés, észrevétel vagy hiányzó adat? Írj üzenetet közvetlenül a
                                karbantartóknak.
                            </p>
                        </div>
                        <div className="mt-5 text-xs font-medium text-neutral-500 transition group-hover:translate-x-0.5 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
                            Üzenet küldése →
                        </div>
                    </Link>

                    {auth.user && (
                        <Link
                            href="/uzenetek"
                            className="group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600"
                        >
                            <div>
                                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-2xl dark:bg-neutral-800">
                                    📥
                                </div>
                                <h2 className="mb-2 text-lg font-semibold text-neutral-900 group-hover:text-amber-700 dark:text-white dark:group-hover:text-amber-400">
                                    Beérkezett üzenetek
                                </h2>
                                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                                    A kapcsolat űrlapon beérkezett üzenetek áttekintése időrendben.
                                </p>
                            </div>
                            <div className="mt-5 text-xs font-medium text-neutral-500 transition group-hover:translate-x-0.5 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
                                Üzenetek listája →
                            </div>
                        </Link>
                    )}

                    {isAdmin && (
                        <Link
                            href="/crud"
                            className="group flex flex-col justify-between rounded-2xl border border-amber-300/90 bg-amber-50/50 p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-amber-500 hover:shadow-md dark:border-amber-800/70 dark:bg-amber-950/25"
                        >
                            <div>
                                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-2xl dark:bg-amber-900/50">
                                    ⚙️
                                </div>
                                <h2 className="mb-2 text-lg font-semibold text-amber-900 group-hover:underline dark:text-amber-300">
                                    Adminisztráció (CRUD)
                                </h2>
                                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                                    Gépek, szoftverek és telepítések felvétele, módosítása és
                                    törlése.
                                </p>
                            </div>
                            <div className="mt-5 text-xs font-semibold text-amber-800 transition group-hover:translate-x-0.5 dark:text-amber-300">
                                Kezelőfelület megnyitása →
                            </div>
                        </Link>
                    )}
                </section>
            </main>
        </PublicLayout>
    );
}