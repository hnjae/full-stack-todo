import { useCallback } from 'react';
import { clearAccessToken, useAppDispatch } from 'src/shared/model';

export default function () {
  const dispatch = useAppDispatch();

  const logout = useCallback(async () => {
    dispatch(clearAccessToken());
  }, [dispatch]);

  return logout;
}
