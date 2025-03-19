<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->boolean('priority')->after('purpose')->default(false);
        });

        // Transfer data: set priority=true for clients where purpose contains "priority"
        DB::table('clients')->orderBy('id')->chunk(100, function ($clients) {
            foreach ($clients as $client) {
                // Check if purpose contains words indicating priority
                $hasPriority = false;
                if ($client->purpose) {
                    $purpose = strtolower($client->purpose);
                    if (str_contains($purpose, 'priority') || 
                        str_contains($purpose, 'urgent') || 
                        str_contains($purpose, 'emergency')) {
                        $hasPriority = true;
                    }
                }

                // Update priority flag if needed
                if ($hasPriority) {
                    DB::table('clients')
                        ->where('id', $client->id)
                        ->update(['priority' => true]);
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn('priority');
        });
    }
};