<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Telepites extends Model
{
    protected $table = 'telepitesek';

    protected $fillable = [
        'gep_id',
        'szoftver_id',
        'verzio',
        'datum',
    ];

    public function gep()
    {
        return $this->belongsTo(Gep::class, 'gep_id');
    }

    public function szoftver()
    {
        return $this->belongsTo(Szoftver::class, 'szoftver_id');
    }
}