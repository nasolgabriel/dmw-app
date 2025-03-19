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
        'counter_id', // Changed from service_id to counter_id
        'status'
    ];
    
    // Update your relationships too if needed
    public function client()
    {
        return $this->belongsTo(Client::class);  
    }
    
    public function counter()
    {
        return $this->belongsTo(ServiceCounter::class, 'counter_id');
    }
}