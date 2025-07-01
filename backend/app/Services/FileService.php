<?php

namespace App\Services;

use App\Models\File;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class FileService
{
    public function index()
    {
        try {
            $files = File::with('topic')->get();
            return response()->json($files, 200);
        } catch (Exception $e) {
            Log::error('Erro ao buscar arquivos: ' . $e->getMessage());
            return response()->json([
                "error" => "Ocorreu um erro ao retornar os dados: " . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $file = File::with('topic')->findOrFail($id);
            return response()->json([$file], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "error" => "Arquivo não encontrado."
            ], 404);
        } catch (Exception $e) {
            Log::error('Erro ao buscar arquivo: ' . $e->getMessage());
            return response()->json([
                "error" => "Ocorreu um erro ao buscar o arquivo: " . $e->getMessage()
            ], 500);
        }
    }

    public function store($request)
    {
        try {
            Log::info('FileService - Iniciando store:', [
                'request_all' => $request->all(),
                'has_files_method' => $request->hasFile('files'),
                'files_data' => $request->file('files'),
                'files_count_from_request' => is_array($request->file('files')) ? count($request->file('files')) : ($request->file('files') ? 1 : 0),
            ]);

            if (!$request->hasFile('files')) {
                return response()->json(["error" => "Nenhum arquivo enviado."], 400);
            }

            $topicId = $request->input('topic_id');
            $uploadedFiles = [];
            $files = $request->file('files');

            if (!is_array($files)) {
                $files = [$files];
            }

            foreach ($files as $file) {
                if (!$file || !$file->isValid()) {
                    Log::warning('FileService - Item não é um arquivo válido, pulando:', ['file_name' => $file->getClientOriginalName() ?? 'N/A']);
                    continue;
                }

                $originalName = $file->getClientOriginalName();
                $extension = $file->getClientOriginalExtension();
                $fileName = time() . '-' . uniqid() . '.' . $extension;

                $path = $file->storeAs('uploads', $fileName, 'public');

                $fileRecord = File::create([
                    'topic_id' => $topicId,
                    'file_name' => $originalName,
                    'file_path' => $path,
                    'file_type' => $file->getClientMimeType(),
                ]);

                $fileRecord->load('topic');
                $uploadedFiles[] = $fileRecord;

                Log::info('FileService - Arquivo salvo:', [
                    'id' => $fileRecord->id,
                    'topic_id' => $topicId,
                    'file_name' => $originalName,
                    'file_path' => $path,
                    'file_url' => $fileRecord->file_url,
                    'full_path' => Storage::disk('public')->path($path)
                ]);
            }

            return response()->json([
                "message" => "Arquivos cadastrados com sucesso!",
                "files" => $uploadedFiles
            ], 201);

        } catch (Exception $e) {
            Log::error('FileService - Erro ao criar arquivo: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'code' => $e->getCode(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ]);
            return response()->json([
                "error" => "Erro ao criar arquivo: " . $e->getMessage()
            ], 500);
        }
    }

    public function update($request, $id)
    {
        try {
            $file = File::findOrFail($id);
            $file->update($request);
            return response()->json([
                "message" => "Arquivo atualizado com sucesso!",
                "file" => $file->load('topic')
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "error" => "Arquivo não encontrado."
            ], 404);
        } catch (Exception $e) {
            Log::error('Erro ao atualizar arquivo: ' . $e->getMessage());
            return response()->json([
                "error" => "Erro ao atualizar arquivo: " . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $file = File::findOrFail($id);

            if (Storage::disk('public')->exists($file->file_path)) {
                Storage::disk('public')->delete($file->file_path);
                Log::info('Arquivo físico removido: ' . $file->file_path);
            } else {
                Log::warning('Arquivo físico não encontrado: ' . $file->file_path);
            }

            $file->delete();
            return response()->json([
                "message" => "Arquivo excluído com sucesso!"
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "error" => "Arquivo não encontrado."
            ], 404);
        } catch (Exception $e) {
            Log::error('Erro ao deletar arquivo: ' . $e->getMessage());
            return response()->json([
                "error" => "Erro ao deletar arquivo: " . $e->getMessage()
            ], 500);
        }
    }

    public function getFilesByTopic($topicId)
    {
        try {
            $files = File::where('topic_id', $topicId)->get();

            Log::info('Arquivos encontrados para o tópico:', [
                'topic_id' => $topicId,
                'count' => $files->count(),
                'files' => $files->map(function($file) {
                    return [
                        'id' => $file->id,
                        'file_name' => $file->file_name,
                        'file_path' => $file->file_path,
                        'file_url' => $file->file_url,
                        'exists' => Storage::disk('public')->exists($file->file_path)
                    ];
                })
            ]);

            return response()->json($files, 200);
        } catch (Exception $e) {
            Log::error('Erro ao buscar arquivos do tópico: ' . $e->getMessage());
            return response()->json([
                "error" => "Erro ao buscar arquivos do tópico: " . $e->getMessage()
            ], 500);
        }
    }
}
