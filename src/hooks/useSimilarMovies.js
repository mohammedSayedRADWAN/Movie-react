import { useState, useEffect } from 'react';
import tmdb from '@/services/tmdb';

export function useSimilarMovies(id) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchSimilar() {
      try {
        setLoading(true);
        setError(null);
        const response = await tmdb.get(`/movie/${id}/similar`);
        setMovies(response.data.results);
      } catch (err) {
        setError('Failed to load similar movies.');
      } finally {
        setLoading(false);
      }
    }

    fetchSimilar();
  }, [id]);

  return { movies, loading, error };
}
