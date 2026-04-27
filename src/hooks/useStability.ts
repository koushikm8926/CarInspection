import { useState, useEffect } from 'react';
import { Accelerometer } from 'expo-sensors';

export const useStability = (threshold = 0.05) => {
  const [isStable, setIsStable] = useState(true);
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    let subscription: any;

    const subscribe = () => {
      subscription = Accelerometer.addListener(accelerometerData => {
        setData(accelerometerData);
        
        // Calculate the magnitude of the movement
        const movement = Math.sqrt(
          Math.pow(accelerometerData.x - data.x, 2) +
          Math.pow(accelerometerData.y - data.y, 2) +
          Math.pow(accelerometerData.z - data.z, 2)
        );

        // Update stability state
        setIsStable(movement < threshold);
      });
      
      // Update at 10Hz (100ms) for responsiveness without battery drain
      Accelerometer.setUpdateInterval(100);
    };

    subscribe();

    return () => {
      if (subscription) subscription.remove();
    };
  }, [data, threshold]);

  return { isStable, data };
};
