import { Outlet, Link, useNavigate } from 'react-router';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import React, { useState } from 'react';

export default function MainLayout() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  return (
    <div className='min-h-screen flex flex-col' style={{ backgroundColor: '#0a0a0a' }}>

      {/* Navbar */}
      <header className='sticky top-0 z-50 w-full border-b border-white/10 p-4'
        style={{ backgroundColor: '#0a0a0a' }}>
        <div className='container mx-auto flex justify-between items-center'>
          {/* Logo */}
          <Link to='/'>
            <h1 className='text-xl font-bold text-white'>
                <span style={{ color: '#e50914' }}>Movie</span>App
            </h1>
          </Link>

          {/* Search Bar */}
          <div className='flex items-center gap-4'>
            <form onSubmit={handleSearch} className='relative w-full max-w-sm'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400' />
              <Input
                type='search'
                placeholder='Search movies...'
                className='pl-8 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-red-500'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>

          {/* Nav Links */}
          <NavigationMenu>
            <NavigationMenuList className='flex gap-4'>
              <NavigationMenuItem>
                <Link to='/' className='text-gray-300 hover:text-white font-medium transition-colors'>
                  Home
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to='login' className='text-gray-300 hover:text-white font-medium transition-colors'>
                  Login
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to='register' className='text-gray-300 hover:text-white font-medium transition-colors'>
                  Register
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  to='wishlist'
                  className='px-4 py-1.5 rounded-lg text-white font-medium transition-opacity hover:opacity-90'
                  style={{ backgroundColor: '#e50914' }}
                >
                  ❤
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>

      {/* Main Content - without container Hero full width */}
      <main className='grow'>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className='border-t border-white/10 p-6 text-center text-sm text-gray-500'>
        <p>© 2026 MovieApp </p>
      </footer>

    </div>
  );
}