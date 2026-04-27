import React, { useState, Suspense } from 'react';
import { Outlet, Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Input } from '@/components/ui/input';
import { Search, Heart, LogOut, User, Menu, Home } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useAuthStore } from '@/zustand/useAuthStore';
import { useFavoritesStore } from '@/zustand/useFavoritesStore';

export default function MainLayout() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuthStore();
  const { favorites } = useFavoritesStore();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className='min-h-screen flex flex-col font-sans bg-background text-foreground transition-colors duration-300'>

      {/* Premium Navbar */}
      <header className='sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-all'>
        <div className='container mx-auto px-4 h-20 flex justify-between items-center'>

          {/* Logo */}
          <Link to='/' className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg rotate-12 flex items-center justify-center transition-transform group-hover:rotate-0">
              <span className="text-primary-foreground font-black text-xl">M</span>
            </div>
            <h1 className='text-xl font-black tracking-widest'>
              MOVIE<span className="text-primary">APP</span>
            </h1>
          </Link>

          {/* Search Bar - Hidden on Mobile */}
          <div className='hidden md:flex items-center flex-1 max-w-sm mx-10'>
            <form onSubmit={handleSearch} className='relative w-full group'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors' />
              <Input
                type='search'
                placeholder={t('common.search')}
                className='h-11 pl-10 bg-muted/50 border-border text-foreground rounded-full placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:bg-muted transition-all'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>

          {/* Desktop Nav */}
          <div className="flex items-center gap-4">
            <NavigationMenu className="hidden lg:block">
              <NavigationMenuList className='flex gap-6 items-center'>
                <NavigationMenuItem>
                  <Link to='/' className='text-sm text-muted-foreground hover:text-foreground font-bold transition-colors uppercase tracking-wider'>
                    {t('nav.home')}
                  </Link>
                </NavigationMenuItem>

                {!isAuthenticated ? (
                  <>
                    <NavigationMenuItem>
                      <Link to='login' className='text-sm text-muted-foreground hover:text-foreground font-bold transition-colors uppercase tracking-wider'>
                        {t('nav.login')}
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link to='register'>
                        <Button size="sm" className="bg-primary hover:bg-primary/90 h-9 px-6 rounded-full font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20">
                          {t('nav.register')}
                        </Button>
                      </Link>
                    </NavigationMenuItem>
                  </>
                ) : (
                  <>
                    <NavigationMenuItem>
                      <div className="flex items-center gap-3 bg-muted border border-border pl-2 pr-4 py-1 rounded-full group">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-black text-xs text-primary-foreground uppercase">
                          {user?.username?.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Verified Agent</span>
                          <span className="text-xs font-black truncate max-w-[80px]">{user?.username}</span>
                        </div>
                        <button onClick={handleLogout} className="ml-2 text-muted-foreground hover:text-destructive transition-colors">
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
                      className='rounded-full text-foreground hover:bg-muted'
                    >
                      <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'fill-primary text-primary' : ''}`} />
                      {favorites.length > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-[10px] border-2 border-background">
                          {favorites.length}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center gap-2 border-l border-border pl-4 ml-2">
              <ThemeToggle />
              <LanguageToggle />
            </div>

            {/* Mobile Menu Icon */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l border-border bg-background/95 backdrop-blur-md">
                <SheetHeader className="text-left rtl:text-right mt-4 mb-8">
                  <SheetTitle className="text-xl font-black tracking-widest flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                      <span className="text-primary-foreground font-black text-sm">M</span>
                    </div>
                    MOVIE<span className="text-primary">APP</span>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-6">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className='relative w-full group'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors' />
                    <Input
                      type='search'
                      placeholder={t('common.search')}
                      className='h-11 pl-10 bg-muted/50 border-border text-foreground rounded-full placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:bg-muted transition-all'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </form>

                  {/* Mobile Links */}
                  <div className="flex flex-col gap-4 text-left rtl:text-right">
                    <Link to='/' onClick={() => setIsMobileMenuOpen(false)} className='flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground font-bold transition-colors uppercase tracking-wider p-2 rounded-lg hover:bg-muted'>
                      <Home className="w-4 h-4" /> {t('nav.home')}
                    </Link>

                    <Link to='wishlist' onClick={() => setIsMobileMenuOpen(false)} className='flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground font-bold transition-colors uppercase tracking-wider p-2 rounded-lg hover:bg-muted'>
                      <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'fill-primary text-primary' : ''}`} />
                      {t('nav.wishlist')}
                      {favorites.length > 0 && (
                        <Badge className="ml-auto bg-primary text-primary-foreground">
                          {favorites.length}
                        </Badge>
                      )}
                    </Link>

                    <div className="h-px w-full bg-border my-2" />

                    {!isAuthenticated ? (
                      <div className="flex flex-col gap-3">
                        <Link to='login' onClick={() => setIsMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full justify-start text-muted-foreground hover:text-foreground font-bold uppercase tracking-wider border-border">
                            {t('nav.login')}
                          </Button>
                        </Link>
                        <Link to='register' onClick={() => setIsMobileMenuOpen(false)}>
                          <Button className="w-full justify-start bg-primary hover:bg-primary/90 font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
                            {t('nav.register')}
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 bg-muted/50 border border-border p-3 rounded-xl">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-black text-sm text-primary-foreground uppercase">
                            {user?.username?.charAt(0)}
                          </div>
                          <div className="flex flex-col flex-1">
                            <span className="text-[10px] text-primary font-bold uppercase tracking-tighter">Verified Agent</span>
                            <span className="text-sm font-black truncate">{user?.username}</span>
                          </div>
                        </div>
                        <Button variant="destructive" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full justify-start font-bold uppercase tracking-widest">
                          <LogOut className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" /> {t('nav.logout')}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='grow'>
        <Suspense fallback={
          <div className="w-full h-[80vh] flex flex-col items-center justify-center gap-4">
            <Spinner className="w-12 h-12 text-primary" />
            <p className="text-primary font-black animate-pulse tracking-widest uppercase text-xs">Decrypting Content...</p>
          </div>
        }>
          <Outlet />
        </Suspense>
      </main>

      {/* Premium Footer */}
      <footer className='border-t border-border py-12 text-center bg-muted/30'>
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-6">
            <h1 className='text-sm font-black text-muted-foreground tracking-widest uppercase'>
              MOVIE<span className="text-primary">APP</span> CINEMATICS
            </h1>
            <div className="flex gap-8 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
            <p className='text-[10px] text-muted-foreground uppercase tracking-tighter'>© 2026 Designed for Elite Cinephiles. Powered by TMDB.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}