<?php

namespace App\Services;

use App\Models\Topic;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

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
            Topic::create($request);
            return response()->json([
                "message" => "Tópico cadastrado com sucesso!"
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                "error" => "Erro ao criar tópico: " . $e->getMessage()
            ], 500);
        }
    }

    public function update($request, $id)
    {
        try {
            $topic = Topic::findOrFail($id);
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

    public function destroy($id)
    {
        try {
            $topic = Topic::findOrFail($id);
            $topic->delete();
            return response()->json([
                "message" => "Tópico excluído com sucesso!"
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "error" => "Tópico não encontrado."
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                "error" => "Erro ao deletar tópico: " . $e->getMessage()
            ], 500);
        }
    }
}
