import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useSortable } from '@dnd-kit/react/sortable';
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
import {
  Todo,
  TodoReference,
  useGetTodosFromListQuery,
} from 'src/entities/todo';
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
  index: number;
  setRenameTodoModalState: SetState<RenameTodoModalState>;
  setDeleteTodoModalState: SetState<DeleteTodoModalState>;
}

const TodoCard = function ({
  todo,
  index,
  listId,
  setRenameTodoModalState,
  setDeleteTodoModalState,
}: TodoCardProps) {
  const { token } = theme.useToken();
  const updateTodosCompletion = useUpdateTodosCompletion();

  const { ref, isDragging } = useSortable<TodoReference>({
    id: todo.id,
    index: index,
    data: {
      id: todo.id,
      listId: todo.todoListId,
    },
    type: 'card',
    disabled: todo.completed,
  });

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'rename') setRenameTodoModalState(todo);
    if (key === 'delete') setDeleteTodoModalState(todo);
  };

  const menuItems: MenuProps['items'] = [
    {
      icon: <EditOutlined />,
      label: 'Rename',
      key: 'rename',
    },
    {
      icon: <DeleteOutlined />,
      label: 'Delete',
      key: 'delete',
      danger: true,
    },
  ];

  return (
    <Dropdown
      menu={{ items: menuItems, onClick: handleMenuClick }}
      trigger={['contextMenu']}
    >
      <div ref={ref} className="m-2">
        <ConfigProvider
          theme={{
            token: {
              fontSize: 15,
            },
            components: {
              Card: {
                bodyPadding: 14,
              },
              Checkbox: {
                colorPrimary: todo.completed
                  ? token.colorTextDisabled
                  : token.colorPrimary,
              },
            },
          }}
        >
          <Card
            className={`h-fit ${isDragging ? 'opacity-60' : ''}`}
            variant="borderless"
          >
            <div className={`flex items-center gap-x-2`}>
              <Checkbox
                checked={todo.completed}
                onChange={(e) => {
                  updateTodosCompletion(
                    [{ id: todo.id, listId }],
                    e.target.checked,
                  );
                }}
              />
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
              <Dropdown
                menu={{ items: menuItems, onClick: handleMenuClick }}
                trigger={['click']}
              >
                <button
                  className="shrink-0 cursor-pointer"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <EllipsisOutlined
                    style={{
                      color: token.colorIcon,
                      verticalAlign: 'middle',
                    }}
                  />
                </button>
              </Dropdown>
            </div>
          </Card>
        </ConfigProvider>
      </div>
    </Dropdown>
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
        {todos
          ?.toSorted((a, b) => {
            if (a.completed === b.completed) {
              return a.order - b.order;
            }

            return a.completed ? 1 : -1;
          })
          ?.map((todo, index) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              index={index}
              listId={selectedTodoListId}
              setRenameTodoModalState={setRenameTodoModalState}
              setDeleteTodoModalState={setDeleteTodoModalState}
            />
          ))}
      </div>
    </>
  );
}
