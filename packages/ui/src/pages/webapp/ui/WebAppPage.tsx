// NOTE: This page assumes that the user is logged in when loaded.

import { Layout, theme } from 'antd';
import { useState } from 'react';
import { DeleteTodoModal, DeleteTodoModalState } from 'src/features/todo';
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

  const [renameTodoListModalState, setRenameTodoListModalState] =
    useState<RenameTodoListModalState>(null);
  const [deleteTodoListModalState, setDeleteTodoListModalState] =
    useState<DeleteTodoListModalState>(null);
  const [deleteTodoModalState, setDeleteTodoModalState] =
    useState<DeleteTodoModalState>(null);

  const { token } = theme.useToken();

  return (
    <>
      <Layout className="h-dvh">
        <MainHeader />
        <Layout>
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
              />
            )}
          </Content>
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
    </>
  );
}
