import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useNowPlaying } from '@/hooks/useNowPlaying';
import { usePopularMovies } from '@/hooks/usePopularMovies';
import { useTopRated } from '@/hooks/useTopRated';
import { useGenres } from '@/hooks/useGenres';
import { Skeleton } from '@/components/ui/skeleton';
import { MovieRow } from '@/components/MovieRow';
import { Button } from '@/components/ui/button';
import { Play, Heart, Check } from 'lucide-react';
import { useFavoritesStore } from '@/zustand/useFavoritesStore';
import { useAuthStore } from '@/zustand/useAuthStore';
import { toast } from 'sonner';
import useEmblaCarousel from 'embla-carousel-react';

function HeroSection({ movies, loading }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    if (!emblaApi) return;
    const intervalId = setInterval(() => {
      emblaApi.scrollNext();
    }, 6000);
    return () => clearInterval(intervalId);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect();
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  const { favorites, addToFavorites, removeFromFavorites } = useFavoritesStore();
  const { isAuthenticated } = useAuthStore();

  if (loading || !movies || movies.length === 0) {
    return <div className="w-full h-[85vh] bg-muted animate-pulse" />;
  }

  const toggleFavorite = (e, movie) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error(t('nav.login'));
      navigate('/login');
      return;
    }

    const isFavorite = favorites.some((m) => m.id === movie.id);
    if (isFavorite) {
      removeFromFavorites(movie.id);
      toast.success('Removed from wishlist');
    } else {
      addToFavorites(movie);
      toast.success('Added to wishlist');
    }
  };

  const featuredMovies = movies.slice(0, 6);

  return (
    <div className="relative w-full h-[85vh] overflow-hidden">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {featuredMovies.map((movie) => {
            const backdropUrl = movie.backdrop_path
              ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
              : null;

            return (
              <div key={movie.id} className="flex-[0_0_100%] h-full relative">
                {backdropUrl && (
                  <div
                    className="absolute inset-0 bg-cover bg-center brightness-[0.3]"
                    style={{ backgroundImage: `url(${backdropUrl})` }}
                  />
                )}

                <div className="relative z-10 flex items-center h-full max-w-7xl mx-auto px-6">
                  <div className="text-white max-w-xl">
                    <h1 className="text-5xl font-black mb-6">{movie.title}</h1>
                    <p className="mb-6 opacity-70 line-clamp-3">{movie.overview}</p>

                    <div className="flex gap-4">
                      <Button onClick={() => navigate(`/movie/${movie.id}`)}>
                        <Play className="mr-2" /> {t('common.viewDetails')}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={(e) => toggleFavorite(e, movie)}
                      >
                        {favorites.some((m) => m.id === movie.id) ? (
                          <Check />
                        ) : (
                          <Heart />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const selectedGenre = searchParams.get('genre');
  const sortBy = searchParams.get('sort');

  const { movies: nowPlaying, totalPages, loading: loadingNow } =
    useNowPlaying(page, selectedGenre, sortBy);

  const { movies: popular, loading: loadingPopular } = usePopularMovies();
  const { movies: topRated, loading: loadingTop } = useTopRated();
  const { genres } = useGenres();

  const updateParams = (updates) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) params.delete(key);
      else params.set(key, value);
    });
    setSearchParams(params);
  };

  const handleGenreClick = (genreId) => {
    updateParams({
      genre: selectedGenre === String(genreId) ? null : genreId,
      page: 1,
    });
  };

  const handleSortClick = (value) => {
    updateParams({
      sort: sortBy === value ? null : value,
      page: 1,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection movies={topRated} loading={loadingTop} />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <MovieRow title={t('home.popularNow')} movies={popular} loading={loadingPopular} />
        <MovieRow title={t('home.topRated')} movies={topRated} loading={loadingTop} />

        {/* Filters */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">{t('home.nowPlaying')}</h2>

          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={!selectedGenre ? 'default' : 'outline'}
              onClick={() => handleGenreClick(null)}
            >
              {t('common.all')}
            </Button>

            {genres.map((g) => (
              <Button
                key={g.id}
                variant={selectedGenre == g.id ? 'default' : 'outline'}
                onClick={() => handleGenreClick(g.id)}
              >
                {g.name}
              </Button>
            ))}
          </div>

          <div className="flex gap-2 mb-6">
            {[
              { label: t('common.popularity'), value: 'popularity.desc' },
              { label: t('common.rating'), value: 'vote_average.desc' },
              { label: t('common.newest'), value: 'release_date.desc' },
            ].map((opt) => (
              <Button
                key={opt.value}
                variant={sortBy === opt.value ? 'default' : 'outline'}
                onClick={() => handleSortClick(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {loadingNow
              ? Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[2/3]" />
                ))
              : nowPlaying.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    className="cursor-pointer"
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                    />
                  </div>
                ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              onClick={() => updateParams({ page: page - 1 })}
              disabled={page === 1}
            >
              ← {t('common.prev')}
            </Button>

            <span>
              {page} / {totalPages}
            </span>

            <Button
              onClick={() => updateParams({ page: page + 1 })}
              disabled={page === totalPages}
            >
              {t('common.next')} →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}