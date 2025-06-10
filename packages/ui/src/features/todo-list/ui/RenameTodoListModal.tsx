import { Input, InputRef, Modal } from 'antd';
import { useRef, useState } from 'react';
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

  const [batchUpdateTodoLists] = useBatchUpdateTodoListsMutation({
    fixedCacheKey: 'batchUpdateTodoLists',
  });

  const inputRef = useRef<InputRef>(null);
  const [inputModalValue, setInputModalValue] = useState('');

  const handleRename = () => {
    if (inputModalValue === '' || modalState?.id == null) {
      return;
    }

    batchUpdateTodoLists([
      {
        id: modalState.id,
        payload: {
          name: generateUniqueName(inputModalValue, todoLists ?? []),
        },
      },
    ]);

    setInputModalValue('');
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
      afterOpenChange={() => {
        inputRef.current?.focus();
      }}
    >
      <Input
        placeholder="New name"
        ref={inputRef}
        value={inputModalValue}
        onChange={(event) => {
          setInputModalValue(event.target.value);
        }}
        onPressEnter={handleRename}
      />
    </Modal>
  );
}
