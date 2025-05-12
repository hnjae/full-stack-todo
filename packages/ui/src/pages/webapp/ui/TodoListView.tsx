import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Card, Dropdown, Input, MenuProps, theme } from 'antd';
import { useMemo, useState } from 'react';
import { Todo, useGetTodosFromListQuery } from 'src/entities/todo';
import {
  DeleteTodoModalState,
  RenameTodoModalState,
  useHandleAddingTodo,
} from 'src/features/todo';

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export default function TodoContent({
  selectedTodoListId,
  setDeleteTodoModalState,
  setRenameTodoModalState,
}: {
  selectedTodoListId: string;
  setDeleteTodoModalState: SetState<DeleteTodoModalState>;
  setRenameTodoModalState: SetState<RenameTodoModalState>;
}) {
  const { data: todos } = useGetTodosFromListQuery(selectedTodoListId);
  const handleAddingTodo = useHandleAddingTodo(selectedTodoListId);

  const { token } = theme.useToken();

  const todoCard = useMemo(
    () =>
      todos?.map((todo) => {
        const menuItems: MenuProps['items'] = [
          {
            icon: <EditOutlined />,
            label: 'Rename',
            key: 'rename',
            onClick: () => {
              setRenameTodoModalState(todo);
            },
          },
          {
            icon: <DeleteOutlined />,
            label: 'Delete',
            key: 'delete',
            danger: true,
            onClick: () => {
              setDeleteTodoModalState(todo);
            },
          },
        ];
        return (
          <div className="m-2" key={todo.id}>
            <Dropdown menu={{ items: menuItems }} trigger={['contextMenu']}>
              <Card className="h-fit" variant="borderless">
                <div className="flex gap-x-2">
                  <div className="grow-1 w-0 text-ellipsis whitespace-nowrap overflow-hidden block">
                    {todo.title}
                  </div>

                  <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                    <div className="shrink-0">
                      <a onClick={(e) => e.preventDefault()}>
                        <EllipsisOutlined
                          style={{
                            color: token.colorIcon,
                            verticalAlign: 'middle',
                          }}
                        />
                      </a>
                    </div>
                  </Dropdown>
                </div>
              </Card>
            </Dropdown>
          </div>
        );
      }),
    [todos],
  );

  const [inputValue, setInputValue] = useState('');

  const handleEnter = async function (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    const todoTitle = event.currentTarget.value.trim();
    if (todoTitle === '') {
      return;
    }

    await handleAddingTodo({
      title: todoTitle,
      completed: false,
      todoListId: selectedTodoListId,
      description: null,
      dueDate: null,
    });

    setInputValue('');
  };
  return (
    <>
      <Input
        addonBefore={<PlusOutlined />}
        size="large"
        placeholder="New Todo"
        className="mb-2 pl-2 pr-2"
        value={inputValue}
        onPressEnter={handleEnter}
        onChange={(event) => setInputValue(event.target.value)}
      />
      <div className="overflow-y-auto">{todoCard}</div>
    </>
  );
}
