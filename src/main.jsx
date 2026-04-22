import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { ThemeProvider } from './components/theme-provider';
import App from './App';
import MainLayout from './layouts/MainLayout';
import NotFound404 from './pages/NotFound404';
import UserPage from './pages/UserPage';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import StoreManagement from './StoreManagement';
import { store } from './redux/store';
import { Provider } from 'react-redux';

const router = createBrowserRouter(
	[
		{
			path: '/',
			element: <MainLayout />,
			children: [
				// Root Route
				{
					index: true,
					element: <App />,
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
				// Dynamic route
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

		// Wildcard Route 404
		{
			path: '*', // Wildcard Route 404: match all unknown urls
			element: <NotFound404 />,
		},
	],
	{
		basename: '/react-vite-rr7-ghp-deploy', // must match your repo name
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
