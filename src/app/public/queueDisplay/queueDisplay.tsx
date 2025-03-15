"use client";

import React from "react";
import HeaderBar from "../../../components/headerBar/headerBar";
import QueueCounters from "./WindowsDisplay/queueCounters";

interface QueueDisplayProps {
  cashierData: any;
  queueData: any;
}

const QueueDisplay: React.FC<QueueDisplayProps> = ({ cashierData, queueData }) => {


  return (
    <div className="w-screen h-screen overflow-hidden">
      <HeaderBar />
      <div className="flex h-[90%]">
        <div className="w-[80%] h-full overflow-clip">
          <QueueCounters />
        </div>
        <div className="w-[20%] h-full border-t-[3px] border-r-[3px] border-b-[3px] border-[#A0A0A0] flex flex-col">
          <div className="p-5 flex-none flex flex-col w-full">
            <h1 className="font-bold text-[1rem] xl:text-[2rem] text-left">CASHIER</h1>
            <h1 className="font-bold text-[1rem] xl:text-[4rem] text-center m-10">
              {cashierData?.clientNumber}
            </h1>
          </div>
          <div className="flex-1">
            <div className="p-5 flex flex-col border-t-[3px] border-[#A0A0A0] h-[600px]">
              <h1 className="font-bold text-[1rem] xl:text-[2rem] text-left pb-2">IN QUEUE</h1>
              <div className="flex flex-col flex-wrap gap-x-24 content-start overflow-hidden pl-10">
                {Array.isArray(queueData?.clientNumber)
                  ? queueData.clientNumber.map((num: string, index: number) => (
                      <h1
                        key={index}
                        className="font-extrabold text-[1rem] xl:text-[2rem] mb-2 w-[80px]"
                      >
                        {num}
                      </h1>
                    ))
                  : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueDisplay;
