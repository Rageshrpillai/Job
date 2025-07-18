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
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');

            // --- Coupon Details ---
            $table->string('code')->unique(); // The actual coupon code, e.g., "SUMMER25"
            $table->enum('discount_type', ['percentage', 'fixed']); // Can be a % or a flat amount off
            $table->decimal('discount_value', 8, 2); // The value of the discount

            // --- Usage Limits & Rules ---
            $table->integer('usage_limit')->nullable(); // How many times this coupon can be used in total
            $table->integer('usage_count')->default(0); // How many times it has been used
            $table->dateTime('valid_from');
            $table->dateTime('valid_to');
            $table->boolean('is_active')->default(true); // To easily enable/disable the coupon

            $table->timestamps();
        });

        // This is a "pivot" table to link coupons to specific ticket plans.
        // It allows a single coupon to apply to one or more ticket types.
        Schema::create('coupon_ticket', function (Blueprint $table) {
            $table->foreignId('coupon_id')->constrained('coupons')->onDelete('cascade');
            $table->foreignId('ticket_id')->constrained('tickets')->onDelete('cascade');
            $table->primary(['coupon_id', 'ticket_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupon_ticket');
        Schema::dropIfExists('coupons');
    }
};