"use client";
import { Typography } from "@mui/material";
import { divisionStructure } from "../types";
import { useQueueDisplay } from "@/hooks/useQueueDisplay";
import { useBlinkOnChange } from "@/hooks/useBlinkOnChange";
import '../../../../styles/globals.css';

const QueueCounters = () => {
  const { data, isLoading } = useQueueDisplay();
 
  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading counters...</div>;
  }
 
  // Create a map for easy lookup by counter name
  const dataMap = new Map();
  
  // Add window items to the map
  if (data?.windowItems) {
    data.windowItems.forEach(item => {
      dataMap.set(item.counter.toUpperCase(), item);
    });
  }
  
  // Add cashier item if exists
  if (data?.cashierItem) {
    dataMap.set(data.cashierItem.counter.toUpperCase(), data.cashierItem);
  }
  
  // Monitor for changes to trigger blinking effect
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
          <div className="grid grid-rows-4 flex-row h-[80vh]">
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
                    className={`text-[1rem] xl:text-[2.5rem] font-extrabold h-full flex-1 flex items-center justify-center ${
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