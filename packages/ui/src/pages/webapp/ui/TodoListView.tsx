import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Card,
  Checkbox,
  ConfigProvider,
  Dropdown,
  Input,
  MenuProps,
  theme,
} from 'antd';
import { useState } from 'react';
import { Todo, useGetTodosFromListQuery } from 'src/entities/todo';
import {
  DeleteTodoModalState,
  RenameTodoModalState,
  useHandleAddingTodo,
  useUpdateTodosCompletion,
} from 'src/features/todo';

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

interface TodoCardProps {
  todo: Todo;
  listId: string;
  setRenameTodoModalState: SetState<RenameTodoModalState>;
  setDeleteTodoModalState: SetState<DeleteTodoModalState>;
}

const TodoCard = function ({
  todo,
  listId,
  setRenameTodoModalState,
  setDeleteTodoModalState,
}: TodoCardProps) {
  const { token } = theme.useToken();
  const updateTodosCompletion = useUpdateTodosCompletion(listId);

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
    <div className="m-2">
      <Dropdown menu={{ items: menuItems }} trigger={['contextMenu']}>
        <Card className="h-fit" variant="borderless">
          <div className={`flex items-center gap-x-2`}>
            <ConfigProvider
              theme={{
                components: {
                  Checkbox: {
                    colorPrimary: todo.completed
                      ? token.colorTextDisabled
                      : token.colorPrimary,
                  },
                },
              }}
            >
              <Checkbox
                checked={todo.completed}
                onChange={(e) => {
                  updateTodosCompletion([todo.id], e.target.checked);
                }}
              />
            </ConfigProvider>
            <div
              className={`grow w-0 text-ellipsis whitespace-nowrap overflow-hidden ${todo.completed ? 'line-through' : ''}`}
              style={{
                color: todo.completed
                  ? token.colorTextDisabled
                  : token.colorText,
              }}
            >
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
};

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

  const [inputValue, setInputValue] = useState('');

  const handleInputPressEnter = async function (
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
        onPressEnter={handleInputPressEnter}
        onChange={(event) => setInputValue(event.target.value)}
      />
      <div className="h-full overflow-y-auto">
        {todos?.map((todo) => (
          <TodoCard
            key={todo.id}
            todo={todo}
            listId={selectedTodoListId}
            setRenameTodoModalState={setRenameTodoModalState}
            setDeleteTodoModalState={setDeleteTodoModalState}
          />
        ))}
      </div>
    </>
  );
}
