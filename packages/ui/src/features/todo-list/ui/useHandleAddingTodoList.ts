import { useCallback } from 'react';
import {
  generateUniqueName,
  useAddTodoListMutation,
  useBatchUpdateTodoListsMutation,
  useGetTodoListsQuery,
} from 'src/entities/todo-list';
import { getNextOrderAndBalancedItems } from 'src/shared/lib';

export default function () {
  const { data: todoLists } = useGetTodoListsQuery();

  const [batchUpdateTodoList] = useBatchUpdateTodoListsMutation({
    fixedCacheKey: 'batchUpdateTodoList',
  });

  const [addTodoList] = useAddTodoListMutation({
    fixedCacheKey: 'addTodoList',
  });

  /**
   * @returns newly created todo-list
   */
  const handleNewTodoList = useCallback(
    async (proposedName: string) => {
      const { balancedItems, order } = getNextOrderAndBalancedItems(todoLists);

      const updateTodoLists = balancedItems?.map((todoList) => ({
        id: todoList.id,
        payload: {
          order: todoList.order,
        },
      }));

      if (updateTodoLists != null && updateTodoLists.length !== 0) {
        console.log('Balancing todo-lists');
        batchUpdateTodoList(updateTodoLists);
      }

      const newTodoList = {
        name: generateUniqueName(proposedName, todoLists),
        order,
      };

      const newList = await addTodoList(newTodoList).unwrap();
      console.log('New todo list added:', newTodoList);

      return newList;
    },
    [todoLists, batchUpdateTodoList, addTodoList],
  );

  return handleNewTodoList;
}
