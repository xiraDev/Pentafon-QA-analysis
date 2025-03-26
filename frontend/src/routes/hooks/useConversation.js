import { useState, useEffect } from 'react';

import axios from 'src/utils/axios';

const useConversations = () => {
  const [data, setData] = useState([]);
  const [mustUpdate, setMustUpdate] = useState(true)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axios.get('/api/v1/conversations/extended?from=2024-12-01%2000:00:00');
        const response = await axios.get('/api/v1/analysis/');
        setData(response.data.meta);
      } catch (err) {
        setError('Error loading data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [mustUpdate]);

  return { data, isLoading, error, mustUpdate, setMustUpdate };
};

export default useConversations;
