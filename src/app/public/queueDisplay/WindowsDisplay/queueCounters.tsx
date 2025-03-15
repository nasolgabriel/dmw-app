import { mockQueueData } from "@/mocks";
import { Typography } from "@mui/material";
import { divisionStructure } from "../types";
import { useState, useEffect, useRef } from "react";
import '../../../../styles/globals.css';
import { useBlinkOnChange } from "@/hooks/useBlinkOnChange";



const QueueCounters = () => {
  const dataMap = new Map(
    mockQueueData.map((item) => [item.counter.toUpperCase(), item])
  );

  const blinkingCounters = useBlinkOnChange(dataMap, 3000, "clientNumber");

  return (
    <div className="flex w-full h-screen overflow-x-clip">
      {divisionStructure.map((division) => (
        <div
          key={division.title}
          className="flex-1 min-w-[300px] flex flex-col border-r-[2px] border-[#A0A0A0]"
        >
          {/* Header */}
          <Typography
            component="div"
            sx={{
              py: 2,
              fontSize: { sm: "10px", md: "16px", xl: "20px" },
              fontWeight: "bold",
              bgcolor: "#0038A8",
              color: "white",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "95px",
            }}
          >
            {division.title}
          </Typography>

          {/* Counters Grid */}
          <div className="grid grid-rows-4  flex-row h-[80vh]">
            {division.items.map((counter, index) => {
              const item = counter ? dataMap.get(counter.toUpperCase()) : null;
              const isBlinking = counter
                ? blinkingCounters[counter.toUpperCase()]
                : false;

              return (
                <div
                  key={counter || index}
                  className="flex justify-between items-center border-b-[2px] border-[#A0A0A0] bg-white"
                  style={{ minHeight: "40px", minWidth: "100px" }}
                >
                  <span className="font-bold text-[0.5rem] md:text-[1rem] xl:text-[1.3rem] bg-[#D9D9D9] h-full flex-1 flex items-center justify-center">
                    {counter || "\u00A0"}
                  </span>
                  <span
                    className={`text-[1rem] xl:text-[3.5rem] font-extrabold h-full flex-1 flex items-center justify-center ${
                      isBlinking ? "blinking-text" : ""
                    }`}
                  >
                    {item?.clientNumber || "\u00A0"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QueueCounters;
