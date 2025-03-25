<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'contact',
        'purpose',
        'age',
        'sex',
        'status',
        'passport_number',
        'email',
        'address'
    ];

    /**
     * Get the queue entries for the client.
     */
    public function queueEntries()
    {
        return $this->hasMany(Queue::class);
    }
}       