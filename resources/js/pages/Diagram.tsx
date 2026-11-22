import React from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface StatItem {
    id: number;
    nev: string;
    darab: number;
}

interface DiagramProps {
    summary: {
        gepekCount: number;
        szoftverekCount: number;
        telepitesekCount: number;
    };
    szoftverStatisztika: StatItem[];
    gepStatisztika: StatItem[];
}

export default function Diagram({
    summary,
    szoftverStatisztika,
    gepStatisztika,
}: DiagramProps) {
    const topSzoftverek = szoftverStatisztika.slice(0, 15);
    const topGepek = gepStatisztika.slice(0, 15);

    const szoftverChartData = {
        labels: topSzoftverek.map((item) => item.nev),
        datasets: [
            {
                label: 'Telepítések száma (db)',
                data: topSzoftverek.map((item) => item.darab),
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                borderRadius: 4,
            },
        ],
    };

    const gepChartData = {
        labels: topGepek.map((item) => item.nev),
        datasets: [
            {
                label: 'Telepítések száma (db)',
                data: topGepek.map((item) => item.darab),
                backgroundColor: 'rgba(51, 65, 85, 0.85)',
                borderRadius: 4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
            },
        },
    };

    return (
        <PublicLayout>
            <Head title="Diagram" />

            <main className="mx-auto w-full max-w-6xl px-6 py-8">
                <h1 className="mb-6 text-2xl font-bold">
                    Statisztikai diagramok
                </h1>

                {/* Összegző kártyák */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border bg-white p-5 shadow-sm">
                        <div className="text-sm text-gray-500">Gépek száma</div>
                        <div className="mt-1 text-3xl font-bold">
                            {summary.gepekCount}
                        </div>
                    </div>
                    <div className="rounded-lg border bg-white p-5 shadow-sm">
                        <div className="text-sm text-gray-500">
                            Szoftverek száma
                        </div>
                        <div className="mt-1 text-3xl font-bold">
                            {summary.szoftverekCount}
                        </div>
                    </div>
                    <div className="rounded-lg border bg-white p-5 shadow-sm">
                        <div className="text-sm text-gray-500">
                            Telepítések száma
                        </div>
                        <div className="mt-1 text-3xl font-bold">
                            {summary.telepitesekCount}
                        </div>
                    </div>
                </div>

                {/* Chart.js diagramok */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-lg border bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold">
                            Telepítések szoftverenként (Top 15)
                        </h2>
                        {topSzoftverek.length === 0 ? (
                            <p className="text-sm text-gray-500">
                                Nincs megjeleníthető adat.
                            </p>
                        ) : (
                            <div className="h-80">
                                <Bar
                                    data={szoftverChartData}
                                    options={chartOptions}
                                />
                            </div>
                        )}
                    </div>

                    <div className="rounded-lg border bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold">
                            Telepítések gépenként (Top 15)
                        </h2>
                        {topGepek.length === 0 ? (
                            <p className="text-sm text-gray-500">
                                Nincs megjeleníthető adat.
                            </p>
                        ) : (
                            <div className="h-80">
                                <Bar
                                    data={gepChartData}
                                    options={chartOptions}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </PublicLayout>
    );
}