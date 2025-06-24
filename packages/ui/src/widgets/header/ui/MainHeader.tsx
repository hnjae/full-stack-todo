import {
  FormOutlined,
  LoginOutlined,
  LogoutOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Button, Layout, Menu, MenuProps, Modal, theme } from 'antd';
import { useState } from 'react';
import { logout } from 'src/features/auth';
import {
  selectIsAuthenticated,
  useAppDispatch,
  useAppSelector,
} from 'src/shared/model';

import useSpinnerStatus from '../lib/useSpinnerStatus';

const { Header } = Layout;

const HEADER_HEIGHT = 32;

type ItemTypeWithRequiredKey = Required<MenuProps>['items'][number] & {
  key: string;
};

interface ModalProps {
  isOpen: boolean;
  close: () => void;
}

const LogoutModal = function ({ isOpen: open, close }: ModalProps) {
  const dispatch = useAppDispatch();
  return (
    <Modal
      title="Logout"
      open={open}
      okText="Yes"
      cancelText="No"
      onOk={() => {
        dispatch(logout());
        close();
      }}
      onCancel={() => {
        close();
      }}
    >
      "Are you sure you want to logout?"
    </Modal>
  );
};

export default function MainHeader() {
  const router = useRouterState();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    token: { colorBgContainer, colorBorder },
  } = theme.useToken();

  // use router path for key
  const noAuthItems: ItemTypeWithRequiredKey[] = [
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

  const isLogin = useAppSelector(selectIsAuthenticated);
  const isSpinnerSpin = useSpinnerStatus();

  return (
    <Header
      style={{
        padding: '2px',
        display: 'flex',
        alignItems: 'center',

        height: HEADER_HEIGHT,
        lineHeight: `${HEADER_HEIGHT}px`,
        background: colorBgContainer,
        borderBottom: '1px solid',
        borderBottomColor: colorBorder,
      }}
    >
      {isLogin && (
        <SyncOutlined
          className={[isSpinnerSpin ? 'animate-spin' : [], 'p-1']
            .flat()
            .join(' ')}
        />
      )}
      <Menu
        mode="horizontal"
        theme="light"
        selectedKeys={(isLogin && []) || [router.location.pathname]}
        items={(isLogin && []) || noAuthItems}
        style={{
          height: 'inherit',
          lineHeight: 'inherit',
          flex: 1,
          minWidth: 0,
          justifyContent: 'flex-end',
          backgroundColor: 'transparent',
          borderBottom: 'none',
        }}
      />
      {isLogin && (
        <>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={() => {
              setIsModalOpen(true);
            }}
            style={{ marginLeft: 'auto' }}
          >
            Logout
          </Button>
          <LogoutModal
            isOpen={isModalOpen}
            close={() => setIsModalOpen(false)}
          />
        </>
      )}
    </Header>
  );
}
