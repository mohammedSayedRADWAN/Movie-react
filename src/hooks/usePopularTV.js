import { useState, useEffect } from 'react';
import tmdb from '@/services/tmdb';

export function usePopularTV(page = 1, sortBy = 'popularity.desc') {
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    async function fetchPopularTV() {
      try {
        setLoading(true);
        setError(null);
        
        // Use /discover/tv for advanced sorting, or /tv/popular for the default view
        // Actually /discover/tv with popularity.desc is equivalent to /tv/popular
        const endpoint = sortBy ? '/discover/tv' : '/tv/popular';
        const response = await tmdb.get(endpoint, {
          params: {
            page,
            sort_by: sortBy,
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
        console.error('Failed to load TV shows', err);
        setError('Failed to fetch TV shows. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchPopularTV();
  }, [page, sortBy]);

  return { tvShows, loading, error, totalPages };
}