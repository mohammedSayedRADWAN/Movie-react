import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFavoritesStore } from '@/zustand/useFavoritesStore';
import { MovieCard } from '@/components/MovieRow';
import { Heart, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';

const WishlistPage = () => {
    const { t } = useTranslation();
    const { favorites } = useFavoritesStore();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 p-6 md:p-12 lg:p-20">
            <div className="max-w-7xl mx-auto space-y-12">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-10 text-left rtl:text-right">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-xs">
                            <Heart className="w-4 h-4 fill-current" /> {t('wishlist.myLibrary')}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight">{t('wishlist.yourWishlist')}</h1>
                        <p className="text-muted-foreground font-medium">{t('wishlist.curatedSelection')}</p>
                    </div>
                    <Button 
                        variant="outline" 
                        className="rounded-full border-border hover:bg-muted h-12 px-8 text-xs font-bold uppercase tracking-widest transition-all hover:scale-105"
                        onClick={() => navigate('/')}
                    >
                        <Home className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" /> {t('wishlist.backToHome')}
                    </Button>
                </div>

                {/* Content */}
                {favorites.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
                        {favorites.map((movie) => (
                            <div key={movie.id} className="flex justify-center">
                                <MovieCard movie={movie} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 space-y-8 bg-muted/30 rounded-[3rem] border border-dashed border-border/50 backdrop-blur-xs transition-all hover:border-primary/30">
                        <div className="w-24 h-24 rounded-full bg-background flex items-center justify-center text-muted-foreground shadow-inner">
                            <Heart className="w-12 h-12" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-bold">{t('wishlist.emptyList')}</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto">{t('wishlist.startExploring')}</p>
                        </div>
                        <Button 
                            className="bg-primary hover:bg-primary/90 h-12 px-10 rounded-full font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-110 active:scale-95"
                            onClick={() => navigate('/')}
                        >
                            {t('wishlist.exploreNow')}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
