<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(UserService $userService)
    {
        return $userService->index();
    }

    public function show(string $id, UserService $userService)
    {
        return $userService->show($id);
    }

    public function store(UserRequest $request, UserService $userService)
    {
        return $userService->store($request->validate());
    }

    public function update(UserRequest $request, string $id, UserService $userService)
    {
        return  $userService->update($request->validate(), $id);
    }

    public function destroy(string $id, UserService $userService)
    {
        return $userService->destroy($id);
    }
}
