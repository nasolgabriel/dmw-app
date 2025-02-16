"use client";

import React from "react";
import dmw_logo from "../../assets/DMW_logo.png";
import bagongPh from "../../assets/BagongPilipinas_logo.png";
import Image from "next/image";

type QueueDisplayProps = {
  toLocaleTimeString: string;
  toLocaleDateString: string;
};

const QueueDisplay = ({
  toLocaleTimeString,
  toLocaleDateString,
}: QueueDisplayProps) => {
  return (
    <div className="w-screen h-screen">
      <div className="flex justify-between h-[10%]">
        <Image
          src={dmw_logo}
          alt={"dmwLogo"}
          className="w-auto h-auto ml-5 p-3"
        />
        <div className="flex justify-end items-center w-full">
          <div className="flex flex-col justfiy-end text-white p-2">
            <div
              id="time"
              className="flex flex-col justify-end items-end text-[#000000] font-bold mr-5"
            >
              <span className="text-[2.5rem]">{toLocaleTimeString}</span>
              <span className="text-[1.5rem] mt-[-10] mb-2">
                {toLocaleDateString}
              </span>
            </div>
          </div>
        </div>
        <Image
          src={bagongPh}
          alt={"bpLogo"}
          className="w-auto h-auto mr-5 p-1"
        />
      </div>
      <div className="flex h-[90%]">
        <div className="w-[30%] h-full border-t-[3px] border-l-[3px] border-b-[3px] border-[#A0A0A0]">
          <div className="ml-10 mt-5">
            <h1 className="font-bold text-[1.5rem]">IN QUEUE</h1>
          </div>
        </div>
        <div className="w-[80%] h-full border-[3px] border-[#A0A0A0]">
          <div className="grid grid-rows-2 grid-cols-3 h-full">
            {/* First Row */}
            <div className="p-4 border-r border-b border-[#A0A0A0]">
              <h2 className="font-bold text-[1.5rem] mb-4">E-Reg</h2>
              <div className="text-[2rem] space-y-2">
                <div>402</div>
                <div>403</div>
                <div>404</div>
              </div>
            </div>
            <div className="p-4 border-r border-b border-[#A0A0A0]">
              <h2 className="font-bold text-[1.5rem] mb-4">OEC</h2>
              <div className="text-[2rem] space-y-2">
                <div>405</div>
                <div>407</div>
                <div>405</div>
              </div>
            </div>
            <div className="p-4 border-b border-[#A0A0A0]">
              <h2 className="font-bold text-[1.5rem] mb-4">Info Sheet</h2>
              <div className="text-[2rem] space-y-2">
                <div>409</div>
                <div>408</div>
                <div>411</div>
              </div>
            </div>

            {/* Second Row */}
            <div className="p-4 border-r border-[#A0A0A0]">
              <h2 className="font-bold text-[1.5rem] mb-4">WRSD</h2>
              <div className="text-[2rem]">420</div>
            </div>
            <div className="p-4 border-r border-[#A0A0A0]">
              <h2 className="font-bold text-[1.5rem] mb-4">SENA</h2>
              <div className="text-[2rem] space-y-2">
                <div>412</div>
                <div>416</div>
              </div>
            </div>
            <div className="p-4">
              <h2 className="font-bold text-[1.5rem] mb-4">Direct Hire</h2>
              <div className="text-[2rem]">415</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueDisplay;