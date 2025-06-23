<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Services\AuthService;
use Illuminate\Http\Request;

class RegisterController extends Controller
{
    public function register(RegisterRequest $request, AuthService $registerService)
    {
        return $registerService->register($request->validated());
    }
}
