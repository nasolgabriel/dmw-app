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
        <div className="w-[80%] h-full border-[3px] border-[#A0A0A0]"></div>
      </div>
    </div>
  );
};

export default QueueDisplay;
