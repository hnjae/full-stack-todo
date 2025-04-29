// NOTE: This page assumes that the user is logged in when loaded.

import { Layout, theme } from 'antd';
import { useState } from 'react';
import {
  DeleteTodoListModal,
  DeleteTodoListModalState,
  RenameTodoListModal,
  RenameTodoListModalState,
} from 'src/features/todo-list';
import { MainHeader } from 'src/widgets/header';

import TodoListSidebar from './TodoListSidebar';

const { Content } = Layout;

export default function WebAppPage() {
  const { token } = theme.useToken();

  const [selectedTodoListId, setSelectedTodoListId] = useState<string | null>(
    null,
  );

  const [renameTodoListModalState, setRenameTodoListModalState] =
    useState<RenameTodoListModalState>(null);
  const [deleteTodoListModalState, setDeleteTodoListModalState] =
    useState<DeleteTodoListModalState>(null);

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
            className="flex items-center justify-center pb-[20vh]"
            style={{
              background: `color-mix(in srgb, ${token.colorBgLayout}, black 2%)`,
            }}
          >
            {selectedTodoListId == null && (
              <div>
                No Todo list has been selected. Please choose a list from the
                left or create a new one.
              </div>
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
    </>
  );
}
