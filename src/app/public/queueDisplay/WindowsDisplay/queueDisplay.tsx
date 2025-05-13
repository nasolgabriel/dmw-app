"use client";
import React from "react";
import HeaderBar from "../../../../components/headerBar/headerBar";
import QueueCounters from "./queueCounters";
import { QueueItemData } from "@/types/queueDisplay";

interface QueueDisplayProps {
  cashierData?: QueueItemData;
  queueData?: QueueItemData;
}

const QueueDisplay: React.FC<QueueDisplayProps> = ({
  cashierData,
  queueData,
}) => {
  // Provide default empty arrays if data is missing
  const clientNumbers: string[] = Array.isArray(queueData?.clientNumber)
    ? queueData.clientNumber
    : [];
  const priorities: boolean[] = Array.isArray(queueData?.isPriority)
    ? queueData.isPriority
    : [];

  return (
    <div className="w-screen h-screen overflow-hidden">
      <HeaderBar />
      <div className="flex h-[90%]">
        <div className="w-[80%] h-full overflow-clip">
          <QueueCounters />
        </div>
        <div className="w-[20%] h-full border-t-[3px] border-r-[3px] border-b-[3px] border-[#A0A0A0] flex flex-col">
          <div className="p-5 flex-none flex flex-col w-full">
            <h1 className="font-bold text-[1rem] xl:text-[2rem] text-left">
              CASHIER
            </h1>
            <h1 className="font-bold text-[1rem] xl:text-[4rem] text-center m-10">
              {cashierData?.clientNumber || "\u00A0"}
            </h1>
          </div>
          <div className="flex-1">
            <div className="p-5 flex flex-col border-t-[3px] border-[#A0A0A0] h-[600px]">
              <h1 className="font-bold text-[1rem] xl:text-[2rem] text-left pb-2">
                IN QUEUE
              </h1>
              <div className="flex flex-col flex-wrap gap-x-2 content-start overflow-auto h-[540px] pl-2">
                {clientNumbers.map((num, index) => (
                  <h1
                    key={index}
                    className="font-bold text-[1rem] xl:text-[1.4rem] mb-2 pr-4"
                  >
                    <span>{num}</span>
                    {priorities[index] && (
                      <span className="text-sm text-red-500 justify-center">
                        {" "}
                        (priority)
                      </span>
                    )}
                  </h1>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueDisplay;
