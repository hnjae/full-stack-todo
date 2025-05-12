const MIN_SPIN_TIME = 500;

import { useEffect, useState } from 'react';
import { useAppSelector } from 'src/shared/model';

export default function () {
  const isPending = useAppSelector(({ userApi }) => {
    return (
      Object.values(userApi.queries).some(
        (query) => query?.status === 'pending',
      ) ||
      Object.values(userApi.queries).some(
        (mutation) => mutation?.status === 'pending',
      )
    );
  });

  const [rotateSpinner, setRotateSpinner] = useState(isPending);

  // Rotate spinner {MIN_SPIN_TIME}ms more loading
  useEffect(() => {
    let timeoutId: number | null = null;

    if (isPending) {
      setRotateSpinner(true);
    } else if (rotateSpinner) {
      timeoutId = setTimeout(() => {
        setRotateSpinner(false);
      }, MIN_SPIN_TIME);
    }

    return () => {
      if (timeoutId != null) {
        clearTimeout(timeoutId);
      }
    };
  }, [isPending, rotateSpinner]);

  return rotateSpinner;
}
