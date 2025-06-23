<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateTestUser extends Command
{
    protected $signature = 'make:test-user';
    protected $description = 'Criar um usuário de teste';

    public function handle()
    {
        $user = User::create([
            'name' => 'Usuário Teste',
            'email' => 'teste@exemplo.com',
            'password' => Hash::make('123456'),
        ]);

        $this->info("Usuário criado com sucesso!");
        $this->info("Email: teste@exemplo.com");
        $this->info("Senha: 123456");
        $this->info("ID: " . $user->id);

        return 0;
    }
}
