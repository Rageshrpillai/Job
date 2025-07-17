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
            // Adding the new columns
            $table->string('first_name')->nullable()->after('name');
            $table->string('last_name')->nullable()->after('first_name');
            $table->string('company')->nullable()->after('last_name');
            $table->string('organization_type')->nullable()->after('company');
            $table->string('phone')->nullable()->after('organization_type');
            $table->text('address')->nullable()->after('phone');

            // Make the original 'name' column nullable since it might not be used for companies
            $table->string('name')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'first_name', 
                'last_name', 
                'company', 
                'organization_type',
                'phone',
                'address'
            ]);
            
            // Revert the 'name' column change if needed
            $table->string('name')->nullable(false)->change();
        });
    }
};