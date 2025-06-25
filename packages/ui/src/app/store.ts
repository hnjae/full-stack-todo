import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { userApi } from 'src/entities/user';
import { authReducer } from 'src/shared/auth';

const rootReducers = combineReducers({
  auth: authReducer,
  userApi: userApi.reducer,
});

export const store = configureStore({
  reducer: rootReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
