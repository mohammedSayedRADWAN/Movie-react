import { useState, useEffect } from 'react';
import tmdb from '@/services/tmdb';

export function usePopularTV(page = 1) {
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    async function fetchPopularTV() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await tmdb.get('/tv/popular', {
          params: {
            page,
            language: document.documentElement.lang || 'en',
          },
        });

        // Normalize TV data to match Movie structure for easier rendering
        const normalizedData = response.data.results.map((show) => ({
          ...show,
          title: show.name, // TV shows use 'name' instead of 'title'
          release_date: show.first_air_date, // TV shows use 'first_air_date'
          media_type: 'tv',
        }));

        setTvShows(normalizedData);
        setTotalPages(Math.min(response.data.total_pages, 500)); // TMDB limits to 500 pages
      } catch (err) {
        console.error('Failed to load popular TV shows', err);
        setError('Failed to fetch popular TV shows. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchPopularTV();
  }, [page]);

  return { tvShows, loading, error, totalPages };
}
