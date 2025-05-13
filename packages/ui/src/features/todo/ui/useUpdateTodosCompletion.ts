import { useCallback } from 'react';
import {
  useBatchUpdateTodosMutation,
  useGetTodosFromListQuery,
} from 'src/entities/todo';

export default function (todoListId: string) {
  const [batchUpdateTodos] = useBatchUpdateTodosMutation({
    fixedCacheKey: 'batchUpdateTodos',
  });

  /**
   * @returns updated todos
   */
  const updateTodosCompletion = useCallback(
    async (ids: string[], completed: boolean) => {
      const updateTodos = ids.map((id) => ({
        data: {
          id: id,
          payload: {
            completed,
          },
        },
        meta: {
          originListId: todoListId,
        },
      }));

      if (updateTodos.length === 0) {
        return [];
      }

      return batchUpdateTodos(updateTodos);
    },
    [batchUpdateTodos],
  );

  return updateTodosCompletion;
}
