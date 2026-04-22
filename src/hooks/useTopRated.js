import { useState, useEffect } from 'react';
import tmdb from '@/services/tmdb';

export function useTopRated() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopRated() {
      try {
        const response = await tmdb.get('/movie/top_rated');
        setMovies(response.data.results);
      } catch (err) {
        console.error('Failed to load top rated movies', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTopRated();
  }, []);

  return { movies, loading };
}