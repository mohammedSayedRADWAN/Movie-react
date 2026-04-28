import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePopularTV } from '@/hooks/usePopularTV';
import { SkeletonCard } from '@/components/MovieRow';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function PopularTVPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { tvShows, loading, error, totalPages } = usePopularTV(page);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 rounded-full bg-primary" />
            <h1 className="text-3xl md:text-4xl font-black text-foreground uppercase tracking-tight">
              {t('nav.tv')}
            </h1>
          </div>
          <p className="text-muted-foreground font-medium">
            {t('home.popularNow')} {t('nav.tv')}
          </p>
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
              onClick={() => {
                setPage((p) => p - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
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
              onClick={() => {
                setPage((p) => p + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
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
