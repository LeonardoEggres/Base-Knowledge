<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

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
                'message' => 'Login realizado com sucesso',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user,
            ], 200);
        } catch (\Exception $e) {
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
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro no login: ' . $e->getMessage()
            ], 500);
        }
    }

    public function logout($request)
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json(['message' => 'Desconectado com sucesso!'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro no logout: ' . $e->getMessage()
            ], 500);
        }
    }
}
