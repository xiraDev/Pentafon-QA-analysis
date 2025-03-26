import merge from 'lodash/merge';
import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

import { Box, Card, CardHeader } from '@mui/material';

import BaseOptionChart from './Chart';

const TopAgentsBarChart = ({ conversations }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const agentScores = {};

    conversations.forEach(({ agentName, obtainedGrade }) => {
      const [score] = obtainedGrade.split('/').map(Number);
      const grade = (score / 100) * 100;

      if (!agentScores[agentName]) {
        agentScores[agentName] = { score: 0, count: 0 };
      }

      agentScores[agentName].score += grade;
      agentScores[agentName].count += 1;
    });

    const agents = Object.entries(agentScores)
      .map(([agentName, { score, count }]) => ({
        agentName,
        averageGrade: (score / count).toFixed(2),
      }))
      .sort((a, b) => b.averageGrade - a.averageGrade);

    setChartData(agents);
  }, [conversations]);

  // Aplicamos estilos de BaseOptionChart
  const chartOptions = merge(BaseOptionChart(), {
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: 'rounded',
        columnWidth: '50%',
      },
    },
    xaxis: {
      categories: chartData.map((item) => item.agentName),
      title: { text: 'Agente' },
    },
    yaxis: {
      title: { text: 'Promedio de Calificación' },
    },
  });

  return (
    <Card>
      <CardHeader title="Top Agentes Mejor Calificados" />
      <Box sx={{ mt: 3, mx: 3 }} dir="ltr">
        <ReactApexChart
          type="bar"
          series={[{ name: 'Promedio de Calificación', data: chartData.map((item) => parseFloat(item.averageGrade)) }]}
          options={chartOptions}
          height={350}
        />
      </Box>
    </Card>
  );
};

export default TopAgentsBarChart;
