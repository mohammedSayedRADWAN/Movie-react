import { useState, useEffect } from 'react';
import tmdb from '@/services/tmdb';

export function useMovieCredits(id, mediaType = 'movie') {
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchCredits() {
      try {
        setLoading(true);
        setError(null);
        const response = await tmdb.get(`/${mediaType}/${id}/credits`);
        setCredits(response.data);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError(`Failed to load ${mediaType} credits.`);
      } finally {
        setLoading(false);
      }
    }

    fetchCredits();
  }, [id, mediaType]);

  return { credits, loading, error };
}