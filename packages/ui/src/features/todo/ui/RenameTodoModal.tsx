import type { InputRef } from 'antd'; // Add this import
import { Input, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Todo, useBatchUpdateTodosMutation } from 'src/entities/todo';

export type ModalState = Todo | null;

export default function RenameTodoModal({
  modalState,
  setModalState,
}: {
  modalState: ModalState;
  setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
}) {
  const [batchUpdateTodos] = useBatchUpdateTodosMutation({
    fixedCacheKey: 'batchUpdateTodos',
  });

  const inputRef = useRef<InputRef>(null);

  const [inputModalValue, setInputModalValue] = useState('');

  useEffect(() => {
    if (modalState == null) {
      setInputModalValue('');
      return;
    }

    setInputModalValue(modalState.title);

    // HACK: Wait for the modal to open before focusing
    setTimeout(() => {
      inputRef?.current?.focus();
    }, 10);
  }, [modalState]);

  const handleRename = () => {
    if (inputModalValue === '' || modalState?.id == null) {
      return;
    }

    batchUpdateTodos([
      {
        data: {
          id: modalState.id,
          payload: {
            title: inputModalValue,
          },
        },
        meta: {
          originListId: modalState.todoListId,
        },
      },
    ]);

    setInputModalValue('');
    setModalState(null);
  };

  return (
    <Modal
      title="Rename todo:"
      open={modalState != null}
      onOk={handleRename}
      onCancel={() => {
        setModalState(null);
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
