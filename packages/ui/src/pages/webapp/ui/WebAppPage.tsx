// NOTE: This page assumes that the user is logged in when loaded.

import { move } from '@dnd-kit/helpers';
import { DragDropProvider } from '@dnd-kit/react';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { Layout, theme } from 'antd';
import { useEffect, useState } from 'react';
import { TodoReference, useGetTodosFromListQuery } from 'src/entities/todo';
import { useGetTodoListsQuery } from 'src/entities/todo-list';
import {
  DeleteTodoModal,
  DeleteTodoModalState,
  RenameTodoModal,
  RenameTodoModalState,
  useReorderTodos,
  useUpdateTodosList,
} from 'src/features/todo';
import {
  DeleteTodoListModal,
  DeleteTodoListModalState,
  RenameTodoListModal,
  RenameTodoListModalState,
} from 'src/features/todo-list';
import { MainHeader } from 'src/widgets/header';

import TodoListSidebar from './TodoListSidebar';
import TodoListView from './TodoListView';

const { Content } = Layout;

export default function WebAppPage() {
  const [selectedTodoListId, setSelectedTodoListId] = useState<string | null>(
    null,
  );

  const { data: todos } = useGetTodosFromListQuery(
    selectedTodoListId ?? skipToken,
  );
  const { data: todoLists } = useGetTodoListsQuery();

  const updateTodosList = useUpdateTodosList();
  const reorderTodos = useReorderTodos();

  const [renameTodoListModalState, setRenameTodoListModalState] =
    useState<RenameTodoListModalState>(null);
  const [deleteTodoListModalState, setDeleteTodoListModalState] =
    useState<DeleteTodoListModalState>(null);
  const [deleteTodoModalState, setDeleteTodoModalState] =
    useState<DeleteTodoModalState>(null);
  const [renameTodoModalState, setRenameTodoModalState] =
    useState<RenameTodoModalState>(null);

  const { token } = theme.useToken();

  useEffect(() => {
    if (
      selectedTodoListId != null ||
      todoLists == null ||
      todoLists.length === 0
    ) {
      return;
    }

    setSelectedTodoListId(todoLists[0].id);
  }, [todoLists, selectedTodoListId]);

  return (
    <>
      <Layout className="h-dvh">
        <MainHeader />
        <Layout>
          <DragDropProvider
            onDragEnd={(event) => {
              const { source, target, canceled } = event.operation;

              if (canceled || source == null || target == null) {
                return;
              }

              if (target.type === 'list') {
                if (source.data.listId === target.id) {
                  return;
                }

                updateTodosList(
                  [source.data as TodoReference],
                  target.id as string,
                );
              }

              if (target.type === 'card') {
                if (todos == null) {
                  console.log('THIS SHOULD NOT HAPPEN');
                  return;
                }

                // @ts-expect-error `event` is valid type for `move`
                // (both defined in dnd-kit)
                const newTodos = move(todos, event);
                reorderTodos(newTodos);
              }
            }}
          >
            <TodoListSidebar
              selectedTodoListId={selectedTodoListId}
              setSelectedTodoListId={setSelectedTodoListId}
              setRenameTodoListModalState={setRenameTodoListModalState}
              setDeleteTodoListModalState={setDeleteTodoListModalState}
            />
            <Content
              className="flex flex-col p-4"
              style={{
                background: `color-mix(in srgb, ${token.colorBgLayout}, black 2%)`,
              }}
            >
              {selectedTodoListId == null ? (
                <div className="flex justify-center items-center h-full">
                  No Todo list has been selected. Please choose a list from the
                  left or create a new one.
                </div>
              ) : (
                <TodoListView
                  selectedTodoListId={selectedTodoListId}
                  setDeleteTodoModalState={setDeleteTodoModalState}
                  setRenameTodoModalState={setRenameTodoModalState}
                />
              )}
            </Content>
          </DragDropProvider>
        </Layout>
      </Layout>
      <DeleteTodoListModal
        modalState={deleteTodoListModalState}
        setModalState={setDeleteTodoListModalState}
      />
      <RenameTodoListModal
        modalState={renameTodoListModalState}
        setModalState={setRenameTodoListModalState}
      />
      <DeleteTodoModal
        modalState={deleteTodoModalState}
        setModalState={setDeleteTodoModalState}
      />
      <RenameTodoModal
        modalState={renameTodoModalState}
        setModalState={setRenameTodoModalState}
      />
    </>
  );
}
