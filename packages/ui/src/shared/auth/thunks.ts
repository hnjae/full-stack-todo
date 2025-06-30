import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  AuthenticationError,
  getTokens,
  refreshTokenService,
} from 'src/shared/lib';

import {
  clearAccessToken,
  selectAuthInitialized,
  setAccessToken,
  setAuthInitialized,
} from './authSlice';

export const login = createAsyncThunk(
  'auth/login',
  async (formParams: URLSearchParams, { dispatch }) => {
    try {
      const { accessToken, refreshToken } = await getTokens(formParams);
      refreshTokenService.set(refreshToken);

      dispatch(setAccessToken(accessToken));
      console.log('Successfully obtained access/refresh tokens.');
    } catch (error) {
      if (error instanceof AuthenticationError) {
        console.log('Failed to obtain access/refresh token:', error);
        dispatch(setAuthInitialized());
      }

      throw error;
    }
  },
);

export const initializeAuth = createAsyncThunk<
  void,
  void,
  { state: RootState }
>('auth/initialize', async (_, { dispatch, getState }) => {
  const isAuthInitialized = selectAuthInitialized(getState());
  if (isAuthInitialized) {
    return;
  }

  const refreshToken = refreshTokenService.get();
  if (refreshToken == null) {
    dispatch(setAuthInitialized());
    return;
  }

  const formParams = new URLSearchParams();
  formParams.append('grant_type', 'refresh_token');
  formParams.append('refresh_token', refreshToken);
  dispatch(login(formParams));
});

export const logout = createAsyncThunk(
  'auth/logout',
  async (_: void, { dispatch }) => {
    refreshTokenService.remove();
    dispatch(clearAccessToken());
    console.log('Successfully removed access/refresh tokens.');
  },
);
