import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// slices
// eslint-disable-next-line import/no-cycle
import userReducer from './slices/user';
import wBuilderReducer from './slices/w-builder';
import analyticsReducer from './slices/analytics';
import fileManagerReducer from './slices/file-manager';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const usserPersistConfig = {
  key: 'user',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['users'],
};

const rootReducer = combineReducers({
  analytics: analyticsReducer,

  fileManager: fileManagerReducer,
  user: persistReducer(usserPersistConfig, userReducer),
  wBuilder: wBuilderReducer,
});

export { rootReducer, rootPersistConfig };
