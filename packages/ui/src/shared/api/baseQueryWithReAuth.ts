import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { login, logout } from 'src/shared/auth';
import { env } from 'src/shared/config';
import { AuthenticationError, refreshTokenService } from 'src/shared/lib';

const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: `${env.API_URL}`,
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as RootState).auth.accessToken;

    if (accessToken != null) {
      headers.set('authorization', `Bearer ${accessToken}`);
    }

    return headers;
  },
});

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs, // Args
  unknown, // Result
  FetchBaseQueryError // Error
> = async (args, api, extraOptions) => {
  let result = await baseQueryWithAuth(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    try {
      const refreshTokenOld = refreshTokenService.get();

      if (refreshTokenOld == null) {
        throw new Error('No refresh token was found.');
      }

      const formParams = new URLSearchParams();
      formParams.append('grant_type', 'refresh_token');
      formParams.append('refresh_token', refreshTokenOld);

      api.dispatch(login(formParams));

      // retry the initial query
      result = await baseQueryWithAuth(args, api, extraOptions);
    } catch (error) {
      const msgFailedReason =
        error instanceof AuthenticationError
          ? error.message
          : `An unexpected error occurred: ${error}`;
      const msg = `Failed to renew the access token. ${msgFailedReason}`;

      console.error(msg);
      api.dispatch(logout());
    }
  } else if (result.error) {
    console.error('Error: ', result.error);
  }

  return result;
};

export default baseQueryWithReAuth;
