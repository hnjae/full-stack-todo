import { PlusOutlined } from '@ant-design/icons';
import { Card, Input } from 'antd';
import { useMemo, useState } from 'react';
import { useGetTodosFromListQuery } from 'src/entities/todo';
import { useHandleAddingTodo } from 'src/features/todo';

export default function TodoContent({
  selectedTodoListId,
}: {
  selectedTodoListId: string;
}) {
  const { data: todos } = useGetTodosFromListQuery(selectedTodoListId);
  const handleAddingTodo = useHandleAddingTodo(selectedTodoListId);

  const todoCard = useMemo(
    () =>
      todos?.map((todo) => (
        <div className="m-2" key={todo.id}>
          <Card className="h-fit" variant="borderless">
            {todo.title}
          </Card>
        </div>
      )),
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
