import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePopularTV } from '@/hooks/usePopularTV';
import { SkeletonCard } from '@/components/MovieRow';
import { Button } from '@/components/ui/button';
import { Play, ListFilter } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';

const SORT_OPTIONS = [
  { id: 'popularity.desc', label: 'popularity' },
  { id: 'vote_average.desc', label: 'rating' },
  { id: 'first_air_date.desc', label: 'newest' },
];

export default function PopularTVPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const sortBy = searchParams.get('sort_by') || 'popularity.desc';
  
  const { tvShows, loading, error, totalPages } = usePopularTV(page, sortBy);

  const handleSortChange = (newSort) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort_by', newSort);
    params.set('page', '1');
    setSearchParams(params);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const urlPage = parseInt(searchParams.get('page'));
    if (urlPage && urlPage !== page) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPage(urlPage);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 rounded-full bg-primary" />
              <h1 className="text-3xl md:text-5xl font-black text-foreground uppercase tracking-tight">
                {t('nav.tv')}
              </h1>
            </div>
            <p className="text-muted-foreground font-medium text-lg">
              {t('home.popularNow')} {t('nav.tv')}
            </p>
          </div>

          {/* Sorting Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-card/50 p-2 rounded-2xl border border-border/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 px-3 text-muted-foreground">
              <ListFilter className="w-4 h-4" />
              <span className="text-sm font-bold uppercase tracking-wider whitespace-nowrap">
                {t('common.sortBy')}:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((option) => (
                <Button
                  key={option.id}
                  variant={sortBy === option.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSortChange(option.id)}
                  className={`rounded-full px-5 font-bold transition-all duration-300 ${
                    sortBy === option.id 
                      ? 'shadow-lg shadow-primary/20 scale-105' 
                      : 'hover:border-primary/50'
                  }`}
                  aria-selected={sortBy === option.id}
                >
                  {t(`common.${option.label}`)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-20 text-destructive bg-destructive/10 rounded-2xl border border-destructive/20 max-w-2xl mx-auto">
            <p className="text-lg font-bold mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>{t('common.error')}</Button>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
            : tvShows.map((show) => (
                <div 
                  key={show.id} 
                  className="relative group rounded-xl overflow-hidden cursor-pointer bg-card border border-border shadow-xl transition-all duration-300 hover:shadow-primary/10" 
                  onClick={() => navigate(`/tv/${show.id}`)}
                >
                  <img
                    src={show.poster_path ? `${import.meta.env.VITE_TMDB_IMAGE_URL}${show.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                    alt={show.title}
                    className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-left rtl:text-right">
                    <h3 className="text-foreground font-bold text-sm mb-1 line-clamp-2">{show.title}</h3>
                    <div className="flex items-center gap-1 mb-3">
                      <span className="text-yellow-400 text-xs">⭐</span>
                      <span className="text-foreground text-xs font-bold">{show.vote_average.toFixed(1)}</span>
                      <span className="text-muted-foreground text-xs ml-2">{show.release_date?.slice(0, 4)}</span>
                    </div>
                    <Button
                      size="sm"
                      className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                    >
                      <Play className="w-3 h-3 mr-2 fill-current" /> {t('common.viewDetails')}
                    </Button>
                  </div>
                </div>
              ))
          }
        </div>

        {/* Empty State */}
        {!loading && tvShows.length === 0 && !error && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No TV shows found.</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && tvShows.length > 0 && (
          <div className="flex flex-wrap justify-center items-center gap-4 mt-12">
            <Button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              variant="outline"
              className="px-8 py-6 rounded-full font-bold uppercase tracking-widest border-2 transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-50"
            >
              ← {t('common.prev')}
            </Button>
            
            <div className="flex items-center gap-2 bg-muted/50 px-6 py-3 rounded-full border border-border">
              <span className="text-muted-foreground text-xs font-black uppercase tracking-tighter">{t('common.page')}</span>
              <span className="text-foreground font-black text-lg">{page}</span>
              <span className="text-muted-foreground text-xs font-black uppercase tracking-tighter">{t('common.of')} {totalPages}</span>
            </div>

            <Button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              variant="outline"
              className="px-8 py-6 rounded-full font-bold uppercase tracking-widest border-2 transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-50"
            >
              {t('common.next')} →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
