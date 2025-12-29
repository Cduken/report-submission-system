<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('report_submission_fields', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('submission_id');
    $table->uuid('report_field_id');
    $table->longText('value')->nullable(); // raw text, json, file path
    $table->timestamps();

    $table->foreign('submission_id')
        ->references('id')->on('report_submissions')
        ->onDelete('cascade');

    $table->foreign('report_field_id')
        ->references('id')->on('report_fields')
        ->onDelete('cascade');
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_submission_fields');
    }
};
