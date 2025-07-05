<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\EventParticipant;

class EventController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'event_name' => 'required|string',
            'college_name' => 'required|string',
            'year_of_study' => 'required|string',
            'message' => 'nullable|string',
        ]);

        $participant = EventParticipant::create($validated);

        return response()->json([
            'message' => 'Event registration successful!',
            'data' => $participant
        ], 201);
    }
}
