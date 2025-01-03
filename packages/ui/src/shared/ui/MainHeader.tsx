import { Layout, Menu, MenuProps } from 'antd';

const { Header } = Layout;

type ItemType = Required<MenuProps>['items'][number];

interface MainHeaderProps {
  items: ItemType[];
}

export default function MainHeader({ items }: MainHeaderProps) {
  return (
    <Header
      className="foo"
      style={{
        height: 32,
        padding: '0 0px',
        lineHeight: '32px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Menu
        theme="light"
        mode="horizontal"
        items={items}
        style={{
          height: 32,
          padding: '0 16px',
          lineHeight: '32px',
          justifyContent: 'flex-end',
          flex: 1,
          minWidth: 0,
        }}
      />
    </Header>
  );
}
