<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceCounter extends Model
{
    use HasFactory;
    
    const UPDATED_AT = null;
    
    protected $fillable = [
        'counter_number',
        'service_id',
        'assigned_staff',
        'status'
    ];
    
    public function service()
    {
        return $this->belongsTo(Service::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function users()
    {
        return $this->hasMany(User::class, 'counter_id');
    }
}