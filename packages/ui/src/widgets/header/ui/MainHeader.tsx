import {
  FormOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Layout, Menu, MenuProps, Modal } from 'antd';
import { CSSProperties } from 'react';
import {
  clearAccessToken,
  selectIsAuthenticated,
  useAppDispatch,
  useAppSelector,
} from 'src/shared/model';

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

export default function MainHeader() {
  const router = useRouterState();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // use router path for key
  const noAuthItems: ItemTypeWithRequiredKey[] = [
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

  const authItems: ItemTypeWithRequiredKey[] = [
    {
      key: '/logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: () => {
        Modal.confirm({
          title: 'Logout',
          content: 'Are you sure you want to logout?',
          okText: 'Yes',
          cancelText: 'No',
          onOk: () => {
            dispatch(clearAccessToken());
          },
        });
      },
    },
  ];

  const isLogin = useAppSelector(selectIsAuthenticated);

  return (
    <Header className="foo" style={headerStyle}>
      <Menu
        theme="light"
        mode="horizontal"
        defaultSelectedKeys={[router.location.pathname]}
        items={(isLogin && authItems) || noAuthItems}
        style={{
          ...menuStyle,
          justifyContent: 'flex-end',
        }}
      />
    </Header>
  );
}
