<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilesRequest;
use App\Models\File;
use App\Services\FileService;
use Illuminate\Http\Request;

class FileController extends Controller
{
    public function index(FileService $fileService)
    {
        return $fileService->index();
    }

    public function show(string $id, FileService $fileService)
    {
        return $fileService->show($id);
    }

    public function store(FilesRequest $request, FileService $fileService)
    {
        return $fileService->store($request);
    }

    public function update(FilesRequest $request, string $id, FileService $fileService)
    {
        return  $fileService->update($request->validated(), $id);
    }

    public function destroy(string $id, FileService $fileService)
    {
        return $fileService->destroy($id);
    }

    public function getFilesByTopic($topicId, FileService $fileService)
    {
        return $fileService->getFilesByTopic($topicId);
    }
    
}
