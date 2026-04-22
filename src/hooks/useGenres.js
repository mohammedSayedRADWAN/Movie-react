import { useState, useEffect } from 'react';
import tmdb from '@/services/tmdb';

export function useGenres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGenres() {
      try {
        const response = await tmdb.get('/genre/movie/list');
        setGenres(response.data.genres);
      } catch (err) {
        console.error('Failed to load genres', err);
      } finally {
        setLoading(false);
      }
    }
    fetchGenres();
  }, []);

  return { genres, loading };
}