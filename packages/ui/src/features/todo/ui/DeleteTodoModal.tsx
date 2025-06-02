import { Modal } from 'antd';
import { Todo, useDeleteTodoMutation } from 'src/entities/todo';

export type ModalState = Todo | null;

export default function DeleteTodoModal({
  modalState,
  setModalState,
}: {
  modalState: ModalState;
  setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
}) {
  const [deleteTodo] = useDeleteTodoMutation({
    fixedCacheKey: 'deleteTodo',
  });

  return (
    <Modal
      title={'Delete todo?'}
      open={modalState != null}
      onOk={() => {
        if (modalState != null) {
          console.log('Deleting todo with ID:', modalState.id);
          deleteTodo({ id: modalState.id, listId: modalState.todoListId });
        }

        setModalState(null);
      }}
      onCancel={() => {
        setModalState(null);
      }}
    >
      {modalState != null && (
        <p>
          <b>"{modalState.title}"</b> will be permanently deleted.
        </p>
      )}
    </Modal>
  );
}
