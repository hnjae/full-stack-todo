import { useEffect } from 'react';
import { clearToken } from 'src/entities/auth';
import { useAppDispatch } from 'src/shared/lib/hook';

export default function LogoutPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearToken());
  }, []);

  // This should not be displayed to the user
  return <div>Logging Out</div>;
}
