import React from 'react';
import { useFavoritesStore } from '@/zustand/useFavoritesStore';
import { MovieCard } from '@/components/MovieRow';
import { Heart, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';

const WishlistPage = () => {
    const { favorites } = useFavoritesStore();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 lg:p-20">
            <div className="max-w-7xl mx-auto space-y-12">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[#e50914] font-black uppercase tracking-[0.2em] text-xs">
                            <Heart className="w-4 h-4 fill-current" /> My Library
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight">Your Wishlist</h1>
                        <p className="text-gray-500 font-medium">A curated selection of your favorite cinematic masterpieces.</p>
                    </div>
                    <Button 
                        variant="outline" 
                        className="rounded-full border-white/10 hover:bg-white/5 h-12 px-8 text-xs font-bold uppercase tracking-widest"
                        onClick={() => navigate('/')}
                    >
                        <Home className="w-4 h-4 mr-2" /> Back to Home
                    </Button>
                </div>

                {/* Content */}
                {favorites.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
                        {favorites.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 space-y-8 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-gray-700">
                            <Heart className="w-12 h-12" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-bold">Your list is empty</h3>
                            <p className="text-gray-500 max-w-xs mx-auto">Start exploring and save the movies you want to watch later.</p>
                        </div>
                        <Button 
                            className="bg-[#e50914] hover:bg-red-700 h-12 px-10 rounded-full font-black uppercase text-xs tracking-widest shadow-xl shadow-red-600/20"
                            onClick={() => navigate('/')}
                        >
                            Explore Now
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
