import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useNowPlaying } from '@/hooks/useNowPlaying';
import { usePopularMovies } from '@/hooks/usePopularMovies';
import { useTopRated } from '@/hooks/useTopRated';
import { useGenres } from '@/hooks/useGenres';
import { Skeleton } from '@/components/ui/skeleton';
import { MovieRow } from '@/components/MovieRow';
import { Button } from '@/components/ui/button';
import { Play, Plus, Heart, Check } from 'lucide-react';
import { useFavoritesStore } from '@/zustand/useFavoritesStore';
import { useAuthStore } from '@/zustand/useAuthStore';
import { toast } from 'sonner';

function HeroSection({ movie }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const backdropUrl = movie?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const { favorites, addToFavorites, removeFromFavorites } = useFavoritesStore();
  const { isAuthenticated } = useAuthStore();
  const isFavorite = favorites.some((m) => m.id === movie.id);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error(t('nav.login'));
      navigate('/login');
      return;
    }

    if (isFavorite) {
      removeFromFavorites(movie.id);
      toast.success(t('common.addToWishlist') + ' - Removed');
    } else {
      addToFavorites(movie);
      toast.success(t('common.addToWishlist') + ' - Added');
    }
  };

  if (!movie) return null;

  return (
    <div className="relative w-full h-[85vh] overflow-hidden">
      {backdropUrl && (
        <img
          src={backdropUrl}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-10000 hover:scale-110"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-r from-background/90 via-background/50 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />

      <div className="absolute bottom-8 left-4 right-4 md:bottom-16 md:left-10 md:right-auto rtl:md:left-auto rtl:md:right-10 max-w-xl text-left rtl:text-right">
        <div className="inline-block px-3 py-1 rounded bg-primary text-primary-foreground text-xs font-bold mb-3 md:mb-4">
          {t('home.featured')} &nbsp;⭐ {movie.vote_average.toFixed(1)}
        </div>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-3 md:mb-4 leading-tight">{movie.title}</h1>
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4 md:mb-6 line-clamp-3 md:line-clamp-4">{movie.overview}</p>
        <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-xs md:text-sm mb-4 md:mb-6">
          <span>📅 {movie.release_date?.slice(0, 4)}</span>
          <span>•</span>
          <span>⭐ {movie.vote_average.toFixed(1)}</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="w-full sm:w-auto px-6 py-4 md:py-6 rounded-lg text-primary-foreground bg-primary font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Play className="w-4 h-4 fill-current" /> {t('common.viewDetails')}
          </Button>
          <Button
            variant={isFavorite ? "default" : "outline"}
            onClick={toggleFavorite}
            className={`w-full sm:w-auto px-6 py-4 md:py-6 rounded-lg font-semibold transition-all flex items-center justify-center ${isFavorite
                ? "bg-primary text-primary-foreground border-primary"
                : "text-foreground border-border bg-background/10 hover:bg-background/20"
              }`}
          >
            {isFavorite ? <Check className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {isFavorite ? t('wishlist.inWishlist') || 'In Wishlist' : t('common.addToWishlist')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const { movies: nowPlaying, totalPages, loading: loadingNow, error } = useNowPlaying(page, selectedGenre, sortBy);
  const { movies: popular, loading: loadingPopular } = usePopularMovies();
  const { movies: topRated, loading: loadingTop } = useTopRated();
  const { genres } = useGenres();

  const heroMovie = topRated[0] || null;

  function handleGenreClick(genreId) {
    setSelectedGenre((prev) => (prev === genreId ? null : genreId));
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">

      {/* Hero Section */}
      {!loadingPopular && heroMovie ? (
        <HeroSection movie={heroMovie} />
      ) : (
        <div className="w-full h-[85vh] bg-muted animate-pulse" />
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Popular Row */}
        <MovieRow title={t('home.popularNow')} movies={popular} loading={loadingPopular} />

        {/* Top Rated Row */}
        <MovieRow title={t('home.topRated')} movies={topRated} loading={loadingTop} />

        {/* Now Playing Grid with Genre Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-bold text-foreground">{t('home.nowPlaying')}</h2>
            <div className="h-0.5 flex-1 rounded-full bg-primary" />
          </div>

          {/* Genre Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={selectedGenre === null ? "default" : "outline"}
              onClick={() => handleGenreClick(null)}
              className="rounded-full text-sm font-medium transition-all"
            >
              {t('common.all')}
            </Button>
            {genres.map((genre) => (
              <Button
                key={genre.id}
                variant={selectedGenre === genre.id ? "default" : "outline"}
                onClick={() => handleGenreClick(genre.id)}
                className="rounded-full text-sm font-medium transition-all"
              >
                {genre.name}
              </Button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="text-center py-10 text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
              {error}
            </div>
          )}

          {/* Sort Buttons */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-muted-foreground text-sm w-full sm:w-auto mb-1 sm:mb-0">{t('common.sortBy')}:</span>
            {[
              { label: t('common.popularity'), value: 'popularity.desc' },
              { label: t('common.rating'), value: 'vote_average.desc' },
              { label: t('common.newest'), value: 'release_date.desc' },
            ].map((option) => (
              <Button
                key={option.value}
                variant={sortBy === option.value ? "default" : "outline"}
                onClick={() => {
                  setSortBy((prev) => (prev === option.value ? null : option.value));
                  setPage(1);
                }}
                size="sm"
                className="rounded-full text-xs font-medium transition-all"
              >
                {option.label}
              </Button>
            ))}
          </div>

          {/* Movies Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {loadingNow
              ? Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden aspect-[2/3]">
                  <Skeleton className="w-full h-full" />
                </div>
              ))
              : nowPlaying.map((movie) => (
                <div key={movie.id} className="relative group rounded-xl overflow-hidden cursor-pointer bg-card border border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/10" onClick={() => navigate(`/movie/${movie.id}`)}>
                  <img
                    src={movie.poster_path ? `${import.meta.env.VITE_TMDB_IMAGE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                    alt={movie.title}
                    className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-left rtl:text-right">
                    <h3 className="text-foreground font-bold text-sm mb-1 line-clamp-2">{movie.title}</h3>
                    <div className="flex items-center gap-1 mb-3">
                      <span className="text-yellow-400 text-xs">⭐</span>
                      <span className="text-foreground text-xs font-bold">{movie.vote_average.toFixed(1)}</span>
                      <span className="text-muted-foreground text-xs ml-2">{movie.release_date?.slice(0, 4)}</span>
                    </div>
                    <Button
                      size="sm"
                      className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      <Play className="w-3 h-3 mr-2 fill-current" /> {t('common.viewDetails')}
                    </Button>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Pagination */}
          {!loadingNow && !error && (
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 mt-8 md:mt-10">
              <Button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                variant="default"
                className="px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm"
              >
                ← {t('common.prev')}
              </Button>
              <span className="text-muted-foreground text-sm">
                {t('common.page')} <span className="text-foreground font-bold">{page}</span> {t('common.of')} {totalPages}
              </span>
              <Button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
                variant="default"
                className="px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm"
              >
                {t('common.next')} →
              </Button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}