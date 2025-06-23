<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Config;
use PDO;
use PDOException;

class CreateDatabase extends Command
{
    protected $signature = 'db:create {--name= : Nome do banco de dados a ser criado (opcional)}';
    protected $description = 'Cria o banco de dados definido no .env ou pelo parâmetro --name';

    public function handle()
    {
        
        $database = $this->option('name') ?? Config::get('database.connections.mysql.database');
        $host = Config::get('database.connections.mysql.host');
        $port = Config::get('database.connections.mysql.port');
        $username = Config::get('database.connections.mysql.username');
        $password = Config::get('database.connections.mysql.password');

        try {
            $pdo = new PDO("mysql:host=$host;port=$port", $username, $password);
            $pdo->exec("CREATE DATABASE IF NOT EXISTS `$database` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
            $this->info("Banco de dados '$database' criado com sucesso ou já existia.");
        } catch (PDOException $e) {
            $this->error("Erro ao criar banco de dados: " . $e->getMessage());
        }
    }
}
