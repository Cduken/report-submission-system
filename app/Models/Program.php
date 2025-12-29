<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    protected $fillable = [
        'name',
        'description',
        'coordinator_id',
    ];

    // ────────────────────────────────────────────────
    // RELATIONSHIPS
    // ────────────────────────────────────────────────

    public function coordinator()
    {
        return $this->belongsTo(User::class, 'coordinator_id');
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }
}
