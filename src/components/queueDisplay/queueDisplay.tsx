"use client";

import React from "react";
import QueueSection from "./queueNumberDisplay";
import HeaderBar from "../headerBar/headerBar";


const QueueDisplay = () => {
  return (
    <div className="w-screen h-screen">
      <HeaderBar/>
      <div className="flex h-[90%]">
        <div className="w-[30%] h-full border-t-[3px] border-l-[3px] border-b-[3px] border-[#A0A0A0]">
          <div className="ml-10 mt-5">
            <h1 className="font-bold text-[2rem]">IN QUEUE</h1>
          </div>
        </div>
        <div className="w-[80%] h-full border-[3px] border-[#A0A0A0]">
          <div className="grid grid-rows-2 grid-cols-3 h-full">
            {/* First Row */}
            <div className="border-r-[3px] border-b-[3px]  border-[#A0A0A0]">
              <QueueSection title="E-Reg" queueNumbers={[]} />
            </div>

            <div className="border-r-[3px] border-b-[3px] border-[#A0A0A0]">
              <QueueSection title="OEC" queueNumbers={[]} />
            </div>

            <div className="border-b-[3px] border-[#A0A0A0]">
              <QueueSection title="Info Sheet" queueNumbers={[]} />
            </div>

            {/* Second Row */}
            <div className="border-r-[3px] border-[#A0A0A0]">
              <QueueSection title="WRSD" queueNumbers={[]} />
            </div>

            <div className="border-r-[3px] border-[#A0A0A0]">
              <QueueSection title="SENA" queueNumbers={[]} />
            </div>

            <div>
              <QueueSection title="Direct Hire" queueNumbers={[]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueDisplay;
