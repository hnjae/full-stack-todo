// NOTE: This page assumes that the user is logged in when loaded.

import { DragDropProvider } from '@dnd-kit/react';
import { Layout, theme } from 'antd';
import { useState } from 'react';
import {
  DeleteTodoModal,
  DeleteTodoModalState,
  RenameTodoModal,
  RenameTodoModalState,
  TodoReference,
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

  const updateTodosList = useUpdateTodosList();
  const [renameTodoListModalState, setRenameTodoListModalState] =
    useState<RenameTodoListModalState>(null);
  const [deleteTodoListModalState, setDeleteTodoListModalState] =
    useState<DeleteTodoListModalState>(null);
  const [deleteTodoModalState, setDeleteTodoModalState] =
    useState<DeleteTodoModalState>(null);
  const [renameTodoModalState, setRenameTodoModalState] =
    useState<RenameTodoModalState>(null);

  const { token } = theme.useToken();

  return (
    <>
      <Layout className="h-dvh">
        <MainHeader />
        <Layout>
          <DragDropProvider
            onDragEnd={(event) => {
              if (event.canceled) return;

              const { source, target } = event.operation;
              if (target?.id == null || source?.data == null) {
                return;
              }

              if (source.data.listId === target.id) {
                return;
              }

              updateTodosList(
                [source.data as TodoReference],
                target.id as string,
              );
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
