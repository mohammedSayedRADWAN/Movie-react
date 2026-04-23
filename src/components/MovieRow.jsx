import { useNavigate } from 'react-router';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function MovieCard({ movie }) {
  const navigate = useNavigate();
  const imageUrl = movie.poster_path
    ? `${import.meta.env.VITE_TMDB_IMAGE_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <div 
      className="relative group rounded-xl overflow-hidden cursor-pointer shrink-0 w-44"
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <img
        src={imageUrl}
        alt={movie.title}
        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
        <h3 className="text-white font-bold text-xs mb-1 line-clamp-2">{movie.title}</h3>
        <div className="flex items-center gap-1 mb-2">
          <span className="text-yellow-400 text-xs">⭐</span>
          <span className="text-white text-xs">{movie.vote_average.toFixed(1)}</span>
          <span className="text-gray-400 text-xs ml-1">{movie.release_date?.slice(0, 4)}</span>
        </div>
        <button
          style={{ backgroundColor: '#e50914' }}
          className="w-full py-1.5 rounded-lg text-white text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          ▶ View Details
        </button>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden shrink-0 w-44">
      <Skeleton className="w-full h-64 bg-gray-800" />
    </div>
  );
}

export function MovieRow({ title, movies, loading }) {
  const rowRef = useRef(null);

  function scrollLeft() {
    rowRef.current.scrollBy({ left: -600, behavior: 'smooth' });
  }

  function scrollRight() {
    rowRef.current.scrollBy({ left: 600, behavior: 'smooth' });
  }

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <div className="h-0.5 w-16 rounded-full" style={{ backgroundColor: '#e50914' }} />
        </div>
        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            className="p-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollRight}
            className="p-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {loading
          ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
          : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        }
      </div>
    </div>
  );
}
