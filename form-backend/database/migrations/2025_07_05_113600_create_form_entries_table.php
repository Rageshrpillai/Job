<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    
    public function up(): void
    {
        Schema::create('event_participants', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('email');
        $table->string('phone');
        $table->string('event_name');
        $table->string('college_name');
        $table->string('year_of_study');
        $table->text('message')->nullable();
        $table->timestamps();
        });
    }

    
   public function down(): void
{
    Schema::dropIfExists('event_participants');
}
};
