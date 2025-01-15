import { FormOutlined, HomeOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate, useRouterState } from '@tanstack/react-router';
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

type ItemTypeWithRequiredKey = Required<MenuProps>['items'][number] & {
  key: string;
};

interface MainHeaderProps {
  hidItems?: string[];
}

export default function MainHeader({ hidItems = [] }: MainHeaderProps) {
  const router = useRouterState();
  const navigate = useNavigate();

  const allItems: ItemTypeWithRequiredKey[] = [
    // use router path for key
    {
      key: '/',
      label: 'Home',
      icon: <HomeOutlined />,
      onClick: () => {
        navigate({
          to: '/',
        });
      },
    },
    {
      key: '/login',
      label: 'Login',
      icon: <LoginOutlined />,
      onClick: () => {
        navigate({
          to: '/login',
        });
      },
    },
    {
      key: '/signup',
      label: 'Sign up',
      icon: <FormOutlined />,
      onClick: () => {
        navigate({
          to: '/signup',
        });
      },
    },
  ];

  const items = allItems.filter((item) => !hidItems.includes(item.key));

  return (
    <Header className="foo" style={headerStyle}>
      <Menu
        theme="light"
        mode="horizontal"
        defaultSelectedKeys={[router.location.pathname]}
        items={items}
        style={{
          ...menuStyle,
          justifyContent: 'flex-end',
        }}
      />
    </Header>
  );
}
