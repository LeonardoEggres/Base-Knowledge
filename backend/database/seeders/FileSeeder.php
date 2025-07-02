<?php

namespace Database\Seeders;

use App\Models\File;
use App\Models\Topic;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class FileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $topics = Topic::all();

        if ($topics->isEmpty()) {
            $this->command->error('Nenhum tópico encontrado. Execute TopicSeeder primeiro.');
            return;
        }

        if (!Storage::disk('public')->exists('uploads')) {
            Storage::disk('public')->makeDirectory('uploads');
        }

        $fileTypes = [
            ['name' => 'manual.pdf', 'type' => 'application/pdf'],
            ['name' => 'apresentacao.pptx', 'type' => 'application/vnd.presentationml.presentation'],
            ['name' => 'documento.docx', 'type' => 'application/vnd.wordprocessingml.document'],
            ['name' => 'planilha.xlsx', 'type' => 'application/vnd.spreadsheetml.sheet'],
            ['name' => 'imagem.jpg', 'type' => 'image/jpeg'],
            ['name' => 'diagrama.png', 'type' => 'image/png'],
            ['name' => 'codigo.txt', 'type' => 'text/plain'],
            ['name' => 'dados.csv', 'type' => 'text/csv'],
        ];

        foreach ($topics as $topic) {
            $numberOfFiles = rand(1, 4);
            $selectedFiles = collect($fileTypes)->random($numberOfFiles);

            foreach ($selectedFiles as $fileType) {
                $fileName = time() . '-' . uniqid() . '-' . $fileType['name'];
                $filePath = 'uploads/' . $fileName;

                Storage::disk('public')->put($filePath, $this->generateFileContent($fileType['type']));

                File::create([
                    'topic_id' => $topic->id,
                    'file_name' => $fileType['name'],
                    'file_path' => $filePath,
                    'file_type' => $fileType['type']
                ]);
            }
        }

        $this->command->info('Files seeder executado com sucesso!');
    }

    private function generateFileContent(string $fileType): string
    {
        switch ($fileType) {
            case 'text/plain':
                return "Este é um arquivo de texto de exemplo.\n\nConteúdo gerado pelo seeder para demonstração.\n\nData: " . now()->format('Y-m-d H:i:s');

            case 'text/csv':
                return "id,nome,email,data\n1,João Silva,joao@exemplo.com,2024-01-01\n2,Maria Santos,maria@exemplo.com,2024-01-02\n3,Pedro Oliveira,pedro@exemplo.com,2024-01-03";

            case 'application/json':
                return json_encode([
                    'exemplo' => true,
                    'dados' => [
                        'nome' => 'Arquivo de exemplo',
                        'criado_em' => now()->toISOString(),
                        'tipo' => 'seeder'
                    ]
                ], JSON_PRETTY_PRINT);

            default:
                return "Arquivo de exemplo criado pelo seeder.\nTipo: {$fileType}\nData: " . now()->format('Y-m-d H:i:s');
        }
    }
}
