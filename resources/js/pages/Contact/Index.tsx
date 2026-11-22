import PublicLayout from '@/layouts/PublicLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { type FormEvent } from 'react';

interface PageProps {
    flash?: {
        success?: string;
    };
    [key: string]: unknown;
}

export default function ContactIndex() {
    const { props } = usePage<PageProps>();
    const successMessage = props.flash?.success;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/kapcsolat', {
            onSuccess: () => reset(),
        });
    };

    return (
        <PublicLayout>
            <Head title="Kapcsolat - Szoftverleltár" />

            <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-12">
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-3xl font-extrabold tracking-tight">Kapcsolatfelvétel</h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Kérdésed, észrevételed vagy hibabejelentésed van? Írj nekünk az alábbi űrlapon!
                    </p>
                </div>

                {successMessage && (
                    <div className="mb-6 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                        {successMessage}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8 dark:border-neutral-800 dark:bg-neutral-900"
                >
                    <div>
                        <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                            Név *
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Pl. Kovács János"
                            className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2 text-sm text-neutral-900 focus:border-neutral-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                            E-mail cím *
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="pelda@email.hu"
                            className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2 text-sm text-neutral-900 focus:border-neutral-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="subject" className="mb-1.5 block text-sm font-medium">
                            Tárgy
                        </label>
                        <input
                            id="subject"
                            type="text"
                            value={data.subject}
                            onChange={(e) => setData('subject', e.target.value)}
                            placeholder="Pl. Szoftverigénylés vagy hibajelzés"
                            className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2 text-sm text-neutral-900 focus:border-neutral-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                        />
                        {errors.subject && (
                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.subject}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
                            Üzenet *
                        </label>
                        <textarea
                            id="message"
                            rows={5}
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            placeholder="Írd le részletesen az üzeneted..."
                            className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2 text-sm text-neutral-900 focus:border-neutral-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                        />
                        {errors.message && (
                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-700 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                    >
                        {processing ? 'Küldés folyamatban...' : 'Üzenet küldése'}
                    </button>
                </form>
            </main>
        </PublicLayout>
    );
}