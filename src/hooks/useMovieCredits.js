import { useState, useEffect } from 'react';
import tmdb from '@/services/tmdb';

export function useMovieCredits(id) {
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchCredits() {
      try {
        setLoading(true);
        setError(null);
        const response = await tmdb.get(`/movie/${id}/credits`);
        setCredits(response.data);
      } catch (err) {
        setError('Failed to load credits.');
      } finally {
        setLoading(false);
      }
    }

    fetchCredits();
  }, [id]);

  return { credits, loading, error };
}
