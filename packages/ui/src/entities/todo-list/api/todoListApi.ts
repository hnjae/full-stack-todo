import { userApi } from 'src/entities/user/@x/todo-list';

export interface TodoList {
  id: string;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const todoListApi = userApi.injectEndpoints({
  endpoints: (build) => ({
    getTodoLists: build.query<TodoList[], void>({
      query: () => 'todo-lists',
    }),
  }),
});

export const { useGetTodoListsQuery } = todoListApi;

export default todoListApi;
