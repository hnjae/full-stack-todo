import { useCallback } from 'react';
import {
  AddTodoList,
  generateUniqueName,
  TodoList,
  UpdateTodoList,
  useAddTodoListMutation,
  useBatchUpdateTodoListsMutation,
  useGetTodoListsQuery,
} from 'src/entities/todo-list';
import { MAX_INTEGER } from 'src/shared/config';
import { balanceItems, ORDER_SPACING } from 'src/shared/lib';

const calc = function ({
  todoLists,
  proposedName,
}: {
  todoLists: TodoList[] | undefined;
  proposedName: string;
}): [UpdateTodoList[], AddTodoList] {
  let order = 0;
  let name = proposedName;

  if (todoLists == null || todoLists.length === 0) {
    return [
      [],
      {
        name: name,
        order: order,
      },
    ];
  }

  const lastOrder = todoLists[todoLists.length - 1].order;
  name = generateUniqueName(proposedName, todoLists);

  if (lastOrder > MAX_INTEGER - ORDER_SPACING) {
    console.log('Balancing todo-lists');

    const balancedLists = balanceItems(todoLists);

    const updateTodoLists = balancedLists.map((todoList) => ({
      id: todoList.id,
      payload: {
        order: todoList.order,
      },
    }));

    order = balancedLists[balancedLists.length - 1].order;

    return [
      updateTodoLists,
      {
        name: name,
        order: order,
      },
    ];
  }

  order = lastOrder + ORDER_SPACING;

  return [
    [],
    {
      name: name,
      order: order,
    },
  ];
};

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
      const [updateTodoLists, newTodoList] = calc({ todoLists, proposedName });

      if (updateTodoLists.length !== 0) {
        batchUpdateTodoList(updateTodoLists);
      }

      const newList = await addTodoList(newTodoList).unwrap();
      console.log('New todo list added:', newTodoList);

      return newList;
    },
    [todoLists, batchUpdateTodoList, addTodoList],
  );

  return handleNewTodoList;
}
