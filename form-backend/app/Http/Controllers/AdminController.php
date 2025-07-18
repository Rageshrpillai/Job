<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\LoginHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Spatie\Permission\Models\Role;

class AdminController extends Controller
{
    /**
     * Display a listing of users, can be filtered to show only admins or regular users.
     */
    public function index(Request $request, bool $adminOnly = false)
    {
        Log::info('AdminController@index called with adminOnly=' . ($adminOnly ? 'true' : 'false'));

        $sortableColumns = ['name', 'email', 'created_at', 'address'];
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        if (!in_array($sortBy, $sortableColumns)) {
            $sortBy = 'created_at';
        }

        // The base query now depends on the $adminOnly flag and eager-loads relationships
        $query = User::query()->where('is_admin', $adminOnly)->with('latestLogin', 'roles');

        // Apply search filter
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('email', 'LIKE', "%{$searchTerm}%");
            });
        }

        // Apply date filters
        if ($request->filled('date_from') && $request->filled('date_to') && $request->filled('date_type')) {
            $dateFrom = $request->input('date_from');
            $dateTo = $request->input('date_to');
            $dateType = $request->input('date_type');

            if ($dateType === 'created_at') {
                $query->whereDate('created_at', '>=', $dateFrom)->whereDate('created_at', '<=', $dateTo);
            } elseif ($dateType === 'last_login_at') {
                $query->whereHas('loginHistories', function ($subQuery) use ($dateFrom, $dateTo) {
                    $subQuery->whereDate('login_at', '>=', $dateFrom)->whereDate('login_at', '<=', $dateTo);
                });
            }
        }

        // Apply status filters only for the regular user list
        if (!$adminOnly && $request->filled('filter') && $request->filter !== 'all') {
            $filter = $request->filter;
            if ($filter === 'deleted') {
                $query->onlyTrashed();
            } else {
                $query->whereNull('deleted_at');
                if ($filter === 'pending') $query->where('status', 'pending_approval');
                if ($filter === 'active') $query->where('status', 'active')->where('is_blocked', false);
                if ($filter === 'blocked') $query->where('is_blocked', true);
            }
        } else {
            // Include soft-deleted users when filter is 'all' or for the admin list
            $query->withTrashed();
        }

        $query->orderBy($sortBy, $sortDirection);
        $users = $query->get();
        Log::info("Query finished, found {$users->count()} users.");

        return response()->json($users);
    }

    /**
     * Create a new admin user from scratch.
     */
    public function createAdmin(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $adminUser = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_admin' => true,
            'status' => 'active',
        ]);

        $adminRole = Role::where('name', 'Administrator')->first();
        if ($adminRole) {
            $adminUser->assignRole($adminRole);
        }

        return response()->json($adminUser, 201);
    }
    
    /**
     * Search for regular users who can be promoted.
     */
    public function searchUsersForPromotion(Request $request)
    {
        $request->validate(['search' => 'required|string']);
        $searchTerm = $request->input('search');

        $users = User::where('is_admin', false)
            ->where(function ($query) use ($searchTerm) {
                $query->where('name', 'LIKE', "%{$searchTerm}%")
                      ->orWhere('email', 'LIKE', "%{$searchTerm}%");
            })
            ->take(5)
            ->get();

        return response()->json($users);
    }

    /**
     * Promote an existing regular user to become an admin.
     */
    public function promoteUser(User $user)
    {
        if ($user->is_admin) {
            return response()->json(['message' => 'User is already an admin.'], 422);
        }

        $user->is_admin = true;
        $user->save();

        $adminRole = Role::where('name', 'Administrator')->first();
        if ($adminRole) {
            $user->assignRole($adminRole);
        }

        return response()->json(['message' => 'User has been successfully promoted to admin.']);
    }

    public function approveUser(User $user)
    {
        if ($user->is_admin) { return response()->json(['message' => 'Cannot approve an admin account.'], 403); }
        if ($user->status === 'active') { return response()->json(['message' => 'User is already approved.'], 422); }
        if ($user->is_blocked) { return response()->json(['message' => 'Cannot approve a blocked user. Unblock first.'], 422); }
        if ($user->trashed()) { return response()->json(['message' => 'Cannot approve a deleted user. Restore first.'], 422); }
        $user->status = 'active';
        $user->status_reason = null;
        $user->save();
        return response()->json(['message' => 'User has been successfully approved.', 'user' => $user]);
    }

    public function blockUser(User $user, Request $request)
    {
        $request->validate(['reason' => 'required|string|min:10']);
        if ($user->is_admin) { return response()->json(['message' => 'Cannot block an admin account.'], 403); }
        if ($user->is_blocked) { return response()->json(['message' => 'User is already blocked.'], 422); }
        if ($user->trashed()) { return response()->json(['message' => 'Cannot block a deleted user. Restore first.'], 422); }
        $user->is_blocked = true;
        $user->blocked_at = Carbon::now();
        $user->blocked_reason = $request->input('reason');
        $user->status = 'blocked';
        $user->save();
        Log::info("User {$user->id} blocked by admin. Reason: {$user->blocked_reason}");
        return response()->json(['message' => 'User has been successfully blocked.', 'user' => $user]);
    }

    public function unblockUser(User $user)
    {
        if (!$user->is_blocked) { return response()->json(['message' => 'User is not blocked.'], 422); }
        if ($user->trashed()) { return response()->json(['message' => 'Cannot unblock a deleted user. Restore first.'], 422); }
        $user->is_blocked = false;
        $user->blocked_at = null;
        $user->blocked_reason = null;
        $user->status = 'active';
        $user->save();
        Log::info("User {$user->id} unblocked by admin.");
        return response()->json(['message' => 'User has been successfully unblocked.', 'user' => $user]);
    }

    public function softDeleteUser(User $user, Request $request)
    {
        $request->validate(['reason' => 'required|string|min:10']);
        if ($user->is_admin) { return response()->json(['message' => 'Cannot delete an admin account.'], 403); }
        if ($user->trashed()) { return response()->json(['message' => 'User is already soft-deleted.'], 422); }
        $user->deleted_reason = $request->input('reason');
        $user->save();
        $user->delete();
        Log::info("User {$user->id} soft-deleted by admin. Reason: {$user->deleted_reason}");
        return response()->json(['message' => 'User has been soft-deleted successfully.', 'user' => $user]);
    }

    public function restoreUser($id)
    {
        $user = User::onlyTrashed()->find($id);
        if (!$user) { return response()->json(['message' => 'User is not soft-deleted or does not exist.'], 404); }
        $user->restore();
        $user->deleted_reason = null;
        $user->status = 'pending_approval';
        $user->is_blocked = false;
        $user->blocked_at = null;
        $user->blocked_reason = null;
        $user->save();
        Log::info("User {$id} restored by admin.");
        return response()->json(['message' => 'User has been successfully restored.', 'user' => $user]);
    }




       
   Public function getDashboardStats()
    {
        // Before: The original `getDashboardStats` method was here.
        // ** DEBUGGING STEP **
        // The query for 'recent_logins' has been replaced with an empty array.
        // If the dashboard loads after this change, it confirms the error is in
        // the LoginHistory query.
        
        $stats = [
            'pending_users' => User::where('status', 'pending_approval')->count(),
            'new_users_weekly' => User::where('created_at', '>=', Carbon::now()->subDays(7))->count(),
            'total_users' => User::count(),
            'total_roles' => Role::count(),
            'recent_logins' => [], // Temporarily return an empty array
        ];

        return response()->json($stats);
        
        // After: No other changes are needed in this file.
    }


    public function forceDeleteUser($id)
    {
        $user = User::withTrashed()->find($id);
        if (!$user) { return response()->json(['message' => 'User not found or has already been deleted.'], 404); }
        if ($user->is_admin) { return response()->json(['message' => 'Cannot force delete an admin account.'], 403); }
        if (!$user->trashed()) { return response()->json(['message' => 'User must be soft-deleted before permanent deletion.'], 422); }
        $user->forceDelete();
        Log::warning("User {$id} force-deleted by admin. Data is irrecoverable.");
        return response()->json(['message' => 'User has been permanently deleted.']);
    }

    public function getLoginHistory(User $user)
    {
        $history = $user->loginHistories()->take(5)->get();
        return response()->json($history);
    }
    
    public function bulkAction(Request $request)
    {
        $request->validate([
            'action' => 'required|string|in:approve,block,unblock,restore,delete',
            'userIds' => 'required|array|min:1',
            'userIds.*' => 'exists:users,id',
        ]);
        $action = $request->input('action');
        $userIds = $request->input('userIds');
        if ($action === 'restore') {
            $users = User::onlyTrashed()->whereIn('id', $userIds)->get();
        } else {
            $users = User::whereIn('id', $userIds)->where('is_admin', false)->get();
        }
        foreach ($users as $user) {
            switch ($action) {
                case 'approve':
                    if ($user->status !== 'active') { $user->status = 'active'; $user->save(); }
                    break;
                case 'block':
                    if (!$user->is_blocked) {
                        $user->is_blocked = true;
                        $user->status = 'blocked';
                        $user->blocked_reason = 'Blocked via bulk action.';
                        $user->save();
                    }
                    break;
                case 'unblock':
                    if ($user->is_blocked) {
                        $user->is_blocked = false;
                        $user->blocked_at = null;
                        $user->blocked_reason = null;
                        $user->status = 'active';
                        $user->save();
                    }
                    break;
                case 'restore':
                    $user->restore();
                    $user->status = 'pending_approval';
                    $user->save();
                    break;
                case 'delete':
                    if (!$user->trashed()) {
                        $user->deleted_reason = 'Deleted via bulk action.';
                        $user->save();
                        $user->delete();
                    }
                    break;
            }
        }
        return response()->json(['message' => 'Bulk action completed successfully.']);
    }
}
