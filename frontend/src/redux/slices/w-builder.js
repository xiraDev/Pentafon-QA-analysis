import omit from 'lodash/omit';
import { createSlice } from '@reduxjs/toolkit';

import axios from 'src/utils/axios';

import { W_BUILDER_BOARD } from 'src/_mock';

// eslint-disable-next-line import/no-cycle
import { dispatch } from '../store';

// ----------------------------------------------------------------------

function objFromArray(array, key = 'id') {
  return array.reduce((accumulator, current) => {
    accumulator[current[key]] = current;
    return accumulator;
  }, {});
}

const initialState = {
  isLoading: false,
  error: null,
  board: {
    cards: {},
    columns: {},
    columnOrder: [],
  },
};

const slice = createSlice({
  name: 'w-builder',
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

    // GET BOARD
    getBoardSuccess(state, action) {
      state.isLoading = false;
      const board = action.payload;
      const cards = objFromArray(board.cards);
      const columns = objFromArray(board.columns);
      const { columnOrder } = board;
      state.board = {
        cards,
        columns,
        columnOrder,
      };
    },

    persistCard(state, action) {
      const columns = action.payload;
      state.board.columns = columns;
    },

    persistColumn(state, action) {
      state.board.columnOrder = action.payload;
    },

    addTask(state, action) {
      const { card, columnId } = action.payload;

      state.board.cards[card.id] = card;
      state.board.columns[columnId].cardIds.push(card.id);
    },

    deleteTask(state, action) {
      const { cardId, columnId } = action.payload;

      state.board.columns[columnId].cardIds = state.board.columns[columnId].cardIds.filter((id) => id !== cardId);
      state.board.cards = omit(state.board.cards, [cardId]);
    },

    // UPDATE COLUMN
    updateColumnSuccess(state, action) {
      const column = action.payload;

      state.isLoading = false;
      state.board.columns[column.id] = column;
    },
  },
});

// Reducer
export default slice.reducer;

export const { actions } = slice;

// ----------------------------------------------------------------------

export function getBoard() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
      dispatch(slice.actions.getBoardSuccess(W_BUILDER_BOARD));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateColumn(columnId, modifyColumn) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/kanban/columns/update', {
        columnId,
        updateColumn: modifyColumn,
      });
      dispatch(slice.actions.updateColumnSuccess(response.data.column));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function persistColumn(newColumnOrder) {
  return () => {
    dispatch(slice.actions.persistColumn(newColumnOrder));
  };
}

// ----------------------------------------------------------------------

export function persistCard(columns) {
  return () => {
    dispatch(slice.actions.persistCard(columns));
  };
}

// ----------------------------------------------------------------------

export function addTask({ card, columnId }) {
  return () => {
    dispatch(slice.actions.addTask({ card, columnId }));
  };
}

// ----------------------------------------------------------------------

export function deleteTask({ cardId, columnId }) {
  return () => {
    dispatch(slice.actions.deleteTask({ cardId, columnId }));
  };
}
