import { createAsyncThunk } from '@reduxjs/toolkit';
import { getTokens, refreshTokenService } from 'src/shared/lib';
import { setAccessToken } from 'src/shared/model';
import { clearAccessToken } from 'src/shared/model';

export const login = createAsyncThunk(
  'auth/login',
  async (formParams: URLSearchParams, { dispatch }) => {
    const { accessToken, refreshToken } = await getTokens(formParams);
    refreshTokenService.set(refreshToken);
    dispatch(setAccessToken(accessToken));
    console.log('Successfully obtained access/refresh tokens.');
  },
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_: void, { dispatch }) => {
    refreshTokenService.remove();
    dispatch(clearAccessToken());
    console.log('Successfully removed access/refresh tokens.');
  },
);
