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
        Schema::table('users', function (Blueprint $table) {
            // Add soft deletes column: 'deleted_at' timestamp
            $table->softDeletes();

            // Add fields for blocking/potential threat
            $table->boolean('is_blocked')->default(false)->after('is_admin');
            $table->timestamp('blocked_at')->nullable()->after('is_blocked');
            $table->text('blocked_reason')->nullable()->after('blocked_at');

            // Add a specific reason for soft deletion
            $table->text('deleted_reason')->nullable()->after('deleted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop the columns in reverse order of creation
            $table->dropSoftDeletes(); // This drops the 'deleted_at' column
            $table->dropColumn(['is_blocked', 'blocked_at', 'blocked_reason', 'deleted_reason']);
        });
    }
};