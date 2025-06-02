import { useCallback } from 'react';
import {
  TodoList,
  UpdateTodoList,
  useBatchUpdateTodoListsMutation,
  useGetTodoListsQuery,
} from 'src/entities/todo-list';
import { MAX_INTEGER, MIN_INTEGER } from 'src/shared/config';
import { balanceItems, ORDER_SPACING } from 'src/shared/lib';

const calcUpdateTodoList = function ({
  todoLists,
  dropPosIdx,
  dragListPosIdx,
  dragListKey,
}: {
  todoLists: TodoList[] | undefined;
  dropPosIdx: number;
  dragListPosIdx: number;
  dragListKey: React.Key;
}): UpdateTodoList[] {
  if (todoLists == null || todoLists.length === 0) {
    return [];
  }

  if (dragListPosIdx === dropPosIdx) {
    return [];
  }

  if (todoLists.length === 1) {
    return [];
  }

  // Drop at first
  if (dropPosIdx === 0) {
    let newOrder;

    let updateTodoLists: UpdateTodoList[];
    if (todoLists[0].order >= MIN_INTEGER + ORDER_SPACING) {
      updateTodoLists = [];
      newOrder = todoLists[0].order - ORDER_SPACING;
    } else {
      console.log('Balancing todo-lists');
      const balancedLists = balanceItems(todoLists);

      updateTodoLists = balancedLists
        .filter((todoList) => todoList.id !== dragListKey)
        .map((todoList) => ({
          id: todoList.id,
          payload: {
            order: todoList.order,
          },
        }));

      newOrder = balancedLists[0].order - ORDER_SPACING;
    }

    updateTodoLists.push({
      id: dragListKey as string,
      payload: {
        order: newOrder,
      },
    });

    return updateTodoLists;
  }

  // Drop at the end
  if (dropPosIdx === todoLists.length) {
    let newOrder;

    let updateTodoLists: UpdateTodoList[];

    if (todoLists[todoLists.length - 1].order <= MAX_INTEGER - ORDER_SPACING) {
      updateTodoLists = [];
      newOrder = todoLists[todoLists.length - 1].order + ORDER_SPACING;
    } else {
      console.log('Balancing todo-lists');
      const balancedLists = balanceItems(todoLists);

      updateTodoLists = balancedLists
        .filter((todoList) => todoList.id !== dragListKey)
        .map((todoList) => ({
          id: todoList.id,
          payload: {
            order: todoList.order,
          },
        }));

      newOrder = balancedLists[balancedLists.length - 1].order - ORDER_SPACING;
    }

    updateTodoLists.push({
      id: dragListKey as string,
      payload: {
        order: newOrder,
      },
    });

    return updateTodoLists;
  }

  // Drop in the middle
  let before = todoLists[dropPosIdx - 1].order;
  let after = todoLists[dropPosIdx].order;

  let updateTodoLists: UpdateTodoList[] = [];
  if (after - before > 1) {
    updateTodoLists = [];
  } else {
    console.log('Balancing todo-lists');
    const balancedLists = balanceItems(todoLists);

    updateTodoLists = balancedLists
      .filter((todoList) => todoList.id !== dragListKey)
      .map((todoList) => ({
        id: todoList.id,
        payload: {
          order: todoList.order,
        },
      }));

    before = balancedLists[dropPosIdx - 1].order;
    after = balancedLists[dropPosIdx].order;
  }

  const newOrder = Math.floor((after - before) / 2) + before;
  updateTodoLists.push({
    id: dragListKey as string,
    payload: {
      order: newOrder,
    },
  });

  return updateTodoLists;
};

export default function () {
  const { data: todoLists } = useGetTodoListsQuery();

  const [batchUpdateTodoLists] = useBatchUpdateTodoListsMutation({
    fixedCacheKey: 'batchUpdateTodoLists',
  });

  const reorderTodoList = useCallback(
    ({
      dropPosIdx,
      dragListPosIdx,
      dragListKey,
    }: {
      dropPosIdx: number;
      dragListPosIdx: number;
      dragListKey: React.Key;
    }) => {
      const updateTodoLists = calcUpdateTodoList({
        todoLists,
        dropPosIdx,
        dragListPosIdx,
        dragListKey,
      });

      if (updateTodoLists.length !== 0) {
        batchUpdateTodoLists(updateTodoLists);
      }

      return;
    },
    [todoLists, batchUpdateTodoLists],
  );

  return reorderTodoList;
}
