<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClusterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       $clusters = [
        "D'One",
        "M&M",
       ];

       foreach( $clusters as $clusterName ) {
        \App\Models\Cluster::firstOrCreate([
            'name' => $clusterName,
        ]);
       }
    }
}
