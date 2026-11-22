import PublicLayout from '@/layouts/PublicLayout';
import { Head, router, usePage } from '@inertiajs/react';

interface Message {
    id: number;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    created_at: string;
}

interface PageProps {
    auth?: {
        user?: {
            is_admin?: boolean | number;
            role?: string;
        } | null;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

export default function Messages({ messages }: { messages: Message[] }) {
    const { props } = usePage<PageProps>();
    const currentUser = props.auth?.user;
    const isAdmin = Boolean(currentUser?.is_admin) || currentUser?.role === 'admin';

    const handleDelete = (id: number) => {
        if (!window.confirm('Biztosan törlöd ezt az üzenetet?')) {
            return;
        }

        router.delete(`/uzenetek/${id}`, {
            preserveScroll: true,
        });
    };

    return (
        <PublicLayout>
            <Head title="Beérkezett üzenetek" />
            <div className="mx-auto max-w-6xl px-4 py-10">
                <h1 className="mb-6 text-2xl font-bold">Beérkezett üzenetek</h1>

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

                <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50 text-left font-semibold text-gray-700">
                            <tr>
                                <th className="px-4 py-3">Küldés ideje</th>
                                <th className="px-4 py-3">Név</th>
                                <th className="px-4 py-3">E-mail</th>
                                <th className="px-4 py-3">Tárgy</th>
                                <th className="px-4 py-3">Üzenet</th>
                                {isAdmin && (
                                    <th className="px-4 py-3 text-right">Műveletek</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {messages.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={isAdmin ? 6 : 5}
                                        className="px-4 py-6 text-center text-gray-500"
                                    >
                                        Még nincs beérkezett üzenet.
                                    </td>
                                </tr>
                            ) : (
                                messages.map((msg) => (
                                    <tr key={msg.id} className="hover:bg-gray-50">
                                        <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                                            {new Date(msg.created_at).toLocaleString('hu-HU')}
                                        </td>
                                        <td className="px-4 py-3 font-medium">{msg.name}</td>
                                        <td className="px-4 py-3 text-gray-600">{msg.email}</td>
                                        <td className="px-4 py-3">{msg.subject || '-'}</td>
                                        <td className="px-4 py-3">{msg.message}</td>
                                        {isAdmin && (
                                            <td className="whitespace-nowrap px-4 py-3 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(msg.id)}
                                                    className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700"
                                                >
                                                    Törlés
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </PublicLayout>
    );
}