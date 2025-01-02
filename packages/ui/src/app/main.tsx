import './index.css';
import '@fontsource/material-icons-outlined';

import { HomeOutlined, LoginOutlined } from '@ant-design/icons';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
  useNavigate,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Layout, Menu, MenuProps, theme } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom/client';
import LoginPage from 'src/pages/login';
import signupPage from 'src/pages/signup';

const rootRoute = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => {
    const {
      token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
      <div
        style={{
          background: colorBgContainer,
          minHeight: 280,
          padding: 24,
          borderRadius: borderRadiusLG,
        }}
      >
        <span className="material-icons-outlined">home</span> hello
      </div>
    );
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'login',
  component: LoginPage,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'signup',
  component: signupPage,
});

const { Header } = Layout;

function RootComponent() {
  const navigate = useNavigate();
  const items: MenuProps['items'] = [
    {
      key: 'home',
      label: 'Home',
      icon: <HomeOutlined />,
      onClick: () => {
        navigate({
          to: '/',
        });
      },
    },
    {
      key: 'login',
      label: 'Login',
      icon: <LoginOutlined />,
      onClick: () => {
        navigate({
          to: '/login',
        });
      },
    },
  ];

  return (
    <Layout>
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
          defaultSelectedKeys={['home']}
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

      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </Layout>
  );
}

const routeTree = rootRoute.addChildren([signupRoute, loginRoute]);

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultStaleTime: 5000,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
