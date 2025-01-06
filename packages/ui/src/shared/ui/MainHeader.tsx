import { Layout, Menu, MenuProps } from 'antd';

const { Header } = Layout;

type ItemType = Required<MenuProps>['items'][number];

interface MainHeaderProps {
  leftItems?: ItemType[];
  rightItems?: ItemType[];
}

export default function MainHeader({ leftItems, rightItems }: MainHeaderProps) {
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
      {leftItems != null && (
        <Menu
          theme="light"
          mode="horizontal"
          items={leftItems}
          style={{
            height: 32,
            padding: '0 16px',
            lineHeight: '32px',
            justifyContent: 'flex-start',
            flex: 1,
            minWidth: 0,
          }}
        />
      )}

      {rightItems != null && (
        <Menu
          theme="light"
          mode="horizontal"
          items={rightItems}
          style={{
            height: 32,
            padding: '0 16px',
            lineHeight: '32px',
            justifyContent: 'flex-end',
            flex: 1,
            minWidth: 0,
          }}
        />
      )}
    </Header>
  );
}
