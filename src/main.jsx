import './index.css';
import './lib/i18n';
import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { ThemeProvider } from './components/theme-provider';
import MainLayout from './layouts/MainLayout';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { Spinner } from './components/ui/spinner';

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
const PopularTVPage = lazy(() => import('./pages/PopularTVPage'));
const NotFound404 = lazy(() => import('./pages/NotFound404'));

const router = createBrowserRouter(
	[
		{
			path: '/',
			element: <MainLayout />,
			children: [
				{
					index: true,
					element: (
						<Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner /></div>}>
							<HomePage />
						</Suspense>
					),
				},
				{
					path: '/users/',
					element: (
						<Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner /></div>}>
							<UsersPage />
						</Suspense>
					),
				},
				{
					path: '/login/',
					element: (
						<Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner /></div>}>
							<LoginPage />
						</Suspense>
					),
				},
				{
					path: '/register/',
					element: (
						<Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner /></div>}>
							<RegisterPage />
						</Suspense>
					),
				},
				{
					path: '/wishlist/',
					element: (
						<Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner /></div>}>
							<WishlistPage />
						</Suspense>
					),
				},
				{
					path: '/store/',
					element: (
						<Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner /></div>}>
							<StoreManagement />
						</Suspense>
					),
				},
				{
					path: '/search',
					element: (
						<Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner /></div>}>
							<SearchResultsPage />
						</Suspense>
					),
				},
				{
					path: '/users/:id',
					element: (
						<Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner /></div>}>
							<UserPage />
						</Suspense>
					),
				},
				{
					path: '/movie/:id',
					element: (
						<Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner /></div>}>
							<MovieDetailsPage />
						</Suspense>
					),
				},
				{
					path: '/tv/:id',
					element: (
						<Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner /></div>}>
							<MovieDetailsPage />
						</Suspense>
					),
				},
				{
					path: '/tv',
					element: (
						<Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner /></div>}>
							<PopularTVPage />
						</Suspense>
					),
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
		<ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
			<Provider store={store}>
				<RouterProvider router={router} />
			</Provider>
		</ThemeProvider>
	</StrictMode>,
);