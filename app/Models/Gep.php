<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Gep extends Model
{
    protected $table = 'gepek';

    protected $fillable = [
        'hely',
        'tipus',
        'ipcim',
    ];

    public function telepitesek(): HasMany
    {
        return $this->hasMany(Telepites::class, 'gep_id');
    }
}