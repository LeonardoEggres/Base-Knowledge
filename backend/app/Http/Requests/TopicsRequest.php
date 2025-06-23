<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TopicsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:user,id',
            'title' => 'required|string',
            'summary' => 'required|text',
            'content' => 'required|text',
            'keywords' => 'required|array',
            'keywords.*' => 'string'
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'O ID do usuário é obrigatório.',
            'user_id.exists' => 'O ID do usuário informado não existe.',
            'title.required' => 'O título do tópico é obrigatório.',
            'title.string' => 'O título deve ser um texto.',
            'summary.required' => 'O resumo do tópico é obrigatório.',
            'summary.string' => 'O resumo deve ser um texto.',
            'content.required' => 'O conteúdo completo do tópico é obrigatório.',
            'content.string' => 'O conteúdo deve ser um texto.',
            'keywords.required' => 'As palavras-chave são obrigatórias.',
            'keywords.array' => 'As palavras-chave devem estar em formato de lista.',
            'keywords.*.string' => 'Cada palavra-chave deve ser um texto.'
        ];
    }
}
