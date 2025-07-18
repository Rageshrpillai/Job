<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class EventController extends Controller
{
    /**
     * Store a newly created event in storage.
     */
    public function store(Request $request)
    {
        $organizer = Auth::user();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'main_image' => 'required|image|max:500', // Validates image, 500KB max
            'category' => 'nullable|string|max:100',
            'event_type' => 'required|in:in-person,online',
            'venue' => 'required|string|max:255',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'max_attendees' => 'nullable|integer|min:1',
        ]);

        // Handle file upload
        $imagePath = $request->file('main_image')->store('event_images', 'public');

        $event = Event::create([
            'user_id' => $organizer->id,
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']), // Automatically create a URL-friendly slug
            'description' => $validated['description'],
            'main_image_path' => $imagePath,
            'category' => $validated['category'],
            'event_type' => $validated['event_type'],
            'venue' => $validated['venue'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'max_attendees' => $validated['max_attendees'],
            'event_created_ip' => $request->ip(),
            'device_info' => $request->userAgent(),
        ]);

        return response()->json($event, 201);
    }
}