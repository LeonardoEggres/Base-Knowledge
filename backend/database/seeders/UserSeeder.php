<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@exemplo.com',
            'password' => Hash::make('admin123'),
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Usuário Teste',
            'email' => 'teste@exemplo.com',
            'password' => Hash::make('123456'),
            'email_verified_at' => now(),
        ]);

        User::factory()->create([
            'name' => 'João Silva',
            'email' => 'joao@exemplo.com',
            'password' => Hash::make('123456'),
        ]);

        User::factory()->create([
            'name' => 'Maria Santos',
            'email' => 'maria@exemplo.com',
            'password' => Hash::make('123456'),
        ]);

        User::factory()->create([
            'name' => 'Pedro Oliveira',
            'email' => 'pedro@exemplo.com',
            'password' => Hash::make('123456'),
        ]);

        User::factory(5)->create();
    }
}
