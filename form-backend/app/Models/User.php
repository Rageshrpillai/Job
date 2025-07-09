<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes; // Import SoftDeletes

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes; // Use SoftDeletes trait

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
        'status', // Ensure 'status' is fillable if it's not already
        'status_reason', // Ensure 'status_reason' is fillable
        'is_blocked', // Add is_blocked
        'blocked_at', // Add blocked_at
        'blocked_reason', // Add blocked_reason
        'deleted_at', // SoftDeletes handles this, but including it can sometimes be useful
        'deleted_reason', // Add deleted_reason
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
            'is_blocked' => 'boolean', // Cast is_blocked to boolean
            'blocked_at' => 'datetime', // Cast blocked_at to datetime
            'deleted_at' => 'datetime', // SoftDeletes will often cast this automatically, but explicitly defining is harmless
        ];
    }
}