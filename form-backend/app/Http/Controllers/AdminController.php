<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon; // Import Carbon for explicit datetime usage

class AdminController extends Controller
{
    /**
     * Display a listing of all non-admin users (including active, pending, blocked, and soft-deleted).
     */
    public function index()
    {
        // Fetch all non-admin users, including those soft-deleted
        $users = User::where('is_admin', false)
                     ->withTrashed() // Include soft-deleted users
                     ->get();

        return response()->json($users);
    }

    /**
     * Approve a user's account.
     */
    public function approveUser(User $user)
    {
        // Check if the user is already active or is an admin or is blocked
        if ($user->is_admin) {
            return response()->json(['message' => 'Cannot approve an admin account.'], 403);
        }

        if ($user->status === 'active') {
            return response()->json(['message' => 'User is already approved.'], 422);
        }

        if ($user->is_blocked) {
            return response()->json(['message' => 'Cannot approve a blocked user. Unblock first.'], 422);
        }
        
        // Ensure user is not soft-deleted
        if ($user->trashed()) {
            return response()->json(['message' => 'Cannot approve a deleted user. Restore first.'], 422);
        }

        // Update the user's status to 'active'
        $user->status = 'active';
        $user->status_reason = null; // Clear any previous status reason
        $user->save();

        return response()->json([
            'message' => 'User has been successfully approved.',
            'user' => $user,
        ]);
    }

    /**
     * Block a user's account.
     */
    public function blockUser(User $user, Request $request)
    {
        $request->validate([
            'reason' => 'required|string|min:10',
        ]);

        if ($user->is_admin) {
            return response()->json(['message' => 'Cannot block an admin account.'], 403);
        }

        if ($user->is_blocked) {
            return response()->json(['message' => 'User is already blocked.'], 422);
        }
        
        // Ensure user is not soft-deleted
        if ($user->trashed()) {
            return response()->json(['message' => 'Cannot block a deleted user. Restore first.'], 422);
        }

        $user->is_blocked = true;
        $user->blocked_at = Carbon::now(); // Explicitly use Carbon::now() for clarity
        $user->blocked_reason = $request->input('reason');
        $user->status = 'blocked'; // Update general status
        $user->save();

        Log::info("User {$user->id} blocked by admin. Reason: {$user->blocked_reason}");

        return response()->json([
            'message' => 'User has been successfully blocked.',
            'user' => $user,
        ]);
    }

    /**
     * Unblock a user's account.
     */
    public function unblockUser(User $user)
    {
        if (!$user->is_blocked) {
            return response()->json(['message' => 'User is not blocked.'], 422);
        }
        
        if ($user->trashed()) {
            return response()->json(['message' => 'Cannot unblock a deleted user. Restore first.'], 422);
        }

        $user->is_blocked = false;
        unset($user->blocked_at); // Changed: Unset the attribute instead of setting to null to avoid strict type conversion
        $user->blocked_reason = null;
        $user->status = 'active'; // Reset status to active upon unblock
        $user->save();

        Log::info("User {$user->id} unblocked by admin.");

        return response()->json([
            'message' => 'User has been successfully unblocked.',
            'user' => $user,
        ]);
    }

    /**
     * Soft delete a user's account.
     */
    public function softDeleteUser(User $user, Request $request)
    {
        $request->validate([
            'reason' => 'required|string|min:10',
        ]);

        if ($user->is_admin) {
            return response()->json(['message' => 'Cannot delete an admin account.'], 403);
        }

        if ($user->trashed()) {
            return response()->json(['message' => 'User is already soft-deleted.'], 422);
        }

        // Store the reason before soft deleting
        $user->deleted_reason = $request->input('reason');
        $user->save(); // Save the reason first, this save does not affect 'deleted_at' yet

        $user->delete(); // This method, provided by SoftDeletes trait, sets 'deleted_at' timestamp

        Log::info("User {$user->id} soft-deleted by admin. Reason: {$user->deleted_reason}");

        return response()->json([
            'message' => 'User has been soft-deleted successfully.',
            'user' => $user->load('deleted_at'), // Load deleted_at for response to see the change
        ]);
    }

    /**
     * Restore a soft-deleted user's account.
     */
    public function restoreUser(User $user)
    {
        if (!$user->trashed()) {
            return response()->json(['message' => 'User is not soft-deleted.'], 422);
        }

        $user->restore(); // This method, provided by SoftDeletes trait, sets 'deleted_at' to null automatically
        $user->deleted_reason = null; // Clear the deletion reason
        $user->status = 'pending_approval'; // Reset status to pending approval upon restoration
        $user->is_blocked = false; // Ensure user is unblocked if they were blocked prior to deletion
        unset($user->blocked_at); // Changed: Unset the attribute instead of setting to null
        $user->blocked_reason = null; // Clear blocked reason
        $user->save(); // Save the changes

        Log::info("User {$user->id} restored by admin.");

        return response()->json([
            'message' => 'User has been successfully restored.',
            'user' => $user,
        ]);
    }

    /**
     * Permanently delete a user's account. Use with extreme caution.
     */
    public function forceDeleteUser(User $user)
    {
        if (!$user->trashed()) {
            return response()->json(['message' => 'User must be soft-deleted before force deletion.'], 422);
        }
        
        if ($user->is_admin) {
            return response()->json(['message' => 'Cannot force delete an admin account.'], 403);
        }

        $user->forceDelete(); // This method, provided by SoftDeletes trait, permanently deletes the record

        Log::warning("User {$user->id} force-deleted by admin. Data is irrecoverable.");

        return response()->json([
            'message' => 'User has been permanently deleted.',
        ]);
    }
}