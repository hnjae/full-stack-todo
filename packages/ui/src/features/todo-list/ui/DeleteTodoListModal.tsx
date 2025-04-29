import { Modal } from 'antd';
import { TodoList, useDeleteTodoListMutation } from 'src/entities/todo-list';

export type ModalState = TodoList | null;

export default function DeleteTodoListModal({
  modalState,
  setModalState,
}: {
  modalState: ModalState;
  setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
}) {
  const [deleteTodoList] = useDeleteTodoListMutation({
    fixedCacheKey: 'deleteTodoList',
  });

  return (
    <Modal
      title={'Delete todo list?'}
      open={modalState != null}
      onOk={() => {
        if (modalState != null) {
          console.log('Deleting todo list with ID:', modalState.id);
          deleteTodoList(modalState.id);
        }

        setModalState(null);
      }}
      onCancel={() => {
        setModalState(null);
      }}
    >
      {modalState != null && (
        <p>
          <b>"{modalState.name}"</b> will be permanently deleted.
        </p>
      )}
    </Modal>
  );
}
