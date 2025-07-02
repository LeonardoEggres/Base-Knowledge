<?php

namespace Database\Seeders;

use App\Models\Topic;
use App\Models\User;
use Illuminate\Database\Seeder;

class TopicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        if ($users->isEmpty()) {
            $this->command->error('Nenhum usuário encontrado. Execute UserSeeder primeiro.');
            return;
        }

        $topics = [
            [
                'title' => 'Introdução ao Laravel',
                'summary' => 'Conceitos básicos e fundamentais do framework Laravel para desenvolvimento web.',
                'content' => 'Laravel é um framework PHP elegante e expressivo que facilita o desenvolvimento web. Criado por Taylor Otwell, o Laravel oferece uma sintaxe limpa e ferramentas poderosas como Eloquent ORM, Blade templating engine, e Artisan CLI. Este framework segue o padrão MVC (Model-View-Controller) e fornece recursos como roteamento, middleware, autenticação, e muito mais. Com Laravel, você pode construir aplicações web robustas e escaláveis de forma eficiente.',
                'keywords' => ['Laravel', 'PHP', 'Framework', 'MVC', 'Eloquent', 'Blade', 'Artisan']
            ],
            [
                'title' => 'Gerenciamento de Estado no React',
                'summary' => 'Técnicas e padrões para gerenciar estado em aplicações React modernas.',
                'content' => 'O gerenciamento de estado é fundamental em aplicações React. Existem várias abordagens: useState para estado local, useContext para compartilhamento entre componentes, useReducer para lógica complexa, e bibliotecas externas como Redux, Zustand ou Jotai. A escolha da estratégia depende da complexidade da aplicação. Para estados simples, hooks nativos são suficientes. Para aplicações complexas com múltiplos componentes compartilhando dados, soluções como Redux com Redux Toolkit oferecem melhor organização e debugging.',
                'keywords' => ['React', 'Estado', 'useState', 'useContext', 'Redux', 'Zustand', 'JavaScript']
            ],
            [
                'title' => 'Banco de Dados PostgreSQL',
                'summary' => 'Conceitos avançados e otimização de performance em PostgreSQL.',
                'content' => 'PostgreSQL é um sistema de gerenciamento de banco de dados relacional open-source conhecido por sua robustez e recursos avançados. Suporta tipos de dados complexos, índices especializados, transações ACID, e extensões personalizadas. Para otimização, é importante entender índices (B-tree, Hash, GIN, GiST), estatísticas de consulta, EXPLAIN ANALYZE, configuração de memória, e particionamento de tabelas. O PostgreSQL também oferece recursos como JSON nativo, funções de janela, CTEs recursivos e replicação.',
                'keywords' => ['PostgreSQL', 'Banco de Dados', 'SQL', 'Índices', 'Performance', 'ACID', 'JSON']
            ],
            [
                'title' => 'Docker e Containerização',
                'summary' => 'Fundamentos de Docker e como containerizar aplicações.',
                'content' => 'Docker revolucionou o deployment de aplicações através da containerização. Containers são ambientes isolados que empacotam aplicações com suas dependências. Conceitos importantes incluem: Dockerfile para definir imagens, docker-compose para orquestração multi-container, volumes para persistência de dados, networks para comunicação entre containers, e registry para distribuição de imagens. Docker garante consistência entre ambientes de desenvolvimento e produção, facilita scaling horizontal e simplifica CI/CD.',
                'keywords' => ['Docker', 'Containers', 'DevOps', 'Deployment', 'Dockerfile', 'Docker Compose', 'Microservices']
            ],
            [
                'title' => 'API RESTful Design',
                'summary' => 'Princípios e melhores práticas para design de APIs REST.',
                'content' => 'REST (Representational State Transfer) é um estilo arquitetural para APIs web. Princípios fundamentais incluem: recursos identificados por URLs, operações através de métodos HTTP (GET, POST, PUT, DELETE), representações em JSON/XML, stateless communication, e interface uniforme. Boas práticas: uso correto de códigos de status HTTP, versionamento de API, paginação para grandes datasets, autenticação via tokens, rate limiting, e documentação clara. HATEOAS permite navegação dinâmica entre recursos.',
                'keywords' => ['REST', 'API', 'HTTP', 'JSON', 'Status Code', 'Autenticação', 'Versionamento']
            ],
            [
                'title' => 'Testes Automatizados',
                'summary' => 'Estratégias e ferramentas para implementar testes automatizados eficazes.',
                'content' => 'Testes automatizados são essenciais para garantir qualidade de software. A pirâmide de testes inclui: testes unitários (isolados, rápidos), testes de integração (interação entre componentes), e testes E2E (fluxo completo). Ferramentas populares: Jest/PHPUnit para unitários, Cypress/Selenium para E2E, Postman/Insomnia para APIs. Práticas importantes: TDD (Test-Driven Development), cobertura de código adequada, testes determinísticos, mocks para dependências externas, e CI/CD integration.',
                'keywords' => ['Testes', 'TDD', 'Jest', 'PHPUnit', 'Cypress', 'Cobertura', 'CI/CD']
            ]
        ];

        foreach ($topics as $topicData) {
            Topic::create([
                'user_id' => $users->random()->id,
                'title' => $topicData['title'],
                'summary' => $topicData['summary'],
                'content' => $topicData['content'],
                'keywords' => $topicData['keywords']
            ]);
        }
    }
}
