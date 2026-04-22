import { useState, useEffect } from 'react';
import tmdb from '@/services/tmdb';

export function usePopularMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPopular() {
      try {
        const response = await tmdb.get('/movie/popular');
        setMovies(response.data.results);
      } catch (err) {
        console.error('Failed to load popular movies', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPopular();
  }, []);

  return { movies, loading };
}