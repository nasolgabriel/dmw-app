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
    Schema::table('queues', function (Blueprint $table) {
        // Change the column type to unsignedBigInteger and make it nullable
        $table->unsignedBigInteger('counter_id')->nullable()->change();

        // Add the foreign key constraint with ON DELETE SET NULL
        $table->foreign('counter_id')
              ->references('id')
              ->on('service_counters')
              ->onDelete('set null');
    });
}

public function down()
{
    Schema::table('queues', function (Blueprint $table) {
        // Drop the foreign key constraint
        $table->dropForeign(['counter_id']);

        // Revert the column type to NOT NULL if necessary
        $table->unsignedBigInteger('counter_id')->nullable(false)->change();
    });
}
};
