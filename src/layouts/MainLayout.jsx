import { Outlet, Link, useNavigate } from 'react-router';
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import React, { useState } from 'react';

export default function MainLayout() {
	// 1. Initialize state for the search bar and the navigation hook
	const [searchTerm, setSearchTerm] = useState('');
	const navigate = useNavigate();

	// 2. Handle the form submission
	const handleSearch = (e) => {
		e.preventDefault(); // Prevent standard HTML form submission (page reload)

		if (searchTerm.trim()) {
			// Programmatically navigate to the users page with the search term as a URL query
			navigate(`/users/${encodeURIComponent(searchTerm)}`);
			setSearchTerm(''); // Optional: clear the search bar after navigating
		}
	};
	return (
		<div className='min-h-screen flex flex-col bg-slate-50'>
			{/* Navbar UI */}
			<header className='sticky top-0 z-10 w-full border-b bg-white shadow-sm p-4'>
				<div className='container mx-auto flex justify-between items-center'>
					<Link to='/' className='font-medium hover:text-blue-600'>
						<h1 className='text-xl font-bold'>Template V2.0</h1>
					</Link>
					{/* Search Bar Section */}
					<div className='flex items-center gap-4'>
						<form onSubmit={handleSearch} className='relative w-full max-w-sm'>
							<Search className='absolute left-1.5 top-1.5 h-4 w-4 text-slate-500' />
							<Input
								type='search'
								placeholder='Search for users'
								className='pl-8 bg-slate-50 focus-visible:ring-blue-500'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</form>
					</div>
					<NavigationMenu>
						<NavigationMenuList className='flex gap-4'>
							<NavigationMenuItem>
								<Link to='/' className='font-medium hover:text-blue-600'>
									Home
								</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link to='users' className='font-medium hover:text-blue-600'>
									Users
								</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link to='login' className='font-medium hover:text-blue-600'>
									Login
								</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link to='register' className='font-medium hover:text-blue-600'>
									Register
								</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link to='store' className='font-medium hover:text-blue-600'>
									Store
								</Link>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>
			</header>

			{/* Main Content */}
			<main className='grow container mx-auto p-4'>
				<Outlet />
			</main>

			{/* Footer UI */}
			<footer className='border-t bg-white p-6 text-center text-sm text-slate-500'>
				<p>© 2026 ITI by ELDash with 💖</p>
			</footer>
		</div>
	);
}
