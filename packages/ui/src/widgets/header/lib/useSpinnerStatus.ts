const MIN_SPIN_TIME = 500;

import { useEffect, useMemo, useState } from 'react';
import {
  useAddTodoListMutation,
  useBatchUpdateTodoListsMutation,
  useDeleteTodoListMutation,
  useGetTodoListsQuery,
} from 'src/entities/todo-list';

export default function () {
  const {
    isLoading: isGetTodoListsLoading,
    isFetching: isGetTodoListsFetching,
  } = useGetTodoListsQuery();
  const [, { isLoading: isAddTodoListLoading }] = useAddTodoListMutation({
    fixedCacheKey: 'addTodoList',
  });
  const [, { isLoading: isDeleteTodoListLoading }] = useDeleteTodoListMutation({
    fixedCacheKey: 'deleteTodoList',
  });
  const [, { isLoading: isBatchUpdateTodoListLoading }] =
    useBatchUpdateTodoListsMutation({
      fixedCacheKey: 'batchUpdateTodoList',
    });
  const isLoading = useMemo(
    () =>
      isGetTodoListsLoading ||
      isGetTodoListsFetching ||
      isAddTodoListLoading ||
      isDeleteTodoListLoading ||
      isBatchUpdateTodoListLoading,
    [
      isGetTodoListsLoading,
      isGetTodoListsFetching,
      isAddTodoListLoading,
      isDeleteTodoListLoading,
      isBatchUpdateTodoListLoading,
    ],
  );

  const [rotateSpinner, setRotateSpinner] = useState(isLoading);

  // Rotate spinner {MIN_SPIN_TIME}ms more loading
  useEffect(() => {
    let timeoutId: number | null = null;

    if (isLoading) {
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
  }, [isLoading, rotateSpinner]);

  return rotateSpinner;
}
