<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Queue extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_number',
        'client_id',
        'service_id',
        'status',
    ];

    /**
     * Get the client that owns the queue entry.
     */
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * Get the service associated with this queue entry.
     */
    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}