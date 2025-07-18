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
        Schema::create('events', function (Blueprint $table) {
            $table->id(); // Event ID
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Organizer ID

            // --- Core Event Details ---
            $table->string('title');
            $table->string('slug')->unique(); // For clean URLs like /events/summer-music-festival
            $table->text('description');
            $table->string('main_image_path'); // File path for the event's main image
            $table->string('category')->nullable(); // E.g., "Music", "Tech", "Workshop"

            // --- Location & Type ---
            $table->enum('event_type', ['in-person', 'online']);
            $table->string('venue'); // Physical address or "Online"
            $table->decimal('latitude', 10, 7)->nullable(); // For maps
            $table->decimal('longitude', 10, 7)->nullable(); // For maps

            // --- Date & Time ---
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->dateTime('published_at')->nullable(); // When the event goes public

            // --- Capacity & Status ---
            $table->integer('max_attendees')->nullable(); // Max capacity for the event
            $table->enum('status', ['draft', 'published', 'completed', 'cancelled', 'disabled'])->default('draft');

            // --- Tracking & Analytics (Defaults to 0) ---
            $table->unsignedBigInteger('views_count')->default(0); // Tracks page visits
            $table->unsignedBigInteger('tickets_sold')->default(0); // Cached count of sold tickets
            $table->decimal('revenue_generated', 10, 2)->default(0); // Total revenue from sales
            $table->timestamp('last_ticket_sold_at')->nullable(); // To analyze sales spikes

            // --- Admin & Moderation Fields ---
            $table->boolean('requires_verification')->default(false); // For Superadmin approval
            $table->boolean('is_flagged')->default(false); // For manual review
            $table->text('flag_reason')->nullable();
            $table->foreignId('verified_by_admin_id')->nullable()->constrained('users');
            $table->text('verification_notes')->nullable();

            // --- Audit & Security ---
            $table->ipAddress('event_created_ip')->nullable();
            $table->ipAddress('event_updated_ip')->nullable();
            $table->string('device_info')->nullable(); // Browser user-agent

            $table->softDeletes(); // For admin soft-deletion
            $table->timestamps(); // created_at & updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};