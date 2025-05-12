import { PlusOutlined } from '@ant-design/icons';
import { Card, Input } from 'antd';
import { useMemo } from 'react';
import { useGetTodosFromListQuery } from 'src/entities/todo';

export default function TodoContent({
  selectedTodoListId,
}: {
  selectedTodoListId: string;
}) {
  const { data: todos } = useGetTodosFromListQuery(
    selectedTodoListId ?? 'dummy-id',
    {
      skip: selectedTodoListId == null,
    },
  );

  const todoCard = useMemo(
    () =>
      todos?.map((todo) => (
        <div className="m-2">
          <Card className="h-fit" variant="borderless">
            {todo.title}
          </Card>
        </div>
      )),
    [todos],
  );

  return (
    <>
      <Input
        addonBefore={<PlusOutlined />}
        size="large"
        placeholder="New Todo"
        className="mb-2 pl-2 pr-2"
      />
      <div className="overflow-y-auto">{todoCard}</div>
    </>
  );
}
