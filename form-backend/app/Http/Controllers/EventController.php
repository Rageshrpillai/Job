<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EventParticipant;

class EventController extends Controller
{
    public function index()
    {
        return EventParticipant::latest()->get();
    }


    public function show(EventParticipant $participant)
    {
        return $participant;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'event_name' => 'required|string|max:255',
            'college_name' => 'required|string|max:255',
            'year_of_study' => 'required|string|max:20',
            'message' => 'nullable|string',
        ]);

        $participant = EventParticipant::create($validated);

        return response()->json(['message' => 'Event registration successful!', 'data' => $participant], 201);
    }

  
    public function destroy(EventParticipant $participant)
    {
        $participant->delete();
        return response()->json(['message' => 'Participant deleted successfully.']);
    }
}