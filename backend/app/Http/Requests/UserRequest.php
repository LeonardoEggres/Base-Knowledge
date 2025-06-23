<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string',
            'email' => 'required|string',
            'password' => 'required|string'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome do usuário é obrigatório.',
            'name.string' => 'O nome deve ser um texto.',
            'email.required' => 'O email do usuário é obrigatório.',
            'email.string' => 'O email deve ser um texto.',
            'password.required' => 'A senha do usuário é obrigatória.',
            'password.string' => 'A senha deve ser um texto'
        ];
    }
}
