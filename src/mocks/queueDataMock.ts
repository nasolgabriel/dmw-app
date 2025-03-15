export type CounterType = "window" | "agency" | "cashier" | "queue";

export type MockQueueNumber = {
  counter: string;
  clientNumber?: number | number[];
  type: CounterType;
  division: string;
};

export const mockQueueData: MockQueueNumber[] = [
  {
    counter: "Window 1",
    clientNumber: 101,
    type: "window",
    division: "MIGRANT WORKERS PROTECTION",
  },
  {
    counter: "Window 2",
    clientNumber: 102,
    type: "window",
    division: "MIGRANT WORKERS PROTECTION",
  },
  {
    counter: "Window 3",
    clientNumber: 103,
    type: "window",
    division: "MIGRANT WORKERS PROTECTION",
  },

  // Migrant Worker Processing Division (404-407)
  {
    counter: "Window 4",
    clientNumber: 104,
    type: "window",
    division: "MIGRANT WORKER PROCESSING",
  },
  {
    counter: "Window 5",
    clientNumber: 105,
    type: "window",
    division: "MIGRANT WORKER PROCESSING",
  },
  {
    counter: "Window 6",
    clientNumber: 106,
    type: "window",
    division: "MIGRANT WORKER PROCESSING",
  },
  {
    counter: "Window 7",
    clientNumber: 107,
    type: "window",
    division: "MIGRANT WORKER PROCESSING",
  },

  // Welfare Reintegration Division (408-410)
  {
    counter: "Window 8",
    clientNumber: 108,
    type: "window",
    division: "WELFARE REINTEGRATION",
  },
  {
    counter: "Window 9",
    clientNumber: 109,
    type: "window",
    division: "WELFARE REINTEGRATION",
  },
  {
    counter: "Window 10",
    clientNumber: 110,
    type: "window",
    division: "WELFARE REINTEGRATION",
  },

  // Attached Agencies (411-412)
  {
    counter: "PAG-IBIG",
    clientNumber: 201,
    type: "agency",
    division: "ATTACHED AGENCIES",
  },
  {
    counter: "OWWA",
    clientNumber: 301,
    type: "agency",
    division: "ATTACHED AGENCIES",
  },

  // Special Counters
  {
    counter: "Cashier",
    clientNumber: 401,
    type: "cashier",
    division: "SPECIAL SERVICES",
  },
  {
    counter: "Waiting Queue",
    clientNumber: [
      501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515,
      516,
    ],
    type: "queue",
    division: "QUEUE MANAGEMENT",
  },
];

export type OnProcessQueue = {
  queueNumbers: (string | number)[];
  name: string;
  age: number;
  sex: string;
  contact: string;
  address: string;
  email: string;
  passportNumber: number;
  appointment: boolean;
  transaction: string;
};

export const mockOnProcessQueueData: OnProcessQueue[] = [
  {
    queueNumbers: [402, 403],
    name: "John Doe",
    age: 30,
    sex: "Male",
    contact: "123-456-7890",
    address: "123 Main St, Anytown, USA",
    email: "johndoe@example.com",
    passportNumber: 123456789,
    appointment: true,
    transaction: "OEC",
  },
];
