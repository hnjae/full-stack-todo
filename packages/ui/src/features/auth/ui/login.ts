import { useCallback } from 'react';
import { getTokens, refreshTokenService } from 'src/shared/lib';
import { setAccessToken, useAppDispatch } from 'src/shared/model';

export default function () {
  const dispatch = useAppDispatch();

  const login = useCallback(
    async (formParams: URLSearchParams) => {
      const { accessToken, refreshToken } = await getTokens(formParams);
      refreshTokenService.set(refreshToken);
      dispatch(setAccessToken(accessToken));
    },
    [dispatch],
  );

  return login;
}
