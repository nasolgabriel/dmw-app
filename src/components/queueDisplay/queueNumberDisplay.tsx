"use client";

import React from "react";

type QueueSectionProps = {
  title: string;
  queueNumbers: (string | number)[];
};

const QueueSection = ({ title, queueNumbers }: QueueSectionProps) => {
  return (
    <div className=" h-full">
      <h2 className="pl-2 font-bold text-[2.5rem] mb-4">{title}</h2>
      <div className="font-bold text-[4rem]">
        {queueNumbers.map((number, index) => (
          <div key={index}>{number}</div>
        ))}
      </div>
    </div>
  );
};

export default QueueSection;