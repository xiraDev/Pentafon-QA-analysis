// import { isEmpty } from 'lodash';
import { getMonthStartAndEnd, getFirstAndLastDayOfMonth } from 'src/utils/format-time-xira';

// utils
import axios from '../utils/axios';
// redux
import {
  hasError,
  add2Charts,
  setLoading,
  ahtHasError,
  clearCharts,
  setAHTChart,
  clearAHTChart,
  setAHTLoading,
} from '../redux/slices/analytics';

// ----------------------------------------------------------------------

export const getCountAndMinutes = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearCharts());

    const promises = [];
    for (let i = 0; i <= 2; i += 1) {
      const { startOfFirstDay, endOfLastDay, month } = getMonthStartAndEnd(i);

      const promise = axios
        .get('/api/v1/attempts/minutes', {
          params: {
            startDate: startOfFirstDay,
            endDate: endOfLastDay,
          },
        })
        .then((response) => {
          const body = response.data;
          if (body.status.toString() === 'success') {
            dispatch(add2Charts({ count: body.meta.count, duration: body.meta.duration, month }));
          }
        });

      promises.push(promise);
    }

    await Promise.all(promises);
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(hasError(error));
    console.log(error);
  }
};

export const getAHT = (date, setCurrentSeries, name0) => async (dispatch) => {
  try {
    dispatch(clearAHTChart());
    dispatch(setAHTLoading(true));

    const { firstDay, lastDay } = getFirstAndLastDayOfMonth(date);

    const response = await axios.get('/api/v1/attempts/aht', {
      params: {
        startDate: firstDay,
        endDate: lastDay,
      },
    });

    const body = response.data;
    if (body.status.toString() === 'success') {
      dispatch(setAHTChart(body.meta));

      const data = [
        {
          name: name0,
          type: 'column',
          data: [],
        },
        {
          name: 'AHT',
          type: 'line',
          data: [],
        },
      ];

      body.meta.forEach((el) => {
        data[0].data.push(el.answered);
        data[1].data.push(el.aht);
      });

      setCurrentSeries(data);
    }
    dispatch(setAHTLoading(false));
  } catch (error) {
    dispatch(setAHTLoading(false));
    console.log(error);
    dispatch(ahtHasError(error));
  }
};
