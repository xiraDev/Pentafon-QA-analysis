import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  durationChart: {
    months: [],
    data: [],
  },
  countChart: {
    months: [],
    data: [],
  },
  ahtChart: {
    isLoading: false,
    labels: [],
    error: null,
  },
};

const slice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    // SET LOADING
    setLoading(state, action) {
      state.isLoading = action.payload;
    },

    setAHTLoading(state, action) {
      state.ahtChart.isLoading = action.payload;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    ahtHasError(state, action) {
      state.ahtChart.isLoading = false;
      state.ahtChart.error = action.payload;
    },

    // CHART
    add2Charts(state, action) {
      const { count, duration, month } = action.payload;

      state.durationChart.data = [duration, ...state.durationChart.data];
      state.durationChart.months = [month, ...state.durationChart.months];

      state.countChart.data.push(count);
      state.countChart.months.push(month);
    },

    clearCharts(state) {
      state.durationChart = initialState.durationChart;
      state.countChart = initialState.countChart;
    },

    clearAHTChart(state) {
      state.ahtChart = initialState.ahtChart;
    },

    setAHTChart(state, action) {
      const data = action.payload;

      data.forEach((el) => {
        state.ahtChart.labels.push(el.date);
      });
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { setLoading, add2Charts, hasError, clearCharts, setAHTLoading, setAHTChart, ahtHasError, clearAHTChart } =
  slice.actions;
