import { userApi } from 'src/entities/user/@x/todo-list';

export interface TodoList {
  id: string;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const TODO_LIST_TAG_TYPE = 'TodoList' as const;

const todoListApi = userApi
  .enhanceEndpoints({
    addTagTypes: [TODO_LIST_TAG_TYPE],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getTodoLists: build.query<TodoList[], void>({
        query: () => 'todo-lists',
        providesTags: (result) =>
          result
            ? [
                ...result.map(({ id }) => ({ type: TODO_LIST_TAG_TYPE, id })),
                {
                  type: TODO_LIST_TAG_TYPE,
                  id: 'LIST',
                },
              ]
            : [
                {
                  type: TODO_LIST_TAG_TYPE,
                  id: 'LIST',
                },
              ],
      }),

      addTodoList: build.mutation<
        TodoList,
        Omit<TodoList, 'id' | 'createdAt' | 'updatedAt'>
      >({
        query: (newTodoList) => ({
          url: 'todo-lists',
          method: 'POST',
          body: newTodoList,
        }),
        invalidatesTags: [
          {
            type: TODO_LIST_TAG_TYPE,
            id: 'LIST',
          },
        ],
      }),
    }),
  });

export const { useGetTodoListsQuery, useAddTodoListMutation } = todoListApi;

export default todoListApi;
