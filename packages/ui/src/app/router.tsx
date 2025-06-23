import {
  createRootRoute,
  createRoute,
  createRouter,
  Navigate,
  Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { FC } from 'react';
import { LoginPage, SignupPage } from 'src/pages/auth';
import { WebAppPage } from 'src/pages/webapp';
import { selectIsAuthenticated, useAppSelector } from 'src/shared/model';

function RootComponent() {
  return (
    <div>
      <Outlet />
      {import.meta.env.DEV && (
        <TanStackRouterDevtools position="bottom-right" />
      )}
    </div>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => {
    const isLogin = useAppSelector(selectIsAuthenticated);
    return <>{isLogin ? <Navigate to="/webapp" /> : <Navigate to="/" />}</>;
  },
});

const getRootRoute = () => rootRoute;

const withRedirectIfAuthenticated = function (Component: FC) {
  return () => {
    const isLogin = useAppSelector(selectIsAuthenticated);
    return <>{isLogin ? <Navigate to="/webapp" /> : <Component />}</>;
  };
};

const routeTree = rootRoute.addChildren([
  createRoute({
    getParentRoute: getRootRoute,
    path: '/',
    component: () => {
      const isLogin = useAppSelector(selectIsAuthenticated);

      return (
        <>{isLogin ? <Navigate to="/webapp" /> : <Navigate to="/login" />}</>
      );
    },
  }),
  createRoute({
    getParentRoute: getRootRoute,
    path: 'signup',
    component: withRedirectIfAuthenticated(SignupPage),
  }),
  createRoute({
    getParentRoute: getRootRoute,
    path: 'login',
    component: withRedirectIfAuthenticated(LoginPage),
  }),
  createRoute({
    getParentRoute: getRootRoute,
    path: 'webapp',
    component: () => {
      const isLogin = useAppSelector(selectIsAuthenticated);

      return <>{isLogin ? <WebAppPage /> : <Navigate to="/login" />}</>;
    },
  }),
]);

export default createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultStaleTime: 5000,
});
