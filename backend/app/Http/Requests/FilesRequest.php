<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FilesRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'topic_id' => 'required|exists:topics,id',
            'file_name' => 'required|string',
            'file_path' => 'required|string',
            'file_type' => 'required|string'
        ];
    }

    public function messages(): array
    {
        return [
            'topic_id.required' => 'O ID do tópico é obrigatório.',
            'topic_id.exists' => 'O tópico informado não existe.',
            'file_name.required' => 'O nome do arquivo é obrigatório.',
            'file_name.string' => 'O nome do arquivo deve ser um texto.',
            'file_path.required' => 'O caminho do arquivo é obrigatório.',
            'file_path.string' => 'O caminho do arquivo deve ser um texto.',
            'file_type.required' => 'O tipo do arquivo é obrigatório.',
            'file_type.string' => 'O tipo do arquivo deve ser um texto.'
        ];
    }
}
