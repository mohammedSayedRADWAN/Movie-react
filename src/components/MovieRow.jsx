import { useNavigate } from 'react-router';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Heart, Play } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useFavoritesStore } from '@/zustand/useFavoritesStore';
import { useAuthStore } from '@/zustand/useAuthStore';
import { toast } from 'sonner';

export function MovieCard({ movie }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { addToFavorites, removeFromFavorites, favorites } = useFavoritesStore();
  const { isAuthenticated } = useAuthStore();


  const favorite = favorites.some((m) => m.id === movie.id);


  const toggleFavorite = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error(t('nav.login'));
      navigate('/login');
      return;
    }

    if (favorite) {
      removeFromFavorites(movie.id);
      toast.success(t('common.addToWishlist') + ' - Removed');
    } else {
      addToFavorites(movie);
      toast.success(t('common.addToWishlist') + ' - Added');
    }
  };

  const imageUrl = movie.poster_path
    ? `${import.meta.env.VITE_TMDB_IMAGE_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <div
      className="relative group rounded-xl overflow-hidden cursor-pointer w-full border border-border bg-card shadow-2xl transition-all duration-300 hover:shadow-primary/10"
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <img
        src={imageUrl}
        alt={movie.title}
        className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Quick Action Overlay */}
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={toggleFavorite}
          className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 ${favorite
              ? 'bg-primary text-primary-foreground'
              : 'bg-background/40 text-foreground/70 hover:bg-background/60 hover:text-foreground'
            }`}
        >
          <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 pb-4 text-left rtl:text-right">
        <h3 className="text-foreground font-bold text-xs mb-1 line-clamp-2">{movie.title}</h3>
        <div className="flex items-center gap-1 mb-3">
          <span className="text-yellow-400 text-[10px]">⭐</span>
          <span className="text-foreground text-[10px] font-bold">{movie.vote_average.toFixed(1)}</span>
          <span className="text-muted-foreground text-[10px] ml-1">{movie.release_date?.slice(0, 4)}</span>
        </div>
        <Button
          size="sm"
          className="w-full h-8 px-2 text-[10px] uppercase font-black tracking-wider shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Play className="w-3 h-3 mr-1 fill-current" /> {t('common.viewDetails')}
        </Button>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden w-full">
      <Skeleton className="w-full aspect-[2/3]" />
    </div>
  );
}

export function MovieRow({ title, movies, loading }) {
  const rowRef = useRef(null);

  function scroll(direction) {
    const isRtl = document.documentElement.dir === 'rtl';
    const multiplier = isRtl ? -1 : 1;
    const scrollAmount = rowRef.current.clientWidth * 0.8 * multiplier;
    rowRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }

  return (
    <div className="mb-12 group/row">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 rounded-full bg-primary" />
          <h2 className="text-xl font-black text-foreground uppercase tracking-tight">{title}</h2>
        </div>
        <div className="hidden md:flex gap-2 transition-opacity">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-full border border-border text-foreground hover:bg-muted transition-all rotate-0 rtl:rotate-180"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-full border border-border text-foreground hover:bg-muted transition-all rotate-0 rtl:rotate-180"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto pb-4 scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="w-36 sm:w-44 shrink-0">
              <SkeletonCard />
            </div>
          ))
          : movies?.map((movie) => (
            <div key={movie.id} className="w-36 sm:w-44 shrink-0">
              <MovieCard movie={movie} />
            </div>
          ))
        }
      </div>
    </div>
  );
}
