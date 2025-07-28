<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CouponController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Event $event)
    {
        if ($event->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        // Eager load the tickets relationship to see which tickets each coupon applies to
        return response()->json($event->coupons()->with('tickets')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Event $event)
    {
        if ($event->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validatedData = $request->validate([
            'code' => 'required|string|unique:coupons,code',
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'valid_from' => 'required|date',
            'valid_to' => 'required|date|after_or_equal:valid_from',
            'ticket_ids' => 'required|array',
            'ticket_ids.*' => 'exists:tickets,id', // Ensure all ticket IDs exist
        ]);

        $coupon = $event->coupons()->create([
            'code' => $validatedData['code'],
            'discount_type' => $validatedData['discount_type'],
            'discount_value' => $validatedData['discount_value'],
            'usage_limit' => $validatedData['usage_limit'],
            'valid_from' => $validatedData['valid_from'],
            'valid_to' => $validatedData['valid_to'],
        ]);

        // Attach the selected tickets to the coupon
        $coupon->tickets()->attach($validatedData['ticket_ids']);
        
        // Return the new coupon with its ticket relationships loaded
        return response()->json($coupon->load('tickets'), 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Coupon $coupon)
    {
        // Check ownership through the event relationship
        if ($coupon->event->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $coupon->delete();

        return response()->json(['message' => 'Coupon deleted successfully'], 200);
    }
}