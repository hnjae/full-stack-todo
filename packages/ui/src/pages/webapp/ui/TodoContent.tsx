import { PlusOutlined } from '@ant-design/icons';
import { Card, Input, Layout, theme } from 'antd';

const { Content } = Layout;

export default function TodoContent({
  selectedTodoListId,
}: {
  selectedTodoListId: string | null;
}) {
  const { token } = theme.useToken();
  const card = (
    <div className="m-2">
      <Card className="h-fit" variant="borderless">
        Card content
      </Card>
    </div>
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
            className="mb-2"
          />
          <div className="overflow-y-auto">
            {card}
            {card}
            {card}
            {card}
            {card}
          </div>
        </>
      )}
    </Content>
  );
}
