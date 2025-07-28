<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class EventController extends Controller
{
    /**
     * Display a listing of the resource for the authenticated user.
     */
    public function index(Request $request)
    {
        $userId = Auth::id();
        $query = Event::query();

        if ($userId) {
            $query->where('user_id', $userId);
        } else {
            \Log::warning('Unauthenticated access to /api/events. Returning all events for testing.');
        }

        // Filter logic
        switch ($request->query('filter')) {
            case 'upcoming':
                $query->where('start_time', '>', now());
                break;
            case 'past':
                $query->where('end_time', '<', now());
                break;
            case 'current':
                $query->where('start_time', '<=', now())
                      ->where('end_time', '>=', now());
                break;
            case 'drafted':
                $query->where('status', 'draft');
                break;
            // case 'all' or default: no additional filter
        }

        $events = $query->latest()->get();
        return response()->json($events);
    }

    /**
     * Store a newly created event in storage.
     */
    public function store(Request $request)
    {
        $organizer = Auth::user();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'main_image' => 'required|image|max:51200',
            'category' => 'nullable|string|max:100',
            'event_type' => 'required|in:in-person,online',
            'venue' => 'required|string|max:255',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'max_attendees' => 'nullable|integer|min:1',
        ]);

        $imagePath = $request->file('main_image')->store('event_images', 'public');

        $event = Event::create([
            'user_id' => $organizer->id ?? null,
            'status' => $request->input('status', 'draft'),
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']),
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

    /**
     * Update an existing event in storage.
     */
    public function update(Request $request, Event $event)
    {
        $user = $request->user();
        if ($event->user_id !== ($user->id ?? null)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'nullable|string|max:100',
            'event_type' => 'required|in:in-person,online',
            'venue' => 'required|string|max:255',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'max_attendees' => 'nullable|integer|min:1',
            'main_image' => 'nullable|image|max:51200',
        ]);

        if ($request->hasFile('main_image')) {
            $imagePath = $request->file('main_image')->store('event_images', 'public');
            $event->main_image_path = $imagePath;
        }

        $event->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'event_type' => $validated['event_type'],
            'venue' => $validated['venue'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'max_attendees' => $validated['max_attendees'],
        ]);

        return response()->json($event);
    }
}
