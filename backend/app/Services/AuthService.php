<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log; 

class AuthService
{
    public function register(array $request)
    {
        try {
            $user = User::create([
                'name' => $request['name'],
                'email' => $request['email'],
                'password' => Hash::make($request['password']),
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Registro e login realizados com sucesso',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
            ], 200);
        } catch (\Exception $e) {
            Log::error('Erro no registro: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'error' => 'Erro no registro: ' . $e->getMessage()
            ], 500);
        }
    }

    public function login(array $request)
    {
        try {
            $user = User::where('email', $request['email'])->first();

            if (!$user || !Hash::check($request['password'], $user->password)) {
                return response()->json(['message' => "Credenciais inválidas."], 401);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                "message" => "Login realizado com sucesso!",
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ]
            ], 200);
        } catch (\Exception $e) {
            Log::error('Erro no login: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'error' => 'Erro no login: ' . $e->getMessage()
            ], 500);
        }
    }

    public function logout($request)
    {
        try {
            if ($request->user()) {
                $request->user()->currentAccessToken()->delete();
                return response()->json(['message' => 'Desconectado com sucesso!'], 200);
            } else {
                return response()->json(['message' => 'Nenhum usuário autenticado para fazer logout.'], 401);
            }
        } catch (\Exception $e) {
            Log::error('Erro no logout: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'error' => 'Erro no logout: ' . $e->getMessage()
            ], 500);
        }
    }
}
