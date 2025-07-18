<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Corrected from App\Models\HasApiTokens
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    // Make sure 'HasApiTokens' is included in the 'use' statement below
    use HasApiTokens, HasFactory, Notifiable, HasRoles, SoftDeletes;

    // This tells the User model to always use 'sanctum' for roles and permissions.
    protected $guard_name = 'sanctum';
    protected $fillable = [
        'name', // Keep original name for simplicity, or use accessor below
        'first_name',
        'last_name',
        'company',
        'organization_type',
        'email',
        'password',
        'phone',
        'address',
        'is_admin',
        'status',
        'status_reason',
        'is_blocked',
        'blocked_at',
        'blocked_reason',
        'deleted_reason',
        'last_login_at',
        'last_login_ip'
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'last_login_at' => 'datetime',
    ];
    
    // This accessor smartly combines names for display elsewhere in your app.
    public function getFullNameAttribute()
    {
        if ($this->organization_type === 'corporate' || $this->organization_type === 'company') {
            return $this->company;
        }
        return trim($this->first_name . ' ' . $this->last_name);
    }

    public function latestLogin()
    {
        return $this->hasOne(LoginHistory::class)->latestOfMany('login_at');
    }

    public function loginHistories()
    {
        return $this->hasMany(LoginHistory::class)->orderBy('login_at', 'desc');
    }
}