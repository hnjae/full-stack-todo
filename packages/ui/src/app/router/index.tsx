import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import HomePage from 'src/pages/home';
import LoginPage from 'src/pages/login';
import signupPage from 'src/pages/signup';

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
    component: signupPage,
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
