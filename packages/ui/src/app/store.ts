import { combineReducers, configureStore, Middleware } from '@reduxjs/toolkit';
import { userApi } from 'src/entities/user';
import { authReducer, logout } from 'src/shared/auth';

const rootReducer = combineReducers({
  auth: authReducer,
  userApi: userApi.reducer,
});

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const resetApiOnLogout: Middleware<{}, RootState> =
  (storeApi) => (next) => (action) => {
    const result = next(action);

    if (logout.fulfilled.match(action)) {
      storeApi.dispatch(userApi.util.resetApiState());
      console.log('RTQ Query API state reset due to logout action.');
    }

    return result;
  };

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware).concat(resetApiOnLogout),
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof rootReducer>; // This resolves the circular type reference between the middleware and store definitions.
export type AppDispatch = AppStore['dispatch'];
