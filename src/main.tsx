import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import './styles.css';

import Layout from './components/layout/Layout';
import Dashboard from './components/Dashboard';
import WorkoutTracker from './components/workout-tracker/WorkoutTracker';
import StrengthAssessment from './components/strength/StrengthAssessment';
import WorkoutHistory from './components/workout-history/WorkoutHistory';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

const workoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/workout',
  component: WorkoutTracker,
});

const strengthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/strength',
  component: StrengthAssessment,
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/history',
  component: WorkoutHistory,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  workoutRoute,
  strengthRoute,
  historyRoute,
]);

const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
