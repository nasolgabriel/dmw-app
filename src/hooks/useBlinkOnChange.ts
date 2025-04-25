import { useState, useEffect, useRef } from 'react';

export const useBlinkOnChange = (
  dataMap: Map<string, any>,
  blinkDuration: number = 3000,
  valueKey: string = 'clientNumber'
) => {
  const [blinkingItems, setBlinkingItems] = useState<Record<string, boolean>>({});
  const prevDataRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    const newBlinkingItems: Record<string, boolean> = {};
    
    // Check for changes in the data
    dataMap.forEach((value, key) => {
      const prevValue = prevDataRef.current.get(key);
      
      // If the value is different, start blinking
      if (prevValue && JSON.stringify(prevValue[valueKey]) !== JSON.stringify(value[valueKey])) {
        newBlinkingItems[key] = true;
        
        // Set a timeout to stop blinking after the duration
        setTimeout(() => {
          setBlinkingItems(prev => {
            const updated = { ...prev };
            delete updated[key];
            return updated;
          });
        }, blinkDuration);
      }
    });
    
    // Update the blinking state
    if (Object.keys(newBlinkingItems).length > 0) {
      setBlinkingItems(prev => ({ ...prev, ...newBlinkingItems }));
    }
    
    // Update the reference to the current data
    prevDataRef.current = new Map(dataMap);
  }, [dataMap, blinkDuration, valueKey]);
  
  return blinkingItems;
};