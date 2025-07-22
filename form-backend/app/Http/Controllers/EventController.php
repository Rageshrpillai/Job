<?php
// File: form-backend/app/Http/Controllers/EventController.php
// This is the complete, corrected file. It REPLACES the existing file entirely.
// This code ensures both displaying events (index) and creating events (store) work correctly.

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Use this for consistency
use Illuminate\Support\Str;

class EventController extends Controller
{
    /**
     * Display a listing of the resource for the authenticated user.
     * THIS IS THE CRITICAL FIX.
     */
    public function index(Request $request)
    {
        // Get the currently authenticated user
        $userId = Auth::id();

        // Fetch events WHERE the 'user_id' column matches the authenticated user's ID.
        $events = Event::where('user_id', $userId)->latest()->get();

        // Return the filtered events as a JSON response.
        return response()->json($events);
    }

    /**
     * Store a newly created event in storage.
     * (This is your existing, correct code for creating events)
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
            'user_id' => $organizer->id,
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
        if ($event->user_id !== $user->id) {
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

        $event->title = $validated['title'];
        $event->description = $validated['description'];
        $event->category = $validated['category'];
        $event->event_type = $validated['event_type'];
        $event->venue = $validated['venue'];
        $event->start_time = $validated['start_time'];
        $event->end_time = $validated['end_time'];
        $event->max_attendees = $validated['max_attendees'];
        $event->save();

        return response()->json($event);
    }
}