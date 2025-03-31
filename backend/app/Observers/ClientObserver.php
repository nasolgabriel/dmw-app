<?php

namespace App\Observers;

use App\Models\Client;
use App\Models\Queue;
use App\Models\Service;

class ClientObserver
{
    /**
     * Handle the Client "created" event.
     */
    public function created(Client $client): void
    {
        // Only create queue entry if client ID exists
        if ($client->id) {
            $this->createQueueEntry($client);
        }
    }

    /**
     * Handle the Client "updated" event.
     */
    public function updated(Client $client): void
    {
        // Keep the existing logic for status change to "in queue"
        if ($client->status === 'in queue' && $client->getOriginal('status') !== 'in queue') {
            $this->createQueueEntry($client);
        }
    }

    /**
     * Create a new queue entry for the client.
     */
    private function createQueueEntry(Client $client): void
    {
        // Validate that client_id is set
        if (!$client->id) {
            \Log::error('Attempted to create queue entry for client without ID');
            return;
        }

        // Get the count of today's queue entries and add 1 for the new ticket
        $clientCountToday = Queue::whereDate('created_at', date('Y-m-d'))->count() + 1;
        
        // Generate the ticket number as a 3-digit format (e.g., 001, 002, 003)
        $ticketNumber = str_pad($clientCountToday, 3, '0', STR_PAD_LEFT);
        
        // Find service based on client's purpose
        $service = Service::where('description', 'LIKE', '%' . $client->purpose . '%')->first();
        
        // Get the service abbreviation, defaulting to 'GEN' if no matching service found
        $serviceAbbr = $service ? $service->abbreviation : 'GEN';
        
        // Create the final ticket number with service abbreviation
        $finalTicketNumber = $serviceAbbr . '-' . $ticketNumber;
        
        // Create a new queue entry
        Queue::create([
            'ticket_number' => $finalTicketNumber,
            'client_id' => $client->id,
            'service_id' => $service ? $service->id : null,
            'counter_id' => null, 
            'status' => $client->status ?? 'waiting'
        ]);
    }
}