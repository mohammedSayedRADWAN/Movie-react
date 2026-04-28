import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import tmdb from '@/services/tmdb';
import { MovieCard } from '@/components/MovieRow';

export default function SearchResultsPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('query') || '';
  const page = Number(searchParams.get('page')) || 1;
  const debouncedQuery = useDebounce(query, 500);

  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setMovies([]);
      setTotalPages(0);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await tmdb.get('/search/movie', {
          params: {
            query: debouncedQuery,
            page,
          },
        });

        setMovies(response.data.results || []);
        setTotalPages(response.data.total_pages || 0);
      } catch (err) {
        console.error('Search Error:', err);
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedQuery, page, t]);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  useEffect(() => {
    const currentPage = searchParams.get('page');

    if (debouncedQuery && currentPage !== '1') {
      const params = new URLSearchParams(searchParams);
      params.set('page', '1');
      setSearchParams(params);
    }
  }, [debouncedQuery]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2 bg-primary rounded-lg">
            <Search className="w-8 h-8 text-primary-foreground" />
          </div>

          <h1 className="text-3xl font-black tracking-tight">
            {t('common.search')}:{' '}
            <span className="text-primary italic">
              "{query}"
            </span>
          </h1>
        </div>

        {/* Error */}
        {error && (
          <div className="text-center py-6 mb-8 rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && movies.length === 0 && query && (
          <div className="text-center py-24 bg-muted/20 rounded-3xl border border-border/50">
            <div className="text-6xl mb-6 opacity-30">🎬</div>
            <h3 className="text-2xl font-bold mb-2">
              No movies found
            </h3>
            <p className="text-muted-foreground">
              Try searching for something else
            </p>
          </div>
        )}

        {/* Movies */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10">
          {loading
            ? Array.from({ length: 15 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            : movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                />
              ))}
        </div>

        {/* Pagination */}
        {!loading && !error && movies.length > 0 && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-16 py-8 border-t border-border">
            <Button
              variant="outline"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
            >
              ← {t('common.prev')}
            </Button>

            <span className="text-muted-foreground">
              {t('common.page')}{' '}
              <span className="font-bold text-foreground">
                {page}
              </span>{' '}
              {t('common.of')} {totalPages}
            </span>

            <Button
              variant="outline"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
            >
              {t('common.next')} →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}