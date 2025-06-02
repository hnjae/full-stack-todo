import { useCallback } from 'react';
import {
  useAddTodoMutation,
  useBatchUpdateTodosMutation,
  useGetTodosFromListQuery,
} from 'src/entities/todo';
import { AddTodo } from 'src/entities/todo';
import { getNextOrderAndBalancedItems } from 'src/shared/lib';

export default function (todoListId: string) {
  const { data: todos } = useGetTodosFromListQuery(todoListId);

  const [addTodo] = useAddTodoMutation({
    fixedCacheKey: 'addTodo',
  });
  const [batchUpdateTodos] = useBatchUpdateTodosMutation({
    fixedCacheKey: 'batchUpdateTodos',
  });

  /**
   * @returns newly created todo
   */
  const handleAddingTodo = useCallback(
    async (partialTodo: Omit<AddTodo, 'order'>) => {
      const { balancedItems, order } = getNextOrderAndBalancedItems(todos);
      const updateTodos = balancedItems?.map((item) => ({
        data: {
          id: item.id,
          payload: {
            order: item.order,
          },
        },
        meta: {
          originListId: item.todoListId,
        },
      }));

      if (updateTodos != null && updateTodos.length !== 0) {
        console.log('Balancing todos');
        batchUpdateTodos(updateTodos);
      }

      const newTodo = await addTodo({
        ...partialTodo,
        order,
      }).unwrap();
      console.log('New todo added:', newTodo);

      return newTodo;
    },
    [todos, addTodo, batchUpdateTodos],
  );

  return handleAddingTodo;
}
