<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Szoftver extends Model
{
    protected $table = 'szoftverek';

    protected $fillable = [
        'nev',
        'kategoria',
    ];

    public function telepitesek(): HasMany
    {
        return $this->hasMany(Telepites::class, 'szoftver_id');
    }
}