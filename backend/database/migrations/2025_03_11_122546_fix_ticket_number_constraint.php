<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class FixTicketNumberConstraint extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Get all indexes on the queues table
        $indexes = DB::select("SHOW INDEXES FROM queues WHERE Column_name = 'ticket_number'");
        
        // If there's a unique index on ticket_number, drop it
        foreach ($indexes as $index) {
            if ($index->Non_unique == 0) { // 0 means it's a unique index
                Schema::table('queues', function (Blueprint $table) use ($index) {
                    $table->dropIndex($index->Key_name);
                });
                break;
            }
        }
        
        // Now make sure ticket_number is not unique but still has an index for performance
        Schema::table('queues', function (Blueprint $table) {
            // Add a regular index (not unique) if one doesn't exist
            if (!Schema::hasIndex('queues', 'queues_ticket_number_index')) {
                $table->index('ticket_number');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // In case you want to make it unique again in the future
        Schema::table('queues', function (Blueprint $table) {
            // Drop regular index if it exists
            if (Schema::hasIndex('queues', 'queues_ticket_number_index')) {
                $table->dropIndex('queues_ticket_number_index');
            }
            // Add unique constraint
            $table->unique('ticket_number');
        });
    }
}