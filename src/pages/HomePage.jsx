import { useSearchParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useNowPlaying } from '@/hooks/useNowPlaying';
import { usePopularMovies } from '@/hooks/usePopularMovies';
import { useTopRated } from '@/hooks/useTopRated';
import { useGenres } from '@/hooks/useGenres';
import { Skeleton } from '@/components/ui/skeleton';
import { MovieRow } from '@/components/MovieRow';
import { Button } from '@/components/ui/button';
import { Play, Plus, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';

function HeroSection({ movie }) {
  const { t } = useTranslation();
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
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-10000 hover:scale-110"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-r from-background/90 via-background/50 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />

      <div className="absolute bottom-16 left-10 rtl:left-auto rtl:right-10 max-w-xl text-left rtl:text-right">
        <div className="inline-block px-3 py-1 rounded bg-primary text-primary-foreground text-xs font-bold mb-4">
          {t('home.featured')} &nbsp;⭐ {movie.vote_average.toFixed(1)}
        </div>
        <h1 className="text-5xl font-extrabold text-foreground mb-4 leading-tight">{movie.title}</h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">{movie.overview}</p>
        <div className="flex items-center gap-3 text-muted-foreground text-sm mb-6">
          <span>📅 {movie.release_date?.slice(0, 4)}</span>
          <span>•</span>
          <span>⭐ {movie.vote_average.toFixed(1)}</span>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="px-6 py-6 rounded-lg text-primary-foreground bg-primary font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Play className="w-4 h-4 fill-current" /> {t('common.viewDetails')}
          </Button>
          <Button variant="outline" className="px-6 py-6 rounded-lg text-foreground font-semibold border-border bg-background/10 hover:bg-background/20 transition-all">
            <Plus className="w-4 h-4" /> {t('common.addToWishlist')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL State Management
  const page = parseInt(searchParams.get('page')) || 1;
  const selectedGenre = searchParams.get('genre') || null;
  const sortBy = searchParams.get('sort') || 'popularity.desc';

  const { movies: nowPlaying, totalPages, loading: loadingNow, error } = useNowPlaying(page, selectedGenre, sortBy);
  const { movies: popular, loading: loadingPopular } = usePopularMovies();
  const { movies: topRated, loading: loadingTop } = useTopRated();
  const { genres } = useGenres();

  const heroMovie = topRated[0] || null;

  const updateParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    setSearchParams(newParams);
  };

  const handleGenreClick = (genreId) => {
    updateParams({
      genre: selectedGenre === String(genreId) ? null : genreId,
      page: 1
    });
  };

  const handleSortClick = (value) => {
    updateParams({
      sort: sortBy === value ? null : value,
      page: 1
    });
  };

  const sortOptions = [
    { label: t('common.popularity'), value: 'popularity.desc' },
    { label: t('common.rating'), value: 'vote_average.desc' },
    { label: t('common.newest'), value: 'release_date.desc' },
    { label: t('common.oldest'), value: 'release_date.asc' },
  ];

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
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-8 bg-primary rounded-full" />
               <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">{t('home.nowPlaying')}</h2>
            </div>
            <div className="h-[1px] flex-1 bg-border" />
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 bg-card/30 p-6 rounded-2xl border border-border/50 backdrop-blur-sm">
            {/* Genre Filter */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('common.filterByGenre')}</span>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedGenre === null ? "default" : "outline"}
                  onClick={() => handleGenreClick(null)}
                  className="rounded-full text-xs font-bold px-5 h-9 transition-all"
                >
                  {t('common.all')}
                </Button>
                {genres.map((genre) => (
                  <Button
                    key={genre.id}
                    variant={selectedGenre === String(genre.id) ? "default" : "outline"}
                    onClick={() => handleGenreClick(genre.id)}
                    className="rounded-full text-xs font-bold px-5 h-9 transition-all"
                  >
                    {genre.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Sort Controls */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('common.sortBy')}</span>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={sortBy === option.value ? "default" : "outline"}
                    onClick={() => handleSortClick(option.value)}
                    size="sm"
                    className="rounded-full text-xs font-bold px-5 h-9 transition-all flex items-center gap-2"
                  >
                    {option.label}
                    {sortBy === option.value && (
                      option.value.includes('.desc') ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-center py-10 text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
              {error}
            </div>
          )}

          {/* Movies Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10">
            {loadingNow
              ? Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
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
                        className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        <Play className="w-3 h-3 fill-current" /> {t('common.viewDetails')}
                      </Button>
                    </div>
                  </div>
                ))
            }
          </div>

          {/* Pagination */}
          {!loadingNow && !error && nowPlaying.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-16 py-8 border-t border-border">
              <Button
                onClick={() => updateParams({ page: page - 1 })}
                disabled={page === 1}
                variant="outline"
                className="px-8 font-bold border-border hover:bg-muted"
              >
                ← {t('common.prev')}
              </Button>
              <span className="text-muted-foreground text-sm font-medium">
                {t('common.page')} <span className="text-foreground font-black text-lg mx-1">{page}</span> {t('common.of')} {totalPages}
              </span>
              <Button
                onClick={() => updateParams({ page: page + 1 })}
                disabled={page === totalPages}
                variant="outline"
                className="px-8 font-bold border-border hover:bg-muted"
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