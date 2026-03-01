<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasFactory;

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

    public function hasPendingReportsForUser(int $userId): bool
    {
        return $this->reports()
            ->where(function ($query) use ($userId) {
                $query->whereDoesntHave('submissions', function ($q) use ($userId) {
                    $q->where('field_officer_id', $userId);
                })
                ->orWhereHas('submissions', function ($q) use ($userId) {
                    $q->where('field_officer_id', $userId)
                    ->where('status', 'returned');
                });
            })
            ->exists();
    }
}
