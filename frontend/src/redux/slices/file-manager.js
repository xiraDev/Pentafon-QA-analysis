import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
};

const slice = createSlice({
  name: 'file-manager',
  initialState,
  reducers: {
    // SET LOADING
    setLoading(state, action) {
      state.isLoading = action.payload;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { setLoading } = slice.actions;
