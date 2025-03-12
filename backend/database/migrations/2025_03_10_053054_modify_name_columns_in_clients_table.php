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
        // First, add the new columns
        Schema::table('clients', function (Blueprint $table) {
            $table->string('firstname')->after('name')->nullable();
            $table->string('middlename')->after('firstname')->nullable();
            $table->string('lastname')->after('middlename')->nullable();
        });

        // Then, transfer data from the 'name' column to the new columns
        // This is a simple strategy - you may need to adjust based on your name formats
        DB::table('clients')->orderBy('id')->chunk(100, function ($clients) {
            foreach ($clients as $client) {
                // Skip if client has no name
                if (!$client->name) {
                    continue;
                }
                
                $nameParts = explode(' ', trim($client->name));
                $firstname = $nameParts[0] ?? null;
                $lastname = end($nameParts) ?? null;
                
                // Extract middle name (everything between first and last name)
                $middlename = '';
                if (count($nameParts) > 2) {
                    $middleParts = array_slice($nameParts, 1, -1);
                    $middlename = implode(' ', $middleParts);
                }
                
                // If only one name part exists, assume it's a first name
                if (count($nameParts) == 1) {
                    $lastname = null;
                }

                DB::table('clients')
                    ->where('id', $client->id)
                    ->update([
                        'firstname' => $firstname,
                        'middlename' => $middlename ?: null,
                        'lastname' => $lastname
                    ]);
            }
        });

        // Finally, drop the original name column
        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // First, add back the original name column
        Schema::table('clients', function (Blueprint $table) {
            $table->string('name')->after('id')->nullable();
        });

        // Then, transfer data back to the 'name' column
        DB::table('clients')->orderBy('id')->chunk(100, function ($clients) {
            foreach ($clients as $client) {
                $fullname = trim(
                    ($client->firstname ?? '') . ' ' . 
                    ($client->middlename ?? '') . ' ' . 
                    ($client->lastname ?? '')
                );
                
                DB::table('clients')
                    ->where('id', $client->id)
                    ->update(['name' => $fullname]);
            }
        });

        // Finally, drop the new name columns
        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn(['firstname', 'middlename', 'lastname']);
        });
    }
};