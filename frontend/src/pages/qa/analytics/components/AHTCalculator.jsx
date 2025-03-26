import { useState, useEffect } from 'react';

import { Box, Card, CardHeader, Typography } from '@mui/material';


const AHTCalculator = ({ conversations }) => {
  const [averageAHT, setAverageAHT] = useState(0);

  useEffect(() => {
    if (conversations.length === 0) return;

    const totalDuration = conversations.reduce((acc, conv) => acc + parseFloat(conv.duration), 0);
    const avgDuration = totalDuration / conversations.length;

    setAverageAHT(avgDuration);
  }, [conversations]);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Card>
      <CardHeader title="Promedio de Duración de las Llamadas (AHT)" /> 
      <Box sx={{ padding: 2 }}>
        <Typography variant="h2" sx={{textAlign: "center", fontWeight: 700, color: "#00469b"}}>{formatDuration(averageAHT)}</Typography>
      </Box>
    </Card>
  );
};

export default AHTCalculator;
