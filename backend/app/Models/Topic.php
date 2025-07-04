<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Topic extends Model
{
    /** @use HasFactory<\Database\Factories\TopicFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'summary',
        'content',
        'keywords'
    ];

    protected $casts = [
        'keywords' => 'array'
    ];
}
