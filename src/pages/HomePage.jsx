import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useNowPlaying } from '@/hooks/useNowPlaying';
import { usePopularMovies } from '@/hooks/usePopularMovies';
import { useTopRated } from '@/hooks/useTopRated';
import { useGenres } from '@/hooks/useGenres';
import { usePopularTV } from '@/hooks/usePopularTV';
import { Skeleton } from '@/components/ui/skeleton';
import { MovieRow } from '@/components/MovieRow';
import { Button } from '@/components/ui/button';
import { Play, Plus, Heart, Check } from 'lucide-react';
import { useFavoritesStore } from '@/zustand/useFavoritesStore';
import { useAuthStore } from '@/zustand/useAuthStore';
import { toast } from 'sonner';
import useEmblaCarousel from 'embla-carousel-react';


function HeroSection({ movies, loading }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  // Custom Autoplay Logic
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
      toast.success(t('common.addToWishlist') + ' - Removed');
    } else {
      addToFavorites(movie);
      toast.success(t('common.addToWishlist') + ' - Added');
    }
  };

  const featuredMovies = movies.slice(0, 6);

  return (
    <div className="relative w-full h-[85vh] overflow-hidden group">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {featuredMovies.map((movie) => {
            const backdropUrl = movie.backdrop_path
              ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
              : null;
            const posterUrl = movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : null;
            const isFavorite = favorites.some((m) => m.id === movie.id);

            return (
              <div key={movie.id} className="relative flex-[0_0_100%] min-w-0 h-full overflow-hidden">
                {/* Blurred Darkened Background */}
                {backdropUrl && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl brightness-[0.25] transition-transform duration-1000 group-hover:scale-125"
                    style={{ backgroundImage: `url(${backdropUrl})` }}
                  />
                )}
                
                {/* Sophisticated Gradient Overlay - Dark edges, softer center */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
                <div className="absolute inset-0 bg-linear-to-r from-background via-transparent to-background/40" />
                <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />

                <div className="relative h-full max-w-7xl mx-auto px-4 md:px-10 flex flex-col md:flex-row items-center justify-between gap-10 py-12 md:py-0">
                  
                  {/* Content Area (Text & CTAs) */}
                  <div className="flex-1 text-left rtl:text-right z-10 animate-in fade-in slide-in-from-left-12 duration-1000">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] md:text-xs font-black tracking-[0.2em] uppercase mb-4 md:mb-8">
                      {t('home.featured')} &nbsp;•&nbsp; {movie.vote_average.toFixed(1)}
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 md:mb-8 leading-[0.95] tracking-tight max-w-2xl drop-shadow-2xl">
                      {movie.title}
                    </h1>

                    <div className="flex items-center gap-4 text-white/70 text-sm md:text-base font-bold mb-8 md:mb-10">
                      <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 shadow-sm">{movie.release_date?.slice(0, 4)}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 shadow-sm">⭐ {movie.vote_average.toFixed(1)}</span>
                    </div>

                    <p className="text-white/60 text-base md:text-xl leading-relaxed mb-10 md:mb-12 max-w-lg line-clamp-2 font-medium drop-shadow-md">
                      {movie.overview}
                    </p>

                    <div className="flex flex-wrap items-center gap-5">
                      <Button
                        onClick={() => navigate(`/movie/${movie.id}`)}
                        className="px-10 py-7 rounded-full bg-primary text-primary-foreground font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/40 text-xs"
                      >
                        <Play className="w-5 h-5 fill-current" /> {t('common.viewDetails')}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={(e) => toggleFavorite(e, movie)}
                        className={`px-10 py-7 rounded-full font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 border-2 text-xs ${
                          isFavorite
                            ? "bg-white text-black border-white hover:bg-white/90"
                            : "bg-white/5 text-white border-white/20 hover:border-white hover:bg-white/10 backdrop-blur-sm"
                        }`}
                      >
                        {isFavorite ? <Check className="w-5 h-5" /> : <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />}
                        {isFavorite ? t('wishlist.inWishlist') || 'In Wishlist' : t('common.addToWishlist')}
                      </Button>
                    </div>
                  </div>

                  {/* Poster Card Area */}
                  <div className="hidden md:flex flex-1 justify-end items-center z-10 animate-in fade-in slide-in-from-right-16 duration-1000 delay-300">
                    <div className="relative group/poster transition-transform duration-700 hover:-translate-y-6 hover:scale-105">
                      {/* Poster Glow */}
                      <div className="absolute -inset-2 bg-primary/40 rounded-[2.5rem] blur-3xl group-hover/poster:bg-primary/60 transition-colors duration-700 opacity-50 group-hover/poster:opacity-80" />
                      
                      {/* Crisp Poster Image */}
                      <div className="relative w-72 lg:w-85 aspect-[2/3] rounded-[2rem] overflow-hidden border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        {posterUrl ? (
                          <img
                            src={posterUrl}
                            alt={movie.title}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover/poster:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-muted-foreground">No Poster</span>
                          </div>
                        )}
                        {/* Glass Overlay on Poster */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-1.5 transition-all duration-500 rounded-full ${
              selectedIndex === index ? "w-8 bg-primary" : "w-2 bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Activate Windows Watermark */}
      <div className="absolute bottom-6 right-6 pointer-events-none select-none z-50 opacity-30 text-left rtl:text-right">
        <p className="text-[11px] font-normal text-white/70 leading-tight tracking-tight">
          Activate Windows
        </p>
        <p className="text-[10px] font-normal text-white/50 tracking-tight">
          Go to Settings to activate Windows.
        </p>
      </div>
    </div>
  );
}


export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const { movies: nowPlaying, totalPages, loading: loadingNow, error } = useNowPlaying(page, selectedGenre, sortBy);
  const { movies: popular, loading: loadingPopular } = usePopularMovies();
  const { movies: topRated, loading: loadingTop } = useTopRated();
  const { tvShows: popularTV, loading: loadingTV } = usePopularTV();
  const { genres } = useGenres();

  const heroMovie = topRated[0] || null;

  function handleGenreClick(genreId) {
    setSelectedGenre((prev) => (prev === genreId ? null : genreId));
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">

      {/* Hero Section */}
      <HeroSection movies={topRated} loading={loadingTop} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Popular Movie Row */}
        <MovieRow title={t('home.popularNow')} movies={popular} loading={loadingPopular} />

        {/* Popular TV Row */}
        <MovieRow title={`${t('home.popularNow')} ${t('nav.tv')}`} movies={popularTV} loading={loadingTV} />

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