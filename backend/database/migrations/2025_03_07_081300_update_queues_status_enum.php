<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateQueuesStatusEnum extends Migration
{
    public function up()
    {
        Schema::table('queues', function (Blueprint $table) {
            // Add 'in queue' to the allowed values
            $table->enum('status', ['waiting', 'processing', 'completed', 'cancelled', 'in queue'])->change();
        });
    }

    public function down()
    {
        Schema::table('queues', function (Blueprint $table) {
            // Revert back to the original enum values
            $table->enum('status', ['waiting', 'processing', 'completed', 'cancelled'])->change();
        });
    }
}
