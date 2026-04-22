import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { ThemeProvider } from './components/theme-provider';
import MainLayout from './layouts/MainLayout';
import NotFound404 from './pages/NotFound404';
import UserPage from './pages/UserPage';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import StoreManagement from './StoreManagement';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';

const router = createBrowserRouter(
	[
		{
			path: '/',
			element: <MainLayout />,
			children: [
				// Root Route
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
					path: '/store/',
					element: <StoreManagement />,
				},
				{
					path: '/search',
					element: <SearchResultsPage />,
				},
				// Dynamic route
				{
					path: '/users/:id',
					element: <UserPage />,
				},
			],
		},

		// Wildcard Route 404
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