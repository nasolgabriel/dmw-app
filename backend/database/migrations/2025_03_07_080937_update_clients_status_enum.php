<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateClientsStatusEnum extends Migration
{
    public function up()
    {
        Schema::table('clients', function (Blueprint $table) {
            // Adjust the allowed values as needed. Here we include 'in queue'.
            $table->enum('status', ['pending', 'in queue', 'served'])->change();
        });
    }

    public function down()
    {
        Schema::table('clients', function (Blueprint $table) {
            // Revert back to the original enum values (adjust as appropriate)
            $table->enum('status', ['pending', 'served'])->change();
        });
    }
}
