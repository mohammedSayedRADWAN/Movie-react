import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { useDebounce } from '@/hooks/useDebounce';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';
import tmdb from '@/services/tmdb';

function MovieCard({ movie }) {
  const imageUrl = movie.poster_path
    ? `${import.meta.env.VITE_TMDB_IMAGE_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <div className="relative group rounded-xl overflow-hidden cursor-pointer">
      <img
        src={imageUrl}
        alt={movie.title}
        className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">
          {movie.title}
        </h3>
        <div className="flex items-center gap-1 mb-3">
          <span className="text-yellow-400 text-xs">⭐</span>
          <span className="text-white text-xs">{movie.vote_average.toFixed(1)}</span>
          <span className="text-gray-400 text-xs ml-2">
            {movie.release_date?.slice(0, 4)}
          </span>
        </div>
        <button
          style={{ backgroundColor: '#e50914' }}
          className="w-full py-2 rounded-lg text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          ▶ View Details
        </button>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden">
      <Skeleton className="w-full h-72 bg-gray-800" />
      <div className="p-3 space-y-2" style={{ backgroundColor: '#111' }}>
        <Skeleton className="h-4 w-3/4 bg-gray-700" />
        <Skeleton className="h-3 w-1/4 bg-gray-700" />
      </div>
    </div>
  );
}

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const debouncedQuery = useDebounce(query, 500);

  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!debouncedQuery.trim()) return;

    async function fetchSearchResults() {
      try {
        setLoading(true);
        setError(null);
        const response = await tmdb.get('/search/movie', {
          params: { query: debouncedQuery, page },
        });
        setMovies(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (err) {
        setError('Failed to fetch search results.');
      } finally {
        setLoading(false);
      }
    }

    fetchSearchResults();
  }, [debouncedQuery, page]);

  // Reset page when query changes
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  return (
    <div className="min-h-screen px-4 py-8" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-2xl">🔍</span>
          <h1 className="text-2xl font-bold text-white">
            Search results for: <span style={{ color: '#e50914' }}>"{query}"</span>
          </h1>
        </div>

        {/* Empty State */}
        {!loading && !error && movies.length === 0 && query && (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🎬</p>
            <p className="text-white text-xl font-semibold mb-2">No movies found</p>
            <p className="text-gray-400">Try searching for something else</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-10 text-red-400 bg-red-950/30 rounded-lg border border-red-900">
            {error}
          </div>
        )}

        {/* Movies Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {loading
            ? Array.from({ length: 20 }).map((_, i) => <SkeletonCard key={i} />)
            : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
          }
        </div>

        {/* Pagination */}
        {!loading && !error && movies.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="px-6 py-2 rounded-lg text-white font-semibold disabled:opacity-30 transition-opacity"
              style={{ backgroundColor: '#e50914' }}
            >
              ← Prev
            </button>
            <span className="text-gray-400 text-sm">
              Page <span className="text-white font-bold">{page}</span> of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              className="px-6 py-2 rounded-lg text-white font-semibold disabled:opacity-30 transition-opacity"
              style={{ backgroundColor: '#e50914' }}
            >
              Next →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}