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
        // Drop the existing foreign key if it exists
        $table->dropForeign(['counter_id']);

        // Change the column type to unsignedBigInteger
        $table->unsignedBigInteger('counter_id')->default(1)->change();

        // Add the foreign key constraint
        $table->foreign('counter_id')
              ->references('id')
              ->on('service_counters')
              ->onDelete('set null'); // or 'cascade' depending on your needs
    });
}

public function down()
{
    Schema::table('queues', function (Blueprint $table) {
        // Drop the foreign key constraint
        $table->dropForeign(['counter_id']);

        // Revert the column type if necessary
        $table->unsignedBigInteger('counter_id')->nullable()->change();
    });
}
};
