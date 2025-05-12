import { Layout, theme } from 'antd';
const { Content } = Layout;

export default function TodoContent({
  selectedTodoListId,
}: {
  selectedTodoListId: string | null;
}) {
  const { token } = theme.useToken();

  return (
    <Content
      className="flex items-center justify-center pb-[20vh]"
      style={{
        background: `color-mix(in srgb, ${token.colorBgLayout}, black 2%)`,
      }}
    >
      {selectedTodoListId == null && (
        <div>
          No Todo list has been selected. Please choose a list from the left or
          create a new one.
        </div>
      )}
    </Content>
  );
}
