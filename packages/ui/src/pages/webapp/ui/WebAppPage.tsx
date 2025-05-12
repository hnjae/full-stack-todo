// NOTE: This page assumes that the user is logged in when loaded.

import { Layout } from 'antd';
import { useState } from 'react';
import {
  DeleteTodoListModal,
  DeleteTodoListModalState,
  RenameTodoListModal,
  RenameTodoListModalState,
} from 'src/features/todo-list';
import { MainHeader } from 'src/widgets/header';

import TodoContent from './TodoContent';
import TodoListSidebar from './TodoListSidebar';

export default function WebAppPage() {
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
          <TodoContent selectedTodoListId={selectedTodoListId} />
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
