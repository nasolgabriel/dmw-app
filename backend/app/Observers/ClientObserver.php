<?php

namespace App\Observers;

use App\Models\Client;
use App\Models\Queue;
use Illuminate\Support\Str;
use App\Models\Service;

class ClientObserver
{
    /**
     * Handle the Client "created" event.
     */
    public function created(Client $client): void
    {
        if ($client->status === 'in queue') {
            $this->createQueueEntry($client);
        }
    }

    /**
     * Handle the Client "updated" event.
     */
    public function updated(Client $client): void
    {
        // Check if status changed to "in queue"
        if ($client->status === 'in queue' && $client->getOriginal('status') !== 'in queue') {
            $this->createQueueEntry($client);
        }
    }

    /**
     * Create a new queue entry for the client.
     */
    private function createQueueEntry(Client $client): void
{
    // Get the count of today's queue entries and add 1 for the new ticket
    $clientCountToday = Queue::whereDate('created_at', date('Y-m-d'))->count() + 1;
    
    // Generate the ticket number as a 3-digit format (e.g., 001, 002, 003)
    $ticketNumber = str_pad($clientCountToday, 3, '0', STR_PAD_LEFT);
    
    // Get the service abbreviation
    $service = Service::find($client->service_id);
    $serviceAbbr = $service ? $service->abbreviation : 'GEN'; // Default to 'GEN' if no service found
    
    // Create the final ticket number with service abbreviation
    $finalTicketNumber = $serviceAbbr . '-' . $ticketNumber;
    
    // Create a new queue entry
    Queue::create([
        'ticket_number' => $finalTicketNumber,
        'client_id' => $client->id,
        'counter_id' => null, // Default value or get from somewhere
        'status' => 'in queue'
    ]);
}


}