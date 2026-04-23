import { useNavigate } from 'react-router';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart, Play } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useFavoritesStore } from '@/zustand/useFavoritesStore';
import { useAuthStore } from '@/zustand/useAuthStore';
import { toast } from 'sonner';

export function MovieCard({ movie }) {
  const navigate = useNavigate();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavoritesStore();
  const { isAuthenticated } = useAuthStore();
  
  const favorite = isFavorite(movie.id);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add favorites');
      navigate('/login');
      return;
    }
    
    if (favorite) {
      removeFromFavorites(movie.id);
      toast.success('Removed from wishlist');
    } else {
      addToFavorites(movie);
      toast.success('Added to wishlist');
    }
  };

  const imageUrl = movie.poster_path
    ? `${import.meta.env.VITE_TMDB_IMAGE_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <div 
      className="relative group rounded-xl overflow-hidden cursor-pointer shrink-0 w-44 border border-white/5 shadow-2xl"
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <img
        src={imageUrl}
        alt={movie.title}
        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
      />
      
      {/* Quick Action Overlay */}
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={toggleFavorite}
          className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
            favorite 
            ? 'bg-red-600 text-white' 
            : 'bg-black/40 text-white/70 hover:bg-black/60 hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 pb-4">
        <h3 className="text-white font-bold text-xs mb-1 line-clamp-2">{movie.title}</h3>
        <div className="flex items-center gap-1 mb-3">
          <span className="text-yellow-400 text-[10px]">⭐</span>
          <span className="text-white text-[10px] font-bold">{movie.vote_average.toFixed(1)}</span>
          <span className="text-gray-400 text-[10px] ml-1">{movie.release_date?.slice(0, 4)}</span>
        </div>
        <Button
          size="sm"
          style={{ backgroundColor: '#e50914' }}
          className="w-full h-8 text-[10px] uppercase font-black tracking-wider shadow-lg"
        >
          <Play className="w-3 h-3 mr-1 fill-current" /> Details
        </Button>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden shrink-0 w-44">
      <Skeleton className="w-full h-64 bg-gray-900" />
    </div>
  );
}

export function MovieRow({ title, movies, loading }) {
  const rowRef = useRef(null);

  function scroll(direction) {
    const scrollAmount = rowRef.current.clientWidth * 0.8;
    rowRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
    });
  }

  return (
    <div className="mb-12 group/row">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: '#e50914' }} />
          <h2 className="text-xl font-black text-white uppercase tracking-tight">{title}</h2>
        </div>
        <div className="flex gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-full border border-white/10 text-white hover:bg-white/10 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-full border border-white/10 text-white hover:bg-white/10 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {loading
          ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
          : movies?.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        }
      </div>
    </div>
  );
}
