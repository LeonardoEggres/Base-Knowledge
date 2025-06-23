<?php

namespace App\Http\Controllers;

use App\Http\Requests\TopicsRequest;
use App\Models\Topic;
use App\Services\TopicService;
use Illuminate\Http\Request;

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
        return $topicService->store($request->validate());
    }

    public function update(TopicsRequest $request, string $id, TopicService $topicService)
    {
        return  $topicService->update($request->validate(), $id);
    }

    public function destroy(string $id, TopicService $topicService)
    {
        return $topicService->destroy($id);
    }
}
