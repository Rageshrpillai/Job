<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes, HasRoles;

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