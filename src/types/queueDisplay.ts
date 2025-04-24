export interface ActiveTicket {
    id: number;
    ticket_number: string;
    service: string;
    status: string;
    created_at: string;
  }
  
  export interface QueueDisplayData {
    name: string;
    active_queues_count: number;
    services_count: number;
    active_tickets: ActiveTicket[];
  }
  
  
  export interface QueueDisplayResponse {
    success: boolean;
    data: QueueDisplayData[];
  }