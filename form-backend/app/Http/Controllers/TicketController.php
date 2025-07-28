<?php

namespace App\Http\Controllers;

use App\Http\Resources\TicketResource;
use App\Models\Event;
use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index($eventId)
    {
        $event = Event::find($eventId);

        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        $tickets = Ticket::where('event_id', $eventId)->get();

        return TicketResource::collection($tickets);
    }

    public function store(Request $request, $eventId)
    {
        $event = Event::find($eventId);

        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'total_quantity' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'sale_start_date' => 'required|date',
            'sale_end_date' => 'required|date|after:sale_start_date',
        ]);

        $ticket = $event->tickets()->create($validated);

        return new TicketResource($ticket);
    }

    public function destroy($ticketId)
    {
        $ticket = Ticket::find($ticketId);

        if (!$ticket) {
            return response()->json(['message' => 'Ticket not found'], 404);
        }

        $ticket->delete();

        return response()->json(['message' => 'Ticket deleted successfully']);
    }
}
