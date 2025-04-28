import {
  FormOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Layout, Menu, MenuProps, Modal, theme } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import {
  useAddTodoListMutation,
  useBatchUpdateTodoListMutation,
  useDeleteTodoListMutation,
  useGetTodoListsQuery,
} from 'src/entities/todo-list';
import {
  clearAccessToken,
  selectIsAuthenticated,
  useAppDispatch,
  useAppSelector,
} from 'src/shared/model';

const { Header } = Layout;

const HEADER_HEIGHT = 32;

type ItemTypeWithRequiredKey = Required<MenuProps>['items'][number] & {
  key: string;
};

export default function MainHeader() {
  const router = useRouterState();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    token: { colorBgContainer, colorBorder },
  } = theme.useToken();

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

  const {
    isLoading: isGetTodoListsLoading,
    isFetching: isGetTodoListsFetching,
  } = useGetTodoListsQuery();
  const [, { isLoading: isAddTodoListLoading }] = useAddTodoListMutation({
    fixedCacheKey: 'addTodoList',
  });
  const [, { isLoading: isDeleteTodoListLoading }] = useDeleteTodoListMutation({
    fixedCacheKey: 'deleteTodoList',
  });
  const [, { isLoading: isBatchUpdateTodoListLoading }] =
    useBatchUpdateTodoListMutation({
      fixedCacheKey: 'batchUpdateTodoList',
    });
  const isLoading = useMemo(
    () =>
      isGetTodoListsLoading ||
      isGetTodoListsFetching ||
      isAddTodoListLoading ||
      isDeleteTodoListLoading ||
      isBatchUpdateTodoListLoading,
    [
      isGetTodoListsLoading,
      isGetTodoListsFetching,
      isAddTodoListLoading,
      isDeleteTodoListLoading,
      isBatchUpdateTodoListLoading,
    ],
  );

  const [rotateSpinner, setRotateSpinner] = useState(isLoading);

  // Rotate spinner 500ms more loading
  useEffect(() => {
    let timeoutId: number | null = null;

    if (isLoading) {
      setRotateSpinner(true);
    } else if (rotateSpinner) {
      timeoutId = setTimeout(() => {
        setRotateSpinner(false);
      }, 500);
    }

    return () => {
      if (timeoutId != null) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading, rotateSpinner]);

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
          className={[rotateSpinner ? 'animate-spin' : [], 'p-1']
            .flat()
            .join(' ')}
        />
      )}
      <Menu
        mode="horizontal"
        theme="light"
        defaultSelectedKeys={[router.location.pathname]}
        items={(isLogin && authItems) || noAuthItems}
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
    </Header>
  );
}
