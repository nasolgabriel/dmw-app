<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Queue extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'ticket_number', 
        'client_id',
        'service_id', 
        'counter_id', 
        'status', 
        'called_at'
    ];
    
    protected $casts = [
        'called_at' => 'datetime'
    ];
    
    /**
     * Get the client associated with the queue entry.
     *
     * @return BelongsTo
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'client_id');
    }
    
    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id');
    }
    
    public function counter()
    {
        return $this->belongsTo(ServiceCounter::class, 'counter_id');
    }
}