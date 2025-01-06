import { Layout, Menu, MenuProps } from 'antd';
import { CSSProperties } from 'react';

const { Header } = Layout;

const HEADER_HEIGHT = 32;
const MENU_PADDING = 16;

const headerStyle: CSSProperties = {
  height: HEADER_HEIGHT,
  padding: 0,
  lineHeight: `${HEADER_HEIGHT}px`,
  display: 'flex',
  alignItems: 'center',
};

const menuStyle: CSSProperties = {
  height: HEADER_HEIGHT,
  padding: `0 ${MENU_PADDING}px`,
  lineHeight: `${HEADER_HEIGHT}px`,
  flex: 1,
  minWidth: 0,
};

type ItemType = Required<MenuProps>['items'][number];

interface MainHeaderProps {
  leftItems?: ItemType[];
  rightItems?: ItemType[];
}

export default function MainHeader({ leftItems, rightItems }: MainHeaderProps) {
  return (
    <Header className="foo" style={headerStyle}>
      {leftItems != null && (
        <Menu
          theme="light"
          mode="horizontal"
          items={leftItems}
          style={{
            ...menuStyle,
            justifyContent: 'flex-start',
          }}
        />
      )}

      {rightItems != null && (
        <Menu
          theme="light"
          mode="horizontal"
          items={rightItems}
          style={{
            ...menuStyle,
            justifyContent: 'flex-end',
          }}
        />
      )}
    </Header>
  );
}
