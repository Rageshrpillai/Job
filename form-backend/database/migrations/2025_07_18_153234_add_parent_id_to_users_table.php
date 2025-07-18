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
            // Before: The original up() method was here.
            // ** THIS IS THE CHANGE **
            // We are adding a new 'parent_id' column.
            // It's nullable because top-level users (like admins and organizers) won't have a parent.
            // The foreign key constraint ensures data integrity.
            
            $table->foreignId('parent_id')->nullable()->constrained('users')->onDelete('cascade');
            
            // After: No other changes in this method.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Before: The original down() method was here.
            // ** THIS IS THE CHANGE **
            // This tells Laravel how to remove the column and its constraint
            // if we ever need to reverse this migration.
            
            $table->dropForeign(['parent_id']);
            $table->dropColumn('parent_id');

            // After: No other changes in this method.
        });
    }
};