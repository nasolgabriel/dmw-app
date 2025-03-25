<?php

namespace App\Observers;

use App\Models\Client;
use App\Models\Queue;
use Illuminate\Support\Str;

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

    // Use the client's purpose (only the first 2 characters in uppercase)
    $purpose = strtoupper(substr($client->purpose, 0, 2));

    // Generate the ticket number in the format: [Purpose][DailyCount padded to 3 digits]
    // For example, if the purpose is "DH" and it's the first ticket of the day, you'll get "DH001"
    $ticketNumber = $purpose . str_pad($clientCountToday, 3, '0', STR_PAD_LEFT);

    // Create a new queue entry
    Queue::create([
        'ticket_number' => $ticketNumber,
        'client_id' => $client->id,
        'service_id' => null, // Determine this based on client's purpose if needed
        'status' => 'in queue',
    ]);
}

}