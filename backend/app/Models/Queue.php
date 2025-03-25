<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Queue extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'ticket_number', 'service_id', 'counter_id', 'status', 'called_at'
    ];
    
    protected $casts = [
        'called_at' => 'datetime'
    ];
    
    public function service()
    {
        return $this->belongsTo(Service::class);
    }
    
    public function counter()
    {
        return $this->belongsTo(ServiceCounter::class, 'counter_id');
    }
    
    // Update your relationships too if needed
    public function client()
    {
        return $this->belongsTo(Client::class);  
    }
    
}