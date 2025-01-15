import './style.css';
import '@fontsource/material-icons-outlined';

import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import React from 'react';
import ReactDOM from 'react-dom/client';
import HomePage from 'src/pages/home';
import LoginPage from 'src/pages/login';
import signupPage from 'src/pages/signup';

const rootRoute = createRootRoute({
  component: RootComponent,
  notFoundComponent: HomePage,
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
    <div>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </div>
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
