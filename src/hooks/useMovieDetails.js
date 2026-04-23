import { useState, useEffect } from 'react';
import tmdb from '@/services/tmdb';

export function useMovieDetails(id) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchDetails() {
      try {
        setLoading(true);
        setError(null);
        const response = await tmdb.get(`/movie/${id}`);
        setMovie(response.data);
      } catch (err) {
        setError('Failed to load movie details.');
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [id]);

  return { movie, loading, error };
}
