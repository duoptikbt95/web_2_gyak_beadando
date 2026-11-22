import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface PublicLayoutProps {
    children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    const { url, props } = usePage<SharedData>();
    const { auth } = props;
    const user = auth.user as { role?: string; is_admin?: boolean | number } | null;
    const isAdmin = Boolean(user && (user.role === 'admin' || Boolean(user.is_admin)));

    const navLinkClass = (path: string) =>
        url === path
            ? 'text-neutral-900 underline decoration-2 underline-offset-4 dark:text-white'
            : 'text-neutral-600 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white';

    return (
        <div className="flex min-h-screen flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
            {/* Közös felső navigációs sáv */}
            <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/80">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
                    <Link href="/" className="text-lg font-bold tracking-tight">
                        💻 SzoftverLeltár
                    </Link>

                    <nav className="flex flex-wrap items-center gap-4 text-sm font-medium">
                        <Link href="/" className={navLinkClass('/')}>
                            Főoldal
                        </Link>
                        <Link href="/adatbazis" className={navLinkClass('/adatbazis')}>
                            Adatbázis
                        </Link>
                        <Link href="/diagram" className={navLinkClass('/diagram')}>
                            Diagram
                        </Link>
                        <Link href="/kapcsolat" className={navLinkClass('/kapcsolat')}>
                            Kapcsolat
                        </Link>

                        {auth.user && (
                            <Link href="/uzenetek" className={navLinkClass('/uzenetek')}>
                                Üzenetek
                            </Link>
                        )}

                        {isAdmin && (
                            <>
                                <Link
                                    href="/crud"
                                    className="font-semibold text-amber-600 transition hover:text-amber-700 dark:text-amber-400"
                                >
                                    CRUD (Admin)
                                </Link>
                                <Link
                                    href="/jogosultsagok"
                                    className={`font-semibold text-amber-600 transition hover:text-amber-700 dark:text-amber-400 ${
                                        url === '/jogosultsagok'
                                            ? 'underline decoration-2 underline-offset-4'
                                            : ''
                                    }`}
                                >
                                    Jogosultságok (Admin)
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Autentikációs gombok */}
                    <div className="flex items-center gap-3 text-sm">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="rounded-md bg-neutral-900 px-4 py-2 font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                            >
                                Vezérlőpult ({auth.user.name})
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="rounded-md px-3 py-2 font-medium text-neutral-700 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                >
                                    Bejelentkezés
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-md bg-neutral-900 px-4 py-2 font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                                >
                                    Regisztráció
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <div className="flex flex-1 flex-col">{children}</div>

            <footer className="border-t border-neutral-200 bg-white py-6 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                    <span>Készítették:</span>
                    <span className="inline-flex flex-wrap items-center justify-center gap-x-8 gap-y-1">
                        <span>
                            <strong>Hársfalvi-Kuczmogh Miklós</strong> D19FB3
                        </span>
                        <span>
                            <strong>Marton Tamás</strong> (NEPTUN2)
                        </span>
                    </span>
                </div>
            </footer>
        </div>
    );
}