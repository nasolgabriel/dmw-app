<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;
    
    public $timestamps = false;
    
    protected $fillable = [
        'abbreviation',
        'description'
    ];
    
    public function serviceCounters()
    {
        return $this->hasMany(ServiceCounter::class);
    }

    /**
     * Get the queues for the service.
     */
    public function queues()
    {
        return $this->hasMany(Queue::class);
    }
}