import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

export interface AuthState {
  accessToken: string | null;
}

const initialState: AuthState = {
  accessToken: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    clearAccessToken: (state) => {
      state.accessToken = null;
    },
  },
});

export const { setAccessToken, clearAccessToken } = authSlice.actions;
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
