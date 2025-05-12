import { PlusOutlined } from '@ant-design/icons';
import { Card, Input, Layout, theme } from 'antd';
import { useMemo } from 'react';
import { useGetTodosFromListQuery } from 'src/entities/todo';

const { Content } = Layout;

export default function TodoContent({
  selectedTodoListId,
}: {
  selectedTodoListId: string | null;
}) {
  const { token } = theme.useToken();

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
    <Content
      className="flex flex-col p-4"
      style={{
        background: `color-mix(in srgb, ${token.colorBgLayout}, black 2%)`,
      }}
    >
      {selectedTodoListId == null ? (
        <div className="flex justify-center items-center h-full">
          No Todo list has been selected. Please choose a list from the left or
          create a new one.
        </div>
      ) : (
        <>
          <Input
            addonBefore={<PlusOutlined />}
            size="large"
            placeholder="New Todo"
            className="mb-2 pl-2 pr-2"
          />
          <div className="overflow-y-auto">{todoCard}</div>
        </>
      )}
    </Content>
  );
}
