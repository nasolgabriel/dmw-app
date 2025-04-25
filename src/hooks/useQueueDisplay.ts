// hooks/useQueueDisplay.ts
import { getQueueDisplay } from "@/api/authApi";
import {
  QueueDisplayData,
  QueueItemData,
  CounterType,
} from "@/types/queueDisplay";
import { useQuery } from "@tanstack/react-query";

// Helper function to transform API data into the format expected by components
const transformApiData = (
  apiData: QueueDisplayData[]
): {
  windowItems: QueueItemData[];
  cashierItem?: QueueItemData;
  queueItem?: QueueItemData;
} => {
  const windowItems: QueueItemData[] = [];
  let cashierItem: QueueItemData | undefined;

  // Collect all in-queue tickets across all divisions
  const allQueueTickets: string[] = [];

  apiData.forEach((division) => {
    // Map active tickets that are in processing status
    const processingTickets = division.active_tickets.filter(
      (ticket) => ticket.status === "processing"
    );

    // Collect all in-queue tickets
    const queueTickets = division.active_tickets.filter(
      (ticket) => ticket.status === "in queue"
    );

    queueTickets.forEach((ticket) => {
      allQueueTickets.push(ticket.ticket_number);
    });

    // Add processing tickets as window items
    processingTickets.forEach((ticket) => {
      // Map division names to the format expected by the UI
      let divisionName = division.name.toUpperCase();
      let counterName = `Window ${ticket.counter_id}`;

      // Special handling for PAG-IBIG and OWWA
      if (divisionName === "PAG IBIG FUND") {
        divisionName = "ATTACHED AGENCIES";
        counterName = "PAG-IBIG";
      } else if (divisionName === "OWWA") {
        divisionName = "ATTACHED AGENCIES";
        counterName = "OWWA";
      } else if (divisionName === "MIGRANT WORKER PROCESSING DIVISION") {
        divisionName = "MIGRANT WORKER PROCESSING";
      } else if (divisionName === "MIGRANT WORKERS PROTECTION DIVISION") {
        divisionName = "MIGRANT WORKERS PROTECTION";
      } else if (
        divisionName === "WELFARE REINTEGRATION AND SERVICES DIVISION"
      ) {
        divisionName = "WELFARE REINTEGRATION";
      }

      windowItems.push({
        counter: counterName,
        clientNumber: ticket.ticket_number,
        type: "window" as CounterType,
        division: divisionName,
      });
    });

    // If this is the "cashier" division, check for processing tickets
    if (division.name === "Cashier") {
      const cashierProcessingTicket = processingTickets[0];
      if (cashierProcessingTicket) {
        cashierItem = {
          counter: "Cashier",
          clientNumber: cashierProcessingTicket.ticket_number,
          type: "cashier" as CounterType, // Explicitly cast to CounterType
          division: "SPECIAL SERVICES",
        };
      }
    }
  });

  // Create the queue item if we have any tickets in queue
  const queueItem =
    allQueueTickets.length > 0
      ? {
          counter: "Waiting Queue",
          clientNumber: allQueueTickets,
          type: "queue" as CounterType, // Explicitly cast to CounterType
          division: "QUEUE MANAGEMENT",
        }
      : undefined;

  return {
    windowItems,
    cashierItem,
    queueItem,
  };
};

export const useQueueDisplay = () => {
  return useQuery({
    queryKey: ["queueDisplay"],
    queryFn: getQueueDisplay,
    refetchInterval: 2000, // Refetch every 10 seconds
    select: (data: QueueDisplayData[]) => {
      const transformed = transformApiData(data);
      return {
        rawData: data,
        windowItems: transformed.windowItems,
        cashierItem: transformed.cashierItem,
        queueItem: transformed.queueItem,
      };
    },
  });
};
