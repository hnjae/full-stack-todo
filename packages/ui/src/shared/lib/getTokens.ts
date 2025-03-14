import { env } from 'src/shared/config';

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export const getTokens = async function (
  formParams: URLSearchParams,
): Promise<{ accessToken: string; refreshToken: string }> {
  const response = await fetch(`${env.API_URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formParams,
  });

  let responseBody;

  try {
    responseBody = await response.json();
  } catch (parseError) {
    throw new AuthenticationError(
      'The API server returned an invalid response format.',
    );
  }

  if (!response.ok) {
    if (!['basic', 'cors'].includes(response.type)) {
      const msg = 'The API server did not respond properly.';
      throw new AuthenticationError(msg);
    }

    if (response.status === 400 && responseBody.error === 'invalid_grant') {
      const msg = responseBody.error_description ?? 'Invalid grant';
      throw new AuthenticationError(msg);
    }

    const msg =
      responseBody.error_description ??
      'The API server denied issuing an access token.';
    throw new AuthenticationError(msg);
  }

  const { access_token: accessToken, refresh_token: refreshToken } =
    responseBody;

  if (accessToken == null || refreshToken == null) {
    throw new Error('The API server did not provide the required token(s).');
  }

  return { accessToken, refreshToken };
};

export default getTokens;
