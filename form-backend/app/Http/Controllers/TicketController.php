<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    /**
     * Store a new ticket plan for a specific event.
     */
    public function store(Request $request, Event $event)
    {
        // Security Check: Ensure the person adding the ticket is the event organizer.
        if (Auth::id() !== $event->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'total_quantity' => 'required|integer|min:1',
            'sale_start_date' => 'required|date',
            'sale_end_date' => 'required|date|after:sale_start_date',
        ]);

        $ticket = $event->tickets()->create($validated);

        return response()->json($ticket, 201);
    }
}