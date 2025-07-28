<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'main_image_path' => $this->main_image_path,
            'venue' => $this->venue,
            'start_time' => $this->start_time->toDateTimeString(),
            'end_time' => $this->end_time->toDateTimeString(),
            'event_type' => $this->event_type,
            'category' => $this->category,
            'max_attendees' => $this->max_attendees,
            'status' => $this->status,
            'user_id' => $this->user_id,
        ];
    }
}
