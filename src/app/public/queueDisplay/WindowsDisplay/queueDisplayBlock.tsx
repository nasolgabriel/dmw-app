"use client";
import { useQueueDisplay } from "@/hooks/useQueueDisplay";
import QueueDisplay from "./queueDisplay";
import { CircularProgress } from "@mui/material";

export const QueueDisplayBlock = () => {
    const { data, isLoading, error } = useQueueDisplay();
   
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><CircularProgress /></div>;
    }
   
    if (error) {
        return <div className="text-red-500">Error loading queue data</div>;
    }
   
    return (
        <QueueDisplay
            cashierData={data?.cashierItem}
            queueData={data?.queueItem}
        />
    );
};

export default QueueDisplayBlock;