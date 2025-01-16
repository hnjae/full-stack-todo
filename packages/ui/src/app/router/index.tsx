import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { LoginPage, SignupPage } from 'src/pages/auth';
import HomePage from 'src/pages/HomePage';

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

const routeTree = rootRoute.addChildren([
  createRoute({
    getParentRoute: getRootRoute,
    path: 'signup',
    component: SignupPage,
  }),
  createRoute({
    getParentRoute: getRootRoute,
    path: 'login',
    component: LoginPage,
  }),
]);

export default createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultStaleTime: 5000,
});
