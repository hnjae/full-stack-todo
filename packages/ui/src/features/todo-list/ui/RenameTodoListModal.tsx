import { Input, Modal } from 'antd';
import { useState } from 'react';
import {
  generateUniqueName,
  TodoList,
  useBatchUpdateTodoListsMutation,
  useGetTodoListsQuery,
} from 'src/entities/todo-list';

export type ModalState = TodoList | null;

export default function RenameTodoListModal({
  modalState,
  setModalState,
}: {
  modalState: ModalState;
  setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
}) {
  const { data: todoLists } = useGetTodoListsQuery();

  const [batchUpdateTodoList] = useBatchUpdateTodoListsMutation({
    fixedCacheKey: 'batchUpdateTodoList',
  });

  const [inputModalValue, setInputModalValue] = useState('');

  const handleRename = () => {
    if (inputModalValue === '' || modalState?.id == null) {
      return;
    }

    batchUpdateTodoList([
      {
        id: modalState.id,
        payload: {
          name: generateUniqueName(inputModalValue, todoLists ?? []),
        },
      },
    ]);

    setModalState(null);
  };

  return (
    <Modal
      title="Rename todo list:"
      open={modalState != null}
      onOk={handleRename}
      onCancel={() => {
        setModalState(null);
      }}
    >
      <Input
        placeholder="New name"
        autoFocus
        value={inputModalValue}
        onChange={(event) => {
          setInputModalValue(event.target.value);
        }}
        onPressEnter={handleRename}
      />
    </Modal>
  );
}
