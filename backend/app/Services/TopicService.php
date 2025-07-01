<?php

namespace App\Services;

use App\Models\Topic;
use App\Models\File;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class TopicService
{
    public function index()
    {
        try {
            $topic = Topic::all();
            return response()->json($topic, 200);
        } catch (Exception $e) {
            return response()->json([
                "error" => "Ocorreu um erro ao retornar os dados: " . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $topic = Topic::findOrFail($id);
            Log::info('TopicService - show: Conteúdo do tópico recuperado do DB:', [
                'topic_id' => $id,
                'content_preview' => substr($topic->content, 0, 200) . (strlen($topic->content) > 200 ? '...' : ''),
                'content_raw' => $topic->content
            ]);
            return response()->json($topic, 200);
        } catch (Exception $e) {
            return response()->json([
                "error" => "Ocorreu um erro ao buscar o tópico: " . $e->getMessage()
            ], 500);
        }
    }

    public function store($request)
    {
        try {
            Log::info('TopicService - store: Conteúdo do tópico recebido para salvar:', [
                'title' => $request['title'],
                'content_preview' => substr($request['content'], 0, 200) . (strlen($request['content']) > 200 ? '...' : ''),
                'content_raw' => $request['content']
            ]);

            $topic = Topic::create($request);
            return response()->json([
                "message" => "Tópico cadastrado com sucesso!",
                "id" => $topic->id
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                "error" => "Erro ao criar tópico: " . $e->getMessage()
            ], 400);
        }
    }

    public function update($request, $id, $authUserId)
    {
        try {
            $topic = Topic::findOrFail($id);

            if ($topic->user_id !== (int)$authUserId) {
                return response()->json([
                    "error" => "Você não tem permissão para atualizar este tópico."
                ], 403);
            }

            Log::info('TopicService - update: Conteúdo do tópico recebido para atualizar:', [
                'topic_id' => $id,
                'title' => $request['title'],
                'content_preview' => substr($request['content'], 0, 200) . (strlen($request['content']) > 200 ? '...' : ''),
                'content_raw' => $request['content']
            ]);

            $topic->update($request);
            return response()->json([
                "message" => "Tópico atualizado com sucesso!"
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "error" => "Tópico não encontrado."
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                "error" => "Erro ao atualizar tópico: " . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id, $authUserId)
    {
        try {
            $topic = Topic::findOrFail($id);

            if ($topic->user_id !== (int)$authUserId) {
                return response()->json([
                    "error" => "Você não tem permissão para excluir este tópico."
                ], 403);
            }

            $filesToDelete = File::where('topic_id', $id)->get();

            foreach ($filesToDelete as $file) {
                if (Storage::disk('public')->exists($file->file_path)) {
                    Storage::disk('public')->delete($file->file_path);
                    Log::info('Arquivo físico removido ao deletar tópico: ' . $file->file_path);
                } else {
                    Log::warning('Arquivo físico não encontrado ao deletar tópico: ' . $file->file_path);
                }
                $file->delete();
                Log::info('Registro de arquivo removido do banco ao deletar tópico:', ['file_id' => $file->id, 'file_name' => $file->file_name]);
            }

            $topic->delete(); 
            return response()->json([
                "message" => "Tópico excluído com sucesso!"
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "error" => "Tópico não encontrado."
            ], 404);
        } catch (Exception $e) {
            Log::error('Erro ao deletar tópico: ' . $e->getMessage(), [
                'topic_id' => $id,
                'auth_user_id' => $authUserId,
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return response()->json([
                "error" => "Erro ao deletar tópico: " . $e->getMessage()
            ], 500);
        }
    }
}
