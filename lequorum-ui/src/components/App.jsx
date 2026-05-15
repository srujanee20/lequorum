import {
    createRouter,
    createRoute,
    createRootRouteWithContext,
    redirect,
    Outlet,
    RouterProvider
} from '@tanstack/react-router';

import MainLayout from '$components/layouts/MainLayout.jsx';
import Dashboard from '$components/pages/Dashboard.jsx';
import Login from '$components/pages/Login.jsx';
import Register from '$components/pages/Register.jsx';
import CreatePoll from '$components/pages/CreatePoll.jsx';
import PollView from '$components/pages/PollView.jsx';
import Analytics from '$components/pages/Analytics.jsx';
import PublishedResults from '$components/pages/PublishedResults.jsx';
import Home from '$components/pages/Home.jsx';
import NotFound from '$components/pages/NotFound.jsx';
import { useAuth } from '$/contexts/AuthContext.jsx';

const rootRoute = createRootRouteWithContext()({
    component: MainLayout,
    notFoundComponent: NotFound
});

const protectedRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: '_protected',
    beforeLoad: ({ context }) => {
        if (!context.auth.isLoggedIn) throw redirect({ to: '/login' });
    },
    component: Outlet
});

const guestRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: '_guest',
    beforeLoad: ({ context }) => {
        if (context.auth.isLoggedIn) 
            throw redirect({ to: '/dashboard' });
    },
    component: Outlet
});

const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: Home
});

const dashboardRoute = createRoute({
    getParentRoute: () => protectedRoute,
    path: '/dashboard',
    component: Dashboard
});

const createPollRoute = createRoute({
    getParentRoute: () => protectedRoute,
    path: '/polls/create',
    component: CreatePoll
});

const analyticsRoute = createRoute({
    getParentRoute: () => protectedRoute,
    path: '/polls/$pollId/analytics',
    component: Analytics
});

const loginRoute = createRoute({
    getParentRoute: () => guestRoute,
    path: '/login',
    component: Login
});

const registerRoute = createRoute({
    getParentRoute: () => guestRoute,
    path: '/register',
    component: Register
});

const pollViewRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/poll/$pollId',
    component: PollView
});

const publishedResultsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/poll/$pollId/results',
    component: PublishedResults
});

const routeTree = rootRoute.addChildren([
    homeRoute,
    protectedRoute.addChildren([dashboardRoute, createPollRoute, analyticsRoute]),
    guestRoute.addChildren([loginRoute, registerRoute]),
    pollViewRoute,
    publishedResultsRoute
]);

import ErrorState from '$components/ui/ErrorState.jsx';

const router = createRouter({
    routeTree,
    context: { auth: undefined, queryClient: undefined },
    defaultErrorComponent: ErrorState
});

const App = ({ queryClient }) => {
    const auth = useAuth();
    return <RouterProvider router={router} context={{ auth, queryClient }} />;
};

export default App;
