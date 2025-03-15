import { useState, useRef, useEffect } from "react";

export function useBlinkOnChange(
  dataMap: Map<string, any>,
  blinkDuration: number,
  propertyToTrack = "clientNumber"
): Record<string, boolean> {
  const [blinkingItems, setBlinkingItems] = useState<Record<string, boolean>>(
    {}
  );
  const prevDataMapRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    const newBlinkingItems: Record<string, boolean> = {};
    let hasChanges = false;

    dataMap.forEach((item, key) => {
      const prevItem = prevDataMapRef.current.get(key);
      if (prevItem && prevItem[propertyToTrack] !== item[propertyToTrack]) {
        newBlinkingItems[key] = true;
        hasChanges = true;

        // Stop blinking after specified duration
        setTimeout(() => {
          setBlinkingItems((prev) => ({
            ...prev,
            [key]: false,
          }));
        }, blinkDuration);
      }
    });

    if (hasChanges) {
      setBlinkingItems((prev) => ({ ...prev, ...newBlinkingItems }));
    }

    // Update previous data reference
    prevDataMapRef.current = new Map(dataMap);
  }, [dataMap, blinkDuration, propertyToTrack]);

  return blinkingItems;
}
