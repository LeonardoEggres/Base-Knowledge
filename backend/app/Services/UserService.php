<?php

namespace App\Services;

use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class UserService
{
    public function index()
    {
        try {
            $user = User::all();
            return response()->json($user, 200);
        } catch (Exception $e) {
            return response()->json([
                "error" => "Ocorreu um erro ao retornar os dados: " . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = User::findOrFail($id);
            return response()->json($user, 200);
        } catch (Exception $e) {
            return response()->json([
                "error" => "Ocorreu um erro ao buscar o usuário: " . $e->getMessage()
            ], 500);
        }
    }

    public function store($request)
    {
        try {
            User::create($request);
            return response()->json([
                "message" => "Usuário cadastrado com sucesso!"
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                "error" => "Erro ao criar usuário: " . $e->getMessage()
            ], 500);
        }
    }

    public function update($request, $id)
    {
        try {
            $user = User::findOrFail($id);
            $user->update($request);
            return response()->json([
                "message" => "Usuário atualizado com sucesso!"
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "error" => "Usuário não encontrado."
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                "error" => "Erro ao atualizar usuário: " . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();
            return response()->json([
                "message" => "Usuário excluído com sucesso!"
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "error" => "Usuário não encontrado."
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                "error" => "Erro ao deletar usuário: " . $e->getMessage()
            ], 500);
        }
    }
}
