import { useCallback } from 'react';
import { useBatchUpdateTodosMutation } from 'src/entities/todo';

export interface TodoReference {
  id: string;
  listId: string;
}

export default function () {
  const [batchUpdateTodos] = useBatchUpdateTodosMutation({
    fixedCacheKey: 'batchUpdateTodos',
  });

  /**
   * @returns updated todos
   */
  const updateTodosList = useCallback(
    async (refs: TodoReference[], newListId: string) => {
      const updateTodos = refs.map((ref) => ({
        data: {
          id: ref.id,
          payload: {
            todoListId: newListId,
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

  return updateTodosList;
}
