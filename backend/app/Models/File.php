<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class File extends Model
{
    use HasFactory;

    protected $fillable = [
        'topic_id',
        'file_name',
        'file_path',
        'file_type'
    ];

    protected $appends = ['file_url'];

    public function topic()
    {
        return $this->belongsTo(Topic::class);
    }

    public function getFileUrlAttribute()
    {
        $url = Storage::url($this->file_path);

        if (!str_starts_with($url, 'http')) {
            $url = config('app.url') . $url;
        }

        return $url;
    }

    public function isImage()
    {
        return in_array($this->file_type, [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp'
        ]);
    }
}
