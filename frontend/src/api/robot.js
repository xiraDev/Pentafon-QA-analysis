// utilities
import createAxiosInstance from '../utils/axios-client.utility';

// ----------------------------------------------------------------------

const apiRobot = createAxiosInstance(import.meta.env.VITE_ROBOT_HOST);

// ----------------------------------------------------------------------

export const onSendCustomers = async (data) => {
  try {
    const response = await apiRobot.put('api/v1/customers/by-file/csv', data);
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};
