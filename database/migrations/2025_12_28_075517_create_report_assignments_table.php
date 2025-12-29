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
        Schema::create('report_assignments', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('report_id');
    $table->unsignedBigInteger('field_officer_id');
    $table->uuid('cluster_id'); // NEW: cluster FK
    $table->boolean('is_submitted')->default(false);
    $table->dateTime('submitted_at')->nullable();
    $table->string('status')->default('pending');
    $table->boolean('reminder_sent')->default(false);
    $table->timestamps();

    $table->foreign('report_id')
        ->references('id')->on('reports')
        ->onDelete('cascade');

    $table->foreign('field_officer_id')
        ->references('id')->on('users')
        ->onDelete('cascade');

    $table->foreign('cluster_id')
        ->references('id')->on('clusters')
        ->onDelete('cascade');
});


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_assignments');
    }
};
