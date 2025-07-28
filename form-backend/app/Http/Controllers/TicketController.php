<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Event $event)
    {
        if ($event->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json($event->tickets);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Event $event)
    {
        if ($event->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // ### START OF THE FIX ###
        // Updated validation to match the frontend form and database migration.
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'total_quantity' => 'required|integer|min:1', // Corrected field name
            'description' => 'nullable|string',
            'sale_start_date' => 'required|date',
            'sale_end_date' => 'required|date|after_or_equal:sale_start_date',
        ]);
        // ### END OF THE FIX ###
        
        // The rest of the data is now correctly named from the form
        $ticket = $event->tickets()->create($validatedData);

        return response()->json($ticket, 201);
    }

    /**
     * Remove the specified resource from storage.
     */ public function destroy(Ticket $ticket)
    {
        // ### START OF THE FIX ###
        // Get the parent event from the ticket and check if the authenticated user owns it.
        if ($ticket->event->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        // ### END OF THE FIX ###

        $ticket->delete();

        return response()->json(['message' => 'Ticket deleted successfully'], 200);
    }
}