import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { env } from 'src/shared/config';
import { refreshTokenService } from 'src/shared/lib';
import { clearAccessToken, setAccessToken } from 'src/shared/model';

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

      const formData = new URLSearchParams();
      formData.append('grant_type', 'refresh_token');
      formData.append('refresh_token', refreshTokenOld);

      const response = await fetch(`${env.API_URL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      let responseBody;
      try {
        responseBody = await response.json();
      } catch (parseError) {
        throw new Error('The API server returned an invalid response format.');
      }

      if (!response.ok) {
        if (!['basic', 'cors'].includes(response.type)) {
          const msg = 'The API server did not respond properly.';
          throw new Error(msg);
        }

        if (response.status === 400 && responseBody.error === 'invalid_grant') {
          const msg = responseBody.error_description ?? 'Invalid refresh token';
          throw new Error(msg);
        }

        const msg =
          responseBody.error_description ??
          'The API server denied issuing an access token.';
        throw new Error(msg);
      }

      const { access_token: accessToken, refresh_token: refreshTokenNew } =
        responseBody;

      if (accessToken == null || refreshTokenNew == null) {
        throw new Error(
          'The API server did not provide the required token(s).',
        );
      }

      refreshTokenService.set(refreshTokenNew);
      api.dispatch(setAccessToken(accessToken));

      // retry the initial query
      result = await baseQueryWithAuth(args, api, extraOptions);
    } catch (error) {
      const msgFailedReason =
        error instanceof Error
          ? error.message
          : `An unexpected error occurred: ${error}`;
      const msg = `Failed to renew the access token. ${msgFailedReason}`;

      console.error(msg);
      refreshTokenService.remove();
      api.dispatch(clearAccessToken());
    }
  }

  return result;
};

export default baseQueryWithReAuth;
