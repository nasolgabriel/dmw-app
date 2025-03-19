<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'firstName',
        'middleName',
        'lastName',
        'contact',
        'purpose',
        'age',
        'birthday',
        'sex',
        'status',
        'passport_number',
        'email',
        'address'
        
    ];


    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'priority' => 'boolean',
    ];

    /**
     * Get the queue entries for the client.
     */
    public function queueEntries()
    {
        return $this->hasMany(Queue::class);
    }
    
    /**
     * Get the client's full name.
     */
    public function getFullNameAttribute()
    {
        return trim(
            ($this->firstName ?? '') . ' ' . 
            ($this->middleName ?? '') . ' ' . 
            ($this->lastName ?? '')
        );
    }
}