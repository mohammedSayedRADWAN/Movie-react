import { useState, useEffect } from 'react';
import tmdb from '@/services/tmdb';

export function useMovieVideos(id) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchVideos() {
      try {
        setLoading(true);
        setError(null);
        const response = await tmdb.get(`/movie/${id}/videos`);
        setVideos(response.data.results);
      } catch (err) {
        setError('Failed to load videos.');
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, [id]);

  return { videos, loading, error };
}
