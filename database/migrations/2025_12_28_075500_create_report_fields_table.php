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
        Schema::create('report_fields', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('report_id');
            $table->string('field_label');
            $table->string('field_type'); // text, number, file, select, etc.
            $table->boolean('is_required')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->foreign('report_id')
                ->references('id')->on('reports')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_fields');
    }
};