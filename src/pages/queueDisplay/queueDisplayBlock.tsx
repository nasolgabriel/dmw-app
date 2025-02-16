"use client";

import React, { useState, useEffect } from "react";
import QueueDisplay from "./queueDisplay";

const QueueDisplayBlock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  if (!hasMounted) return null;

  return (
    <>
      <QueueDisplay
        toLocaleTimeString={currentTime.toLocaleTimeString()}
        toLocaleDateString={currentTime.toDateString()}
      />
    </>
  );
};

export default QueueDisplayBlock;
