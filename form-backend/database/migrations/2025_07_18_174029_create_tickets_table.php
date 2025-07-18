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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');

            // --- Ticket Plan Details ---
            $table->string('name'); // E.g., "Early Bird", "Regular", "VIP"
            $table->decimal('price', 8, 2);
            $table->text('description')->nullable();

            // --- Sales & Stock Management ---
            $table->integer('total_quantity'); // Total number of tickets available for this plan
            $table->integer('sold_quantity')->default(0); // Counter for how many have been sold
            $table->integer('max_purchase_per_user')->default(10); // Max tickets one person can buy
            $table->dateTime('sale_start_date');
            $table->dateTime('sale_end_date');
            
            // --- Status ---
            $table->boolean('is_visible')->default(true); // Allows organizer to hide a ticket plan
            $table->boolean('is_sold_out_manually')->default(false); // For manual "Sold Out" override

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};