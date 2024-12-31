import './index.css';
import '@fontsource/material-icons-outlined';

import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import React from 'react';
import ReactDOM from 'react-dom/client';
import LoginPage from 'src/pages/login';
import signupPage from 'src/pages/signup';

const rootRoute = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <Link to="/">Start Over</Link>
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
    <>
      <h1 className="text-3xl font-bold underline">tailwindcss test</h1>
      <span className="material-icons-outlined">home</span>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
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
