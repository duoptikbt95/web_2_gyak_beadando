<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdatSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        // 1. gep.txt -> gepek
        $gepLines = file(database_path('seeders/data/gep.txt'), FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        array_shift($gepLines); // fejléc sor (id, hely, tipus, ipcim)

        foreach ($gepLines as $line) {
            [$id, $hely, $tipus, $ipcim] = array_pad(explode("\t", trim($line)), 4, null);
            DB::table('gepek')->updateOrInsert(
                ['id' => (int) $id],
                [
                    'hely'       => $hely,
                    'tipus'      => $tipus,
                    'ipcim'      => $ipcim,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }

        // 2. szoftver.txt -> szoftverek
        $szoftverLines = file(database_path('seeders/data/szoftver.txt'), FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        array_shift($szoftverLines); // fejléc sor (id, nev, kategoria)

        foreach ($szoftverLines as $line) {
            [$id, $nev, $kategoria] = array_pad(explode("\t", trim($line)), 3, null);
            DB::table('szoftverek')->updateOrInsert(
                ['id' => (int) $id],
                [
                    'nev'        => $nev,
                    'kategoria'  => $kategoria,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }

        // 3. telepites.txt -> telepitesek (ha ilyen nevű a táblád)
        $telepitesLines = file(database_path('seeders/data/telepites.txt'), FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        array_shift($telepitesLines); // fejléc sor (gepid, szoftverid, verzio, datum)

        $rows = [];
        foreach ($telepitesLines as $line) {
            [$gepid, $szoftverid, $verzio, $datumRaw] = array_pad(explode("\t", trim($line)), 4, '');
            $verzio = trim((string) $verzio);
            $datumRaw = trim((string) $datumRaw);

            $datum = null;
            if ($datumRaw !== '') {
                $normalized = str_replace('.', '-', $datumRaw);
                $datum = Carbon::parse($normalized)->format('Y-m-d');
            }

            $rows[] = [
                'gep_id'      => (int) $gepid,
                'szoftver_id' => (int) $szoftverid,
                'verzio'      => $verzio !== '' ? $verzio : null,
                'datum'       => $datum,
                'created_at'  => $now,
                'updated_at'  => $now,
            ];
        }

        if (!empty($rows)) {
            DB::table('telepitesek')->insert($rows);
        }
    }
}