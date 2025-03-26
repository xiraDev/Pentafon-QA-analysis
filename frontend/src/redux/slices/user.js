import { createSlice } from '@reduxjs/toolkit';

import axios from 'src/utils/axios';

// eslint-disable-next-line import/no-cycle
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  users: [],
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET USERS
    getUsersSuccess(state, action) {
      state.isLoading = false;
      state.users = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
// export const {
//   // actions here
// } = slice.actions;

// ----------------------------------------------------------------------

export function getUsers() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/users');
      dispatch(slice.actions.getUsersSuccess(response.data.meta));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function toggleUserStatus(userId) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/api/v1/users/${userId}`);
      dispatch(slice.actions.updateUserSuccess(response.data)); // Despacha la acción de éxito con los datos actualizados
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
