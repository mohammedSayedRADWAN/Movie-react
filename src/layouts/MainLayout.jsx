import React, { useState, Suspense } from 'react';
import { Outlet, Link, useNavigate } from 'react-router';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Input } from '@/components/ui/input';
import { Search, Heart, LogOut, User, Menu } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/zustand/useAuthStore';
import { useFavoritesStore } from '@/zustand/useFavoritesStore';

export default function MainLayout() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const { user, isAuthenticated, logout } = useAuthStore();
  const { favorites } = useFavoritesStore();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className='min-h-screen flex flex-col font-sans' style={{ backgroundColor: '#0a0a0a' }}>

      {/* Premium Navbar */}
      <header className='sticky top-0 z-50 w-full border-b border-white/5 backdrop-blur-md transition-all'
        style={{ backgroundColor: 'rgba(10, 10, 10, 0.8)' }}>
        <div className='container mx-auto px-4 h-20 flex justify-between items-center'>
          
          {/* Logo */}
          <Link to='/' className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#e50914] rounded-lg rotate-12 flex items-center justify-center transition-transform group-hover:rotate-0">
                <span className="text-white font-black text-xl">M</span>
            </div>
            <h1 className='text-xl font-black text-white tracking-widest'>
              MOVIE<span style={{ color: '#e50914' }}>APP</span>
            </h1>
          </Link>

          {/* Search Bar - Hidden on Mobile */}
          <div className='hidden md:flex items-center flex-1 max-w-sm mx-10'>
            <form onSubmit={handleSearch} className='relative w-full group'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-red-500 transition-colors' />
              <Input
                type='search'
                placeholder='Browse movies, series...'
                className='h-11 pl-10 bg-white/5 border-white/10 text-white rounded-full placeholder:text-gray-500 focus-visible:ring-red-500 focus-visible:bg-white/10 transition-all'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>

          {/* Desktop Nav */}
          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList className='flex gap-6 items-center'>
              <NavigationMenuItem>
                <Link to='/' className='text-sm text-gray-400 hover:text-white font-bold transition-colors uppercase tracking-wider'>
                  Home
                </Link>
              </NavigationMenuItem>
              
              {!isAuthenticated ? (
                <>
                  <NavigationMenuItem>
                    <Link to='login' className='text-sm text-gray-400 hover:text-white font-bold transition-colors uppercase tracking-wider'>
                      Sign In
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to='register'>
                      <Button size="sm" className="bg-[#e50914] hover:bg-red-700 h-9 px-6 rounded-full font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-red-600/20">
                        Join Free
                      </Button>
                    </Link>
                  </NavigationMenuItem>
                </>
              ) : (
                <>
                  <NavigationMenuItem>
                     <div className="flex items-center gap-3 bg-white/5 border border-white/10 pl-2 pr-4 py-1 rounded-full group">
                        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-black text-xs text-white">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Verified Agent</span>
                            <span className="text-xs text-white font-black truncate max-w-[80px]">{user?.username}</span>
                        </div>
                        <button onClick={handleLogout} className="ml-2 text-gray-500 hover:text-red-500 transition-colors">
                            <LogOut className="w-4 h-4" />
                        </button>
                     </div>
                  </NavigationMenuItem>
                </>
              )}

              <NavigationMenuItem>
                <Link to='wishlist' className="relative">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className='rounded-full text-white hover:bg-white/5'
                  >
                    <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'fill-red-600 text-red-600' : ''}`} />
                    {favorites.length > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-600 text-[10px] border-2 border-[#0a0a0a]">
                        {favorites.length}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Menu Icon */}
          <Button variant="ghost" size="icon" className="lg:hidden text-white">
                <Menu className="w-6 h-6" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className='grow'>
        <Suspense fallback={
          <div className="w-full h-screen flex flex-col items-center justify-center bg-[#0a0a0a] gap-4">
            <Spinner className="w-12 h-12 text-[#e50914]" />
            <p className="text-red-500 font-black animate-pulse tracking-widest uppercase text-xs">Decrypting Content...</p>
          </div>
        }>
          <Outlet />
        </Suspense>
      </main>

      {/* Premium Footer */}
      <footer className='border-t border-white/5 py-12 text-center bg-[#050505]'>
        <div className="container mx-auto px-4">
            <div className="flex flex-col items-center gap-6">
                <h1 className='text-sm font-black text-gray-500 tracking-widest'>
                    MOVIE<span style={{ color: '#e50914' }}>APP</span> CINEMATICS
                </h1>
                <div className="flex gap-8 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Contact</a>
                </div>
                <p className='text-[10px] text-gray-700 uppercase tracking-tighter'>© 2026 Designed for Elite Cinephiles. Powered by TMDB.</p>
            </div>
        </div>
      </footer>

    </div>
  );
}