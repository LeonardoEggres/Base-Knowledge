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
            'files' => 'required|array|min:1',
            'files.*' => 'file|mimes:pdf,jpg,jpeg,png,gif,webp,doc,docx,txt|max:10240' 
        ];
    }

    public function messages(): array
    {
        return [
            'topic_id.required' => 'O ID do tópico é obrigatório.',
            'topic_id.exists' => 'O tópico informado não existe.',
            'files.required' => 'Pelo menos um arquivo é obrigatório.',
            'files.array' => 'Os arquivos devem ser enviados como array.',
            'files.min' => 'Pelo menos um arquivo deve ser enviado.',
            'files.*.file' => 'Cada item deve ser um arquivo válido.',
            'files.*.mimes' => 'Os arquivos devem ser do tipo: pdf, jpg, jpeg, png, gif, webp, doc, docx, txt.',
            'files.*.max' => 'Cada arquivo deve ter no máximo 10MB.'
        ];
    }
}
