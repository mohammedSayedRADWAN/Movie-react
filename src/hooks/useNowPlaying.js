import { useState, useEffect } from 'react';
import tmdb from '@/services/tmdb';

export function useNowPlaying(page = 1, genreId = null, sortBy = null) {
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        setError(null);

        let response;

        if (genreId || sortBy) {
          // If genre or sort selected, use discover endpoint
          response = await tmdb.get('/discover/movie', {
            params: {
              page,
              with_genres: genreId || undefined,
              sort_by: sortBy || 'popularity.desc',
            },
          });
        } else {
          // Default: now playing
          response = await tmdb.get('/movie/now_playing', {
            params: { page },
          });
        }

        setMovies(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (err) {
        setError('Failed to load movies.');
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [page, genreId, sortBy]);

  return { movies, totalPages, loading, error };
}