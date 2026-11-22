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
        Schema::create('telepitesek', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gep_id')->constrained('gepek')->cascadeOnDelete();
            $table->foreignId('szoftver_id')->constrained('szoftverek')->cascadeOnDelete();
            $table->string('verzio', 30)->nullable();
            $table->date('datum')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('telepitesek');
    }
};
