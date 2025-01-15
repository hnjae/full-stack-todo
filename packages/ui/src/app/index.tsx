import './index.css';
import '@fontsource/material-icons-outlined';

import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Layout, theme } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom/client';
import LoginPage from 'src/pages/login';
import signupPage from 'src/pages/signup';
import MainHeader from 'src/shared/ui/MainHeader';

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

function RootComponent() {
  return (
    <Layout>
      <MainHeader />

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
