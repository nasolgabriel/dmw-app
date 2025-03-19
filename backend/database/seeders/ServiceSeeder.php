<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;

class ServiceSeeder extends Seeder
{
    public function run()
    {
        $services = [
            ['id' => 1, 'abbreviation' => 'LA', 'description' => 'Legal Assistance'],
            ['id' => 2, 'abbreviation' => 'BM', 'description' => 'Balik Manggagawa'],
            ['id' => 3, 'abbreviation' => 'DH', 'description' => 'Direct Hire'],
            ['id' => 4, 'abbreviation' => 'I', 'description' => 'Infosheet'],
            ['id' => 5, 'abbreviation' => 'A', 'description' => 'E Registration, OEC Assistance Etc.'],
            ['id' => 6, 'abbreviation' => 'G', 'description' => 'Government to Government'],
            ['id' => 7, 'abbreviation' => 'FA', 'description' => 'Financial Assistance'],
            ['id' => 8, 'abbreviation' => 'S', 'description' => 'Shipment of Remains'],
            ['id' => 9, 'abbreviation' => 'L', 'description' => 'Livelihood'],
            ['id' => 10, 'abbreviation' => 'PIF', 'description' => 'Pag Ibig Fund'],
            ['id' => 11, 'abbreviation' => 'O', 'description' => 'OWWA']
        ];
        
        foreach ($services as $service) {
            Service::updateOrCreate(['id' => $service['id']], $service);
        }
    }
}