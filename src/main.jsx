import './index.css';
import { StrictMode, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { ThemeProvider } from './components/theme-provider';
import MainLayout from './layouts/MainLayout';
import { store } from './redux/store';
import { Provider } from 'react-redux';

// Lazy loading components
const HomePage = lazy(() => import('./pages/HomePage'));
const UsersPage = lazy(() => import('./pages/UsersPage'));
const UserPage = lazy(() => import('./pages/UserPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const MovieDetailsPage = lazy(() => import('./pages/MovieDetailsPage'));
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const StoreManagement = lazy(() => import('./StoreManagement'));
const NotFound404 = lazy(() => import('./pages/NotFound404'));

const router = createBrowserRouter(
	[
		{
			path: '/',
			element: <MainLayout />,
			children: [
				{
					index: true,
					element: <HomePage />,
				},
				{
					path: '/users/',
					element: <UsersPage />,
				},
				{
					path: '/login/',
					element: <LoginPage />,
				},
				{
					path: '/register/',
					element: <RegisterPage />,
				},
				{
					path: '/wishlist/',
					element: <WishlistPage />,
				},
				{
					path: '/store/',
					element: <StoreManagement />,
				},
				{
					path: '/search',
					element: <SearchResultsPage />,
				},
				{
					path: '/users/:id',
					element: <UserPage />,
				},
				{
					path: '/movie/:id',
					element: <MovieDetailsPage />,
				},
			],
		},
		{
			path: '*',
			element: <NotFound404 />,
		},
	],
	{
		basename: '/react-vite-rr7-ghp-deploy',
	},
);

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
			<Provider store={store}>
				<RouterProvider router={router} />
			</Provider>
		</ThemeProvider>
	</StrictMode>,
);