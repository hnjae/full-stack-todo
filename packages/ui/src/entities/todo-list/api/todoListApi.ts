import { userApi } from 'src/entities/user/@x/todo-list';

export interface TodoList {
  id: string;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type AddTodoList = Omit<TodoList, 'id' | 'createdAt' | 'updatedAt'>;

export interface UpdateTodoList {
  id: string;
  payload: Partial<AddTodoList>;
}

const TODO_LIST_TAG_TYPE = 'TodoList' as const;

const todoListApi = userApi
  .enhanceEndpoints({
    addTagTypes: [TODO_LIST_TAG_TYPE],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      // NOTE: the results is always sorted
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

      addTodoList: build.mutation<TodoList, AddTodoList>({
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

      batchUpdateTodoList: build.mutation<TodoList, UpdateTodoList[]>({
        query: (arg) => ({
          url: 'todo-lists',
          method: 'PATCH',
          body: arg,
        }),
        invalidatesTags: [
          {
            type: TODO_LIST_TAG_TYPE,
            id: 'LIST',
          },
        ],

        // optimistic update
        async onQueryStarted(updateTodoLists, { dispatch, queryFulfilled }) {
          const patchResult = dispatch(
            todoListApi.util.updateQueryData(
              'getTodoLists',
              undefined,
              (draft) => {
                // NOTE: the results must be sorted

                for (const updateTodoList of updateTodoLists) {
                  const { id, payload } = updateTodoList;

                  const index = draft.findIndex(
                    (todoList) => todoList.id === id,
                  );

                  if (index === -1) {
                    continue;
                  }

                  const todoList = draft[index];
                  const patch = {
                    ...todoList,
                    ...payload,
                  };

                  draft[index] = patch;
                }

                draft.sort((a, b) => a.order - b.order);
              },
            ),
          );

          try {
            await queryFulfilled; // Wait for the actual server request to complete
          } catch (error) {
            patchResult.undo();
            console.error('Failed to update todo-list(s): ', error);
          }
        },
      }),

      deleteTodoList: build.mutation<TodoList, string>({
        query: (todoListId) => ({
          url: `todo-lists/${todoListId}`,
          method: 'DELETE',
        }),
        invalidatesTags: [
          {
            type: TODO_LIST_TAG_TYPE,
            id: 'LIST',
          },
        ],

        async onQueryStarted(id, { dispatch, queryFulfilled }) {
          const patchResult = dispatch(
            todoListApi.util.updateQueryData(
              'getTodoLists',
              undefined,
              (draft) => {
                // NOTE: the results must be sorted

                return draft.filter((todoList) => todoList.id !== id);
              },
            ),
          );

          try {
            await queryFulfilled; // Wait for the actual server request to complete
          } catch (error) {
            patchResult.undo();
            console.error('Failed to delete a todo-list: ', error);
          }
        },
      }),
    }),
  });

export const {
  useAddTodoListMutation,
  useBatchUpdateTodoListMutation,
  useDeleteTodoListMutation,
  useGetTodoListsQuery,
} = todoListApi;

export default todoListApi;
