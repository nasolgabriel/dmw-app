import { getQueueDisplay } from '@/api/authApi';
import { QueueDisplayData } from '@/types/queueDisplay';
import { useState, useEffect } from 'react';


export const useQueueData = () => {
  const [queueData, setQueueData] = useState<QueueDisplayData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQueueData = async () => {
      try {
        setLoading(true);
        const data = await getQueueDisplay();
        setQueueData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch queue data:', err);
        setError('Failed to fetch queue data');
      } finally {
        setLoading(false);
      }
    };

    fetchQueueData();

    // Set up polling to refresh data every 30 seconds
    const intervalId = setInterval(fetchQueueData, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return { queueData, loading, error };
};