import { useState, useEffect } from 'react';
import tmdb from '@/services/tmdb';

export function useMovieVideos(id, mediaType = 'movie') {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchVideos() {
      try {
        setLoading(true);
        setError(null);
        const response = await tmdb.get(`/${mediaType}/${id}/videos`);
        setVideos(response.data.results);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError(`Failed to load ${mediaType} videos.`);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, [id, mediaType]);

  return { videos, loading, error };
}