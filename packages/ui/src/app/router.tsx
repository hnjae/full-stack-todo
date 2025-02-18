import {
  createRootRoute,
  createRoute,
  createRouter,
  Navigate,
  Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { FC } from 'react';
import { selectIsAuthenticated } from 'src/entities/auth';
import { LoginPage, LogoutPage, SignupPage } from 'src/pages/auth';
import HomePage from 'src/pages/HomePage';
import { WebAppPage } from 'src/pages/webapp';
import { useAppSelector } from 'src/shared/lib';

function RootComponent() {
  return (
    <div>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
  notFoundComponent: HomePage,
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
    path: 'logout',
    component: LogoutPage,
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
