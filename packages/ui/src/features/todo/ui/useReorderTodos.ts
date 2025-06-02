import { useCallback } from 'react';
import { useBatchUpdateTodosMutation } from 'src/entities/todo';
import { Todo } from 'src/entities/todo';
import { balanceItems } from 'src/shared/lib';

export default function () {
  const [batchUpdateTodos] = useBatchUpdateTodosMutation({
    fixedCacheKey: 'batchUpdateTodos',
  });

  /**
   * Updates `src` after `dst` in the list
   *
   * @param newTodos - Newly sorted todos with outdated `order` property
   * @returns updated todos
   */
  const reorderTodos = useCallback(
    async (newTodos: Todo[]) => {
      if (newTodos.length <= 1) {
        return newTodos;
      }

      // NOTE: Longest Increasing Subsequence 알고리즘을 사용하며, 업데이트할 최소 분의 todo 를 계산할 수도 있을 것 같음.
      // https://leetcode.com/problems/longest-increasing-subsequence/description/

      const balancedTodos = balanceItems(newTodos);
      return batchUpdateTodos(
        balancedTodos.map((todo) => ({
          data: {
            id: todo.id,
            payload: {
              order: todo.order,
            },
          },
          meta: {
            originListId: todo.todoListId,
          },
        })),
      );
    },
    [batchUpdateTodos],
  );

  return reorderTodos;
}
