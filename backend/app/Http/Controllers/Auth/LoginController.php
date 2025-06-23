<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Services\AuthService;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    public function login(LoginRequest $request, AuthService $loginService)
    {
        return $loginService->login($request->validated());
    }

    public function logout(Request $request, AuthService $logoutService)
    {
        return $logoutService->logout($request);
    }
}
