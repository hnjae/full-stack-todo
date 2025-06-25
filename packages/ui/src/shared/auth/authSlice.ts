import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

export interface AuthState {
  accessToken: string | null;
  initialized: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  initialized: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.initialized = true;
    },
    setAuthInitialized: (state) => {
      state.initialized = true;
    },
    clearAccessToken: (state) => {
      state.accessToken = null;
    },
  },
});

export const { setAccessToken, setAuthInitialized, clearAccessToken } =
  authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectUserId = createSelector(
  (state: RootState) => state.auth.accessToken,

  (token) => {
    if (!token) {
      return null;
    }

    const decoded = jwtDecode(token);
    return decoded.sub;
  },
);

export const selectAuthInitialized = createSelector(
  (state: RootState) => state.auth.initialized,
  (initialized) => initialized,
);
