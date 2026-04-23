import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useNowPlaying } from '@/hooks/useNowPlaying';
import { usePopularMovies } from '@/hooks/usePopularMovies';
import { useTopRated } from '@/hooks/useTopRated';
import { useGenres } from '@/hooks/useGenres';
import { Skeleton } from '@/components/ui/skeleton';
import { MovieRow } from '@/components/MovieRow';

function HeroSection({ movie }) {
  const navigate = useNavigate();
  const backdropUrl = movie?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  if (!movie) return null;

  return (
    <div className="relative w-full h-[85vh] overflow-hidden">
      {backdropUrl && (
        <img
          src={backdropUrl}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />

      <div className="absolute bottom-16 left-10 max-w-xl">
        <div
          className="inline-block px-3 py-1 rounded text-white text-xs font-bold mb-4"
          style={{ backgroundColor: '#e50914' }}
        >
          FEATURED &nbsp;⭐ {movie.vote_average.toFixed(1)}
        </div>
        <h1 className="text-5xl font-extrabold text-white mb-4 leading-tight">{movie.title}</h1>
        <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3">{movie.overview}</p>
        <div className="flex items-center gap-3 text-gray-400 text-sm mb-6">
          <span>📅 {movie.release_date?.slice(0, 4)}</span>
          <span>•</span>
          <span>⭐ {movie.vote_average.toFixed(1)}</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/movie/${movie.id}`)}
            style={{ backgroundColor: '#e50914' }}
            className="px-6 py-3 rounded-lg text-white font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            ▶ View Details
          </button>
          <button className="px-6 py-3 rounded-lg text-white font-semibold border border-white/30 bg-white/10 hover:bg-white/20 transition-all">
            + Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const { movies: nowPlaying, totalPages, loading: loadingNow, error } = useNowPlaying(page, selectedGenre, sortBy);
  const { movies: popular, loading: loadingPopular } = usePopularMovies();
  const { movies: topRated, loading: loadingTop } = useTopRated();
  const { genres } = useGenres();

  // Hero from top Rated
  const heroMovie = topRated[0] || null;

  function handleGenreClick(genreId) {
    setSelectedGenre((prev) => (prev === genreId ? null : genreId));
    setPage(1);
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>

      {/* Hero Section */}
      {!loadingPopular && heroMovie && <HeroSection movie={heroMovie} />}
      {loadingTop && <div className="w-full h-[85vh] bg-gray-900 animate-pulse" />}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Popular Row */}
        <MovieRow title="Popular Now" movies={popular} loading={loadingPopular} />

        {/* Top Rated Row */}
        <MovieRow title="Top Rated" movies={topRated} loading={loadingTop} />

        {/* Now Playing Grid with Genre Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-bold text-white">Now Playing</h2>
            <div className="h-0.5 flex-1 rounded-full" style={{ backgroundColor: '#e50914' }} />
          </div>

          {/* Genre Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => handleGenreClick(null)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor: selectedGenre === null ? '#e50914' : '#1a1a1a',
                color: 'white',
                border: '1px solid #333',
              }}
            >
              All
            </button>
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => handleGenreClick(genre.id)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={{
                  backgroundColor: selectedGenre === genre.id ? '#e50914' : '#1a1a1a',
                  color: 'white',
                  border: '1px solid #333',
                }}
              >
                {genre.name}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="text-center py-10 text-red-400 bg-red-950/30 rounded-lg border border-red-900">
              {error}
            </div>
          )}

        {/* Sort Buttons */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-400 text-sm">Sort by:</span>
          {[
            { label: 'Popularity', value: 'popularity.desc' },
            { label: 'Rating', value: 'vote_average.desc' },
            { label: 'Newest', value: 'release_date.desc' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setSortBy((prev) => (prev === option.value ? null : option.value));
                setPage(1);
              }}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor: sortBy === option.value ? '#e50914' : '#1a1a1a',
                color: 'white',
                border: '1px solid #333',
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

          {/* Movies Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {loadingNow
              ? Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden">
                    <Skeleton className="w-full h-72 bg-gray-800" />
                  </div>
                ))
              : nowPlaying.map((movie) => (
                    <div key={movie.id} className="relative group rounded-xl overflow-hidden cursor-pointer" onClick={() => navigate(`/movie/${movie.id}`)}>
                      <img
                        src={movie.poster_path ? `${import.meta.env.VITE_TMDB_IMAGE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                        alt={movie.title}
                        className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">{movie.title}</h3>
                      <div className="flex items-center gap-1 mb-3">
                        <span className="text-yellow-400 text-xs">⭐</span>
                        <span className="text-white text-xs">{movie.vote_average.toFixed(1)}</span>
                        <span className="text-gray-400 text-xs ml-2">{movie.release_date?.slice(0, 4)}</span>
                      </div>
                      <button
                        onClick={() => navigate(`/movie/${movie.id}`)}
                        style={{ backgroundColor: '#e50914' }}
                        className="w-full py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                      >
                        ▶ View Details
                      </button>
                    </div>
                  </div>
                ))
            }
          </div>

          {/* Pagination */}
          {!loadingNow && !error && (
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
    </div>
  );
}