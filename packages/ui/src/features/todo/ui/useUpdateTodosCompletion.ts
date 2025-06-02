import { useCallback } from 'react';
import { TodoReference, useBatchUpdateTodosMutation } from 'src/entities/todo';

export default function () {
  const [batchUpdateTodos] = useBatchUpdateTodosMutation({
    fixedCacheKey: 'batchUpdateTodos',
  });

  /**
   * @returns updated todos
   */
  const updateTodosCompletion = useCallback(
    async (refs: TodoReference[], completed: boolean) => {
      const updateTodos = refs.map((ref) => ({
        data: {
          id: ref.id,
          payload: {
            completed,
          },
        },
        meta: {
          originListId: ref.listId,
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
