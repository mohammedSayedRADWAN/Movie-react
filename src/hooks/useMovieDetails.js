import { useState, useEffect } from 'react';
import tmdb from '@/services/tmdb';

export function useMovieDetails(id, mediaType = 'movie') {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchDetails() {
      try {
        setLoading(true);
        setError(null);
        const response = await tmdb.get(`/${mediaType}/${id}`);
        setMovie(response.data);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError(`Failed to load ${mediaType} details.`);
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [id, mediaType]);

  return { movie, loading, error };
}