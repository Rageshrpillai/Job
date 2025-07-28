<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Coupon;

class Event extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
      protected $fillable = [
        'user_id',
        'title',
        'slug',
        'description',
        'main_image_path',
        'category',
        'event_type',
        'venue',
        'latitude',
        'longitude',
        'start_time',
        'end_time',
        'published_at',
        'max_attendees',
        'status',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'published_at' => 'datetime',
        'last_ticket_sold_at' => 'datetime',
        'requires_verification' => 'boolean',
        'is_flagged' => 'boolean',
    ];

    /**
     * Get the user (organizer) that owns the event.
     */
    public function organizer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the tickets for the event.
     */
    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }

    /**
     * Get the coupons for the event.
     */
    public function coupons(): HasMany
    {
        return $this->hasMany(Coupon::class);
    }
}
