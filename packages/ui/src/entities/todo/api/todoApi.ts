/*
  NOTE:
    - todoListId 와 todoId 는 모두 UUID 이며, 여기서 둘의 충돌은 가정하지 않음.
*/

import { userApi } from 'src/entities/user/@x/todo';

export interface Todo {
  id: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  completed: boolean;
  todoListId: string;
}

export interface TodoReference {
  id: string;
  listId: string;
}

export type AddTodo = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>;

interface UpdateTodo {
  id: string;
  payload: Partial<AddTodo>;
}

export interface UpdateTodoWithMeta {
  data: UpdateTodo;
  meta: {
    originListId: string; // Todo 가 원래 속해 있던 todoList 의 Id
  };
}

const TODO_TAG_TYPE = 'Todo' as const;

const todoApi = userApi
  .enhanceEndpoints({
    addTagTypes: [TODO_TAG_TYPE],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getTodosFromList: build.query<Todo[], string>({
        query: (todoListId) => {
          if (todoListId === '') {
            throw new Error('todoListId must not be empty');
          }

          return {
            url: `todos?todoListId=${todoListId}`,
            method: 'GET',
          };
        },
        providesTags: (result, _, todoListId) =>
          result != null
            ? [
                ...result.map(({ id }) => ({ type: TODO_TAG_TYPE, id })),
                {
                  type: TODO_TAG_TYPE,
                  id: todoListId,
                },
              ]
            : [
                {
                  type: TODO_TAG_TYPE,
                  id: todoListId,
                },
              ],
      }),

      addTodo: build.mutation<Todo, AddTodo>({
        query: (newTodo) => ({
          url: 'todos',
          method: 'POST',
          body: newTodo,
        }),
        invalidatesTags: (result) =>
          result != null
            ? [
                {
                  type: TODO_TAG_TYPE,
                  id: result.id,
                },
                {
                  type: TODO_TAG_TYPE,
                  id: result.todoListId,
                },
              ]
            : [],
      }),

      batchUpdateTodos: build.mutation<Todo[], UpdateTodoWithMeta[]>({
        query: (args) => ({
          url: 'todos',
          method: 'PATCH',
          body: args.map(({ data }) => data),
        }),
        invalidatesTags: (result, _, args) => {
          if (result == null || result.length === 0) {
            return [];
          }

          const invalidatesIds = new Set<string>();
          for (const todo of result) {
            invalidatesIds.add(todo.id);
            invalidatesIds.add(todo.todoListId);
          }
          for (const { data, meta } of args) {
            invalidatesIds.add(data.id);
            invalidatesIds.add(meta.originListId);
          }

          return Array.from(invalidatesIds, (id) => ({
            type: TODO_TAG_TYPE,
            id: id,
          }));
        },

        // optimistic update
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          const listIds = new Set<string>(
            args.map(({ meta }) => meta.originListId),
          );

          const patchResults = Array.from(listIds, (listId) =>
            dispatch(
              todoApi.util.updateQueryData(
                'getTodosFromList',
                listId,
                (draft) => {
                  for (const { data } of args) {
                    const index = draft.findIndex(
                      (todo) => todo.id === data.id,
                    );

                    if (index === -1) {
                      continue;
                    }

                    draft[index] = {
                      ...draft[index],
                      ...data.payload,
                    };
                  }

                  draft.sort((a, b) => a.order - b.order);

                  return draft;
                },
              ),
            ),
          );

          try {
            await queryFulfilled;
          } catch (error) {
            patchResults.forEach((patchResult) => patchResult.undo());
            console.error('Failed to optimistic update todo(s): ', error);
          }
        },
      }),

      deleteTodo: build.mutation<Todo, { id: string; listId: string }>({
        query: (arg) => ({
          url: `todos/${arg.id}`,
          method: 'DELETE',
        }),

        invalidatesTags: (result) =>
          result != null
            ? [
                {
                  type: TODO_TAG_TYPE,
                  id: result.todoListId,
                },
              ]
            : [],

        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          const patchResult = dispatch(
            todoApi.util.updateQueryData(
              'getTodosFromList',
              arg.listId,
              (draft) => {
                return draft.filter((todo) => todo.id !== arg.id);
              },
            ),
          );

          try {
            await queryFulfilled; // Wait for the actual server request to complete
          } catch (error) {
            patchResult.undo();
            console.error('Failed to optimistic delete a todo: ', error);
          }
        },
      }),
    }),
  });

export const {
  useAddTodoMutation,
  useBatchUpdateTodosMutation,
  useDeleteTodoMutation,
  useGetTodosFromListQuery,
} = todoApi;

export default todoApi;
