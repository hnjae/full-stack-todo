import { useCallback } from 'react';
import { refreshTokenService } from 'src/shared/lib';
import { clearAccessToken, useAppDispatch } from 'src/shared/model';

export default function () {
  const dispatch = useAppDispatch();

  const logout = useCallback(async () => {
    refreshTokenService.remove();
    dispatch(clearAccessToken());
  }, [dispatch]);

  return logout;
}
