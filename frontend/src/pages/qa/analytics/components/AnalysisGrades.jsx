// Librerías
import dayjs from 'dayjs';
import merge from 'lodash/merge';
import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

import { Box, Card, MenuItem, TextField, CardHeader } from '@mui/material';

import BaseOptionChart from './Chart';

const FilteredAverageChart = ({ conversations }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    // contact_action_id: '',
    // typification: '',
    prompt: '',
    agentName: '',
    // voice: '',
    startDate: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
  });
  const [filterOptions, setFilterOptions] = useState({
    contact_action_id: [],
    typification: [],
    agentName: [],
    prompt: [],
    voice: [],
  });

  const t = (option) => {
    const optionDictionary = {
      agentName: 'Nombre de agente',
      contact_action_id: 'ID acción de contacto',
      endDate: 'Fecha fin',
      prompt: 'Evaluación',
      startDate: 'Fecha inicio',
      typification: 'Tipificación',
      voice: 'Voz',
    };
    return optionDictionary[option];
  };

  useEffect(() => {
    const groupedData = {};

    conversations.forEach(({ createdAt, obtainedGrade, ...rest }) => {
      const date = dayjs(createdAt).format('YYYY-MM-DD');
      const grade = parseFloat(obtainedGrade.split('/')[0]);

      if (
        // (!filters.contact_action_id || rest.contact_action_id === filters.contact_action_id) &&
        // (!filters.typification || rest.typification === filters.typification) &&
        (!filters.agentName || rest.agentName === filters.agentName) &&
        (!filters.evaluationPromptName || rest.evaluationPromptName === filters.evaluationPromptName) &&
        (!filters.voice || rest.voice === filters.voice) &&
        date >= filters.startDate &&
        date <= filters.endDate
      ) {
        if (!groupedData[date]) groupedData[date] = { sum: 0, count: 0 };
        groupedData[date].sum += grade;
        groupedData[date].count += 1;
      }
    });

    const processedData = Object.keys(groupedData).map((date) => ({
      date,
      average: groupedData[date].sum / groupedData[date].count,
    }));

    setFilteredData(processedData);
  }, [conversations, filters]);

  useEffect(() => {
    let filteredConversations = conversations;
  
    if (filters.prompt) {
      filteredConversations = conversations.filter(
        (c) => c.evaluationPromptName === filters.prompt
      );
    }
  
    const options = {
      agentName: [...new Set(filteredConversations.map((c) => c.agentName))],
      prompt: [...new Set(conversations.map((c) => c.evaluationPromptName))],
    };
  
    setFilterOptions(options);
  }, [conversations, filters.prompt]);

  const chartOptions = merge(BaseOptionChart(), {
    xaxis: { categories: filteredData.map((item) => item.date).sort() },
    yaxis: { title: { text: 'Promedio de Calificación' } },
  });

  return (
    <Card>
      <CardHeader title="Promedio de Calificación por Día" />
      <Box sx={{ display: 'flex', gap: 2, padding: 2 }}>
        {Object.keys(filters).map((key) => (
          <TextField
            key={key}
            select={key !== 'startDate' && key !== 'endDate'}
            type={key === 'startDate' || key === 'endDate' ? 'date' : 'text'}
            label={t(key)}
            value={filters[key]}
            onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
            fullWidth
          >
            <MenuItem value="">Todos</MenuItem>
            {filterOptions[key] &&
              filterOptions[key].map((option) => (
                <MenuItem key={`${option}-${Math.random()}`} value={option}>
                  {option}
                </MenuItem>
              ))}
          </TextField>
        ))}
      </Box>
      <Box sx={{ mt: 3, mx: 3 }} dir="ltr">
        <ReactApexChart
          type="line"
          series={[{ name: 'Promedio', data: filteredData.map((item) => item.average && item.average.toFixed(2)) }]}
          options={chartOptions}
          height={364}
        />
      </Box>
    </Card>
  );
};

export default FilteredAverageChart;
