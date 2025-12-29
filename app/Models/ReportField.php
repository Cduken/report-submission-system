<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ReportField extends Model
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
        'field_label',
        'field_type',
        'is_required',
        'order',
    ];

    public function report()
    {
        return $this->belongsTo(Report::class);
    }

    public function answers()
    {
        return $this->hasMany(ReportSubmissionField::class, 'report_field_id');
    }
}
