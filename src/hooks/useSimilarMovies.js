import { useState, useEffect } from 'react';
import tmdb from '@/services/tmdb';

export function useSimilarMovies(id, mediaType = 'movie') {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchSimilar() {
      try {
        setLoading(true);
        setError(null);
        const response = await tmdb.get(`/${mediaType}/${id}/similar`);
        
        let results = response.data.results;
        if (mediaType === 'tv') {
          results = results.map(item => ({
            ...item,
            title: item.name,
            release_date: item.first_air_date,
            media_type: 'tv'
          }));
        }

        setMovies(results);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError(`Failed to load similar ${mediaType}s.`);
      } finally {
        setLoading(false);
      }
    }

    fetchSimilar();
  }, [id, mediaType]);

  return { movies, loading, error };
}