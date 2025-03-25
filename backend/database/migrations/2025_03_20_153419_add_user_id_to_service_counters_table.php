<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('service_counters', function (Blueprint $table) {
        $table->unsignedBigInteger('user_id')->nullable();
        $table->foreign('user_id')->references('id')->on('users');
        $table->enum('status', ['active', 'inactive', 'maintenance'])->default('inactive');
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('service_counters', function (Blueprint $table) {
            //
        });
    }
};
