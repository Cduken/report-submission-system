<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ReportAssignment extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (! $model->id) {
                $model->id = Str::uuid()->toString();
            }
        });
    }

    protected $fillable = [
        'report_id',
        'field_officer_id',
        'is_submitted',
        'submitted_at',
        'status',
        'reminder_sent',
    ];

    public function report()
    {
        return $this->belongsTo(Report::class);
    }

    public function fieldOfficer()
    {
        return $this->belongsTo(User::class, 'field_officer_id');
    }

    // public function cluster()
    // {
    //     return $this->belongsTo(Cluster::class, 'cluster_id');
    // }
}
