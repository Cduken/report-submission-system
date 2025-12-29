<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Cluster extends Model
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
        'name',
        'code',
    ];

    public function assignments()
    {
        return $this->hasMany(ReportAssignment::class, 'cluster_id');
    }
}
