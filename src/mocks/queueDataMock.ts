export type QueueData = {
  title: string;
  queueNumbers: (string | number)[];
};

export const mockQueueData: QueueData[] = [
  {
    title: "E-Reg",
    queueNumbers: [402, 403, 404],
  },
  {
    title: "OEC",
    queueNumbers: [405, 407, 405],
  },
  {
    title: "Info Sheet",
    queueNumbers: [409, 408, 411],
  },
  {
    title: "WRSD",
    queueNumbers: [420],
  },
  {
    title: "SENA",
    queueNumbers: [412, 416],
  },
  {
    title: "Direct Hire",
    queueNumbers: [415],
  },
];

// Optional: Type for complete queue display data
export type FullQueueData = {
  [key: string]: (string | number)[];
};

export const fullQueueMock: FullQueueData = {
  eReg: [402, 403, 404],
  oec: [405, 407, 405],
  infoSheet: [409, 408, 411],
  wrsd: [420],
  sena: [412, 416],
  directHire: [415],
};
