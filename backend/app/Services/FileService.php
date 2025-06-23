<?php

namespace App\Services;

use App\Models\File;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class FileService
{
    public function index()
    {
        try {
            $file = File::all();
            return response()->json($file, 200);
        } catch (Exception $e) {
            return response()->json([
                "error" => "Ocorreu um erro ao retornar os dados: " . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $file = File::findOrFail($id);
            return response()->json($file, 200);
        } catch (Exception $e) {
            return response()->json([
                "error" => "Ocorreu um erro ao buscar o arquivo: " . $e->getMessage()
            ], 500);
        }
    }

    public function store($request)
    {
        try {
            File::create($request);
            return response()->json([
                "message" => "Arquivo cadastrado com sucesso!"
            ], 200);
        } catch (Exception $e) {
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
                "message" => "Arquivo atualizado com sucesso!"
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "error" => "Arquivo não encontrado."
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                "error" => "Erro ao atualizar arquivo: " . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $file = File::findOrFail($id);
            $file->delete();
            return response()->json([
                "message" => "Arquivo excluído com sucesso!"
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "error" => "Arquivo não encontrado."
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                "error" => "Erro ao deletar arquivo: " . $e->getMessage()
            ], 500);
        }
    }
}
