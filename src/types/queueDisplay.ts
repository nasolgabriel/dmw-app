// types.ts
export interface ActiveTicket {
    id: number;
    ticket_number: string;
    service: string;
    counter_id: number | null;
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
  
  export type CounterType = "window" | "agency" | "cashier" | "queue";
  
  export type QueueItemData = {
    counter: string;
    clientNumber: string | string[];
    type: CounterType;
    division: string;
  };
  
  // Define the structure for division display in the UI
  export const divisionStructure = [
    {
      title: "MIGRANT WORKERS PROTECTION",
      items: ["Window 1", "Window 2", "Window 3", ""]
    },
    {
      title: "MIGRANT WORKER PROCESSING",
      items: ["Window 4", "Window 5", "Window 6", "Window 7"]
    },
    {
      title: "WELFARE REINTEGRATION",
      items: ["Window 8", "Window 9", "Window 10", ""]
    },
    {
      title: "ATTACHED AGENCIES",
      items: ["PAG-IBIG", "OWWA", "", ""]
    }
  ];