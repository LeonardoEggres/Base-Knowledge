<?php

namespace App\Http\Controllers;

use App\Http\Requests\TopicsRequest;
use App\Models\Topic;
use App\Services\TopicService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TopicController extends Controller
{
  public function index(TopicService $topicService)
    {
        return $topicService->index();
    }

    public function show(string $id, TopicService $topicService)
    {
        return $topicService->show($id);
    }

    public function store(TopicsRequest $request, TopicService $topicService)
    {
        return $topicService->store($request->validated());
    }

    public function update(TopicsRequest $request, string $id, TopicService $topicService)
    {
        $user = Auth::user();

        return  $topicService->update($request->validated(), $id, $user->id);
    }

    public function destroy(string $id, TopicService $topicService)
    {
        $user = Auth::user();

        return $topicService->destroy($id, $user->id);
    }
}
