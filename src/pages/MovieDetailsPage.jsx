import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
    Star, 
    Clock, 
    Calendar, 
    Play, 
    Plus, 
    Share2, 
    ArrowLeft,
    TrendingUp,
    Users,
    ChevronLeft,
    ChevronRight,
    Video
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from '@/components/ui/dialog';
import { useMovieDetails } from '@/hooks/useMovieDetails';
import { useMovieCredits } from '@/hooks/useMovieCredits';
import { useSimilarMovies } from '@/hooks/useSimilarMovies';
import { useMovieVideos } from '@/hooks/useMovieVideos';
import { MovieRow } from '@/components/MovieRow';

const MovieDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const { movie, loading: loadingMovie, error: movieError } = useMovieDetails(id);
    const { credits } = useMovieCredits(id);
    const { movies: similarMovies, loading: loadingSimilar } = useSimilarMovies(id);
    const { videos } = useMovieVideos(id);

    const [isTrailerOpen, setIsTrailerOpen] = useState(false);
    const castRowRef = useRef(null);

    const scrollCast = (direction) => {
        if (castRowRef.current) {
            const scrollAmount = 600;
            castRowRef.current.scrollBy({ 
                left: direction === 'left' ? -scrollAmount : scrollAmount, 
                behavior: 'smooth' 
            });
        }
    };

    if (loadingMovie) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
                <Skeleton className="w-full h-[60vh] rounded-2xl bg-gray-900" />
                <div className="mt-8 space-y-4">
                    <Skeleton className="w-1/3 h-12 bg-gray-900" />
                    <Skeleton className="w-full h-24 bg-gray-900" />
                </div>
            </div>
        );
    }

    if (movieError || !movie) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white p-4">
                <h2 className="text-2xl font-bold mb-4">Oops! Movie not found.</h2>
                <Button onClick={() => navigate('/')} style={{ backgroundColor: '#e50914' }}>
                    Back to Home
                </Button>
            </div>
        );
    }

    // Find first YouTube trailer
    const trailer = videos?.find(v => v.type === 'Trailer' && v.site === 'YouTube') || videos?.[0];

    const backdropUrl = movie.backdrop_path 
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` 
        : null;
    const posterUrl = movie.poster_path 
        ? `${import.meta.env.VITE_TMDB_IMAGE_URL}${movie.poster_path}` 
        : 'https://via.placeholder.com/500x750?text=No+Poster';

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white -m-4">
            {/* Hero Section */}
            <div className="relative h-[80vh] w-full overflow-hidden">
                {backdropUrl && (
                    <img 
                        src={backdropUrl} 
                        className="w-full h-full object-cover"
                        alt={movie.title} 
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-20 flex flex-col md:flex-row gap-8 items-end md:items-start text-left">
                    <div className="hidden md:block w-64 rounded-xl overflow-hidden shadow-2xl border border-white/10 shrink-0 transform -translate-y-12">
                        <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 space-y-6">
                        <Button 
                            variant="ghost" 
                            className="text-white hover:text-red-500 p-0 h-auto gap-2 transition-colors"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft className="w-5 h-5" /> Back
                        </Button>
                        
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <Badge className="bg-[#e50914] text-white border-none px-3 py-1 text-xs">
                                    <TrendingUp className="w-3 h-3 mr-1" /> Trending
                                </Badge>
                                <span className="flex items-center gap-1 text-yellow-400 font-bold">
                                    <Star className="w-4 h-4 fill-current" /> {movie.vote_average.toFixed(1)}
                                </span>
                                <span className="text-gray-400 text-sm">• {movie.vote_count} votes</span>
                            </div>
                            
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">{movie.title}</h1>
                            {movie.tagline && (
                                <p className="text-xl text-gray-400 italic">"{movie.tagline}"</p>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-gray-300">
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-red-500" /> {movie.release_date?.slice(0, 4)}</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-red-500" /> {movie.runtime} min</span>
                            <div className="flex flex-wrap gap-2">
                                {movie.genres?.map(genre => (
                                    <span key={genre.id} className="px-3 py-1 bg-white/10 rounded-full text-xs hover:bg-white/20 transition-colors">
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Dialog open={isTrailerOpen} onOpenChange={setIsTrailerOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-[#e50914] hover:bg-red-700 text-white rounded-full px-8 h-12 text-md font-bold transition-all transform hover:scale-105">
                                        <Play className="w-5 h-5 mr-2 fill-current" /> Watch Trailer
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl bg-black/95 border-white/10 p-0 overflow-hidden sm:max-w-4xl">
                                    <DialogHeader className="p-4 bg-[#0a0a0a]">
                                        <DialogTitle className="text-white flex items-center gap-2">
                                            <Video className="w-5 h-5 text-red-600" /> {movie.title} - Official Trailer
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="aspect-video w-full">
                                        {trailer ? (
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                                                title="YouTube video player"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                                                <Video className="w-12 h-12" />
                                                <p>Trailer not available at the moment.</p>
                                            </div>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white rounded-full px-8 h-12">
                                <Plus className="w-5 h-5 mr-2" /> Add to List
                            </Button>
                            <Button variant="ghost" className="text-gray-400 hover:text-white rounded-full w-12 h-12 p-0 border border-white/10">
                                <Share2 className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 space-y-20">
                
                {/* Overview */}
                <section className="grid lg:grid-cols-3 gap-12 text-left">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-8 bg-[#e50914] rounded-full" />
                            <h3 className="text-2xl font-bold">Synopsis</h3>
                        </div>
                        <p className="text-lg text-gray-300 leading-relaxed max-w-4xl">
                            {movie.overview}
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                <span className="text-gray-400 text-sm">Status</span>
                                <span className="font-semibold text-green-500">{movie.status}</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                <span className="text-gray-400 text-sm">Release Date</span>
                                <span className="font-semibold">{movie.release_date}</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                <span className="text-gray-400 text-sm">Budget</span>
                                <span className="font-semibold">${(movie.budget / 1000000).toFixed(1)}M</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Revenue</span>
                                <span className="font-semibold">${(movie.revenue / 1000000).toFixed(1)}M</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Cast Section */}
                <section className="space-y-8 text-left">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-8 bg-[#e50914] rounded-full" />
                            <h3 className="text-2xl font-bold">Top Cast</h3>
                            <Badge variant="outline" className="ml-2 border-white/20 text-gray-400">
                                <Users className="w-3 h-3 mr-1" /> {credits?.cast?.length || 0} Members
                            </Badge>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => scrollCast('left')}
                                className="p-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => scrollCast('right')}
                                className="p-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    
                    <div 
                        ref={castRowRef}
                        className="flex gap-6 overflow-x-auto pb-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {credits?.cast?.slice(0, 15).map(person => (
                            <div key={person.id} className="group shrink-0 w-32 md:w-40">
                                <div className="aspect-[2/3] rounded-2xl overflow-hidden mb-3 border border-white/5 bg-gray-900 shadow-xl">
                                    <img 
                                        src={person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${person.name}`} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                        alt={person.name} 
                                    />
                                </div>
                                <p className="font-bold text-sm text-white line-clamp-1 group-hover:text-red-500 transition-colors uppercase">{person.name}</p>
                                <p className="text-xs text-gray-500 line-clamp-1">{person.character}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Similar Movies Row */}
                <section className="text-left">
                    <MovieRow 
                        title="More Like This" 
                        movies={similarMovies} 
                        loading={loadingSimilar} 
                    />
                </section>
            </div>
        </div>
    );
};

export default MovieDetailsPage;
