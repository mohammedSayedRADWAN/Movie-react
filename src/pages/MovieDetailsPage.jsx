import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
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
            const isRtl = document.documentElement.dir === 'rtl';
            const multiplier = isRtl ? -1 : 1;
            const scrollAmount = 600 * multiplier;
            castRowRef.current.scrollBy({ 
                left: direction === 'left' ? -scrollAmount : scrollAmount, 
                behavior: 'smooth' 
            });
        }
    };

    if (loadingMovie) {
        return (
            <div className="min-h-screen bg-background text-foreground p-8">
                <Skeleton className="w-full h-[60vh] rounded-2xl" />
                <div className="mt-8 space-y-4">
                    <Skeleton className="w-1/3 h-12" />
                    <Skeleton className="w-full h-24" />
                </div>
            </div>
        );
    }

    if (movieError || !movie) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground p-4">
                <h2 className="text-2xl font-bold mb-4">{t('common.error')}</h2>
                <Button onClick={() => navigate('/')} className="bg-primary hover:bg-primary/90">
                    {t('movie.back')}
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
        <div className="min-h-screen bg-background text-foreground -m-4 transition-colors duration-300">
            {/* Hero Section */}
            <div className="relative h-[80vh] w-full overflow-hidden">
                {backdropUrl && (
                    <img 
                        src={backdropUrl} 
                        className="w-full h-full object-cover transition-transform duration-10000 hover:scale-110"
                        alt={movie.title} 
                    />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-r from-background via-background/40 to-transparent rtl:bg-linear-to-l" />
                
                <div className="absolute bottom-0 left-0 rtl:left-auto rtl:right-0 w-full p-6 md:p-12 lg:p-20 flex flex-col md:flex-row gap-8 items-end md:items-start text-left rtl:text-right">
                    <div className="hidden md:block w-64 rounded-xl overflow-hidden shadow-2xl border border-border shrink-0 transform -translate-y-12">
                        <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 space-y-6">
                        <Button 
                            variant="ghost" 
                            className="text-foreground hover:text-primary p-0 h-auto gap-2 transition-colors"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft className="w-5 h-5 rtl:rotate-180" /> {t('movie.back')}
                        </Button>
                        
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <Badge className="bg-primary text-primary-foreground border-none px-3 py-1 text-xs">
                                    <TrendingUp className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" /> {t('movie.trending')}
                                </Badge>
                                <span className="flex items-center gap-1 text-yellow-500 font-bold">
                                    <Star className="w-4 h-4 fill-current" /> {movie.vote_average.toFixed(1)}
                                </span>
                                <span className="text-muted-foreground text-sm">• {movie.vote_count} votes</span>
                            </div>
                            
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">{movie.title}</h1>
                            {movie.tagline && (
                                <p className="text-xl text-muted-foreground italic">"{movie.tagline}"</p>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-muted-foreground">
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> {movie.release_date?.slice(0, 4)}</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /> {movie.runtime} {t('movie.runtime')}</span>
                            <div className="flex flex-wrap gap-2">
                                {movie.genres?.map(genre => (
                                    <span key={genre.id} className="px-3 py-1 bg-muted rounded-full text-xs hover:bg-muted/80 transition-colors">
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Dialog open={isTrailerOpen} onOpenChange={setIsTrailerOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 h-12 text-md font-bold transition-all transform hover:scale-105">
                                        <Play className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0 fill-current" /> {t('movie.watchTrailer')}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl bg-background border-border p-0 overflow-hidden sm:max-w-4xl">
                                    <DialogHeader className="p-4 bg-muted">
                                        <DialogTitle className="text-foreground flex items-center gap-2">
                                            <Video className="w-5 h-5 text-primary" /> {movie.title} - Official Trailer
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
                                            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-4">
                                                <Video className="w-12 h-12" />
                                                <p>{t('movie.trailerNotAvailable')}</p>
                                            </div>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <Button variant="outline" className="border-border hover:bg-muted text-foreground rounded-full px-8 h-12">
                                <Plus className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" /> {t('movie.addToList')}
                             </Button>
                             <Button variant="ghost" className="text-muted-foreground hover:text-foreground rounded-full w-12 h-12 p-0 border border-border">
                                <Share2 className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 space-y-20">
                
                {/* Overview */}
                <section className="grid lg:grid-cols-3 gap-12 text-left rtl:text-right">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-8 bg-primary rounded-full" />
                            <h3 className="text-2xl font-bold">{t('movie.synopsis')}</h3>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl">
                            {movie.overview}
                        </p>
                    </div>

                    <div className="bg-muted/50 border border-border rounded-3xl p-8 space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b border-border">
                                <span className="text-muted-foreground text-sm">{t('movie.status')}</span>
                                <span className="font-semibold text-green-500">{movie.status}</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-border">
                                <span className="text-muted-foreground text-sm">{t('movie.releaseDate')}</span>
                                <span className="font-semibold">{movie.release_date}</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-border">
                                <span className="text-muted-foreground text-sm">{t('movie.budget')}</span>
                                <span className="font-semibold">${(movie.budget / 1000000).toFixed(1)}M</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground text-sm">{t('movie.revenue')}</span>
                                <span className="font-semibold">${(movie.revenue / 1000000).toFixed(1)}M</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Cast Section */}
                <section className="space-y-8 text-left rtl:text-right">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-8 bg-primary rounded-full" />
                            <h3 className="text-2xl font-bold">{t('movie.topCast')}</h3>
                            <Badge variant="outline" className="ml-2 rtl:mr-2 rtl:ml-0 border-border text-muted-foreground">
                                <Users className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" /> {credits?.cast?.length || 0} {t('movie.members')}
                            </Badge>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => scrollCast('left')}
                                className="p-2 rounded-full border border-border text-foreground hover:bg-muted transition-all rotate-0 rtl:rotate-180"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => scrollCast('right')}
                                className="p-2 rounded-full border border-border text-foreground hover:bg-muted transition-all rotate-0 rtl:rotate-180"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    
                    <div 
                        ref={castRowRef}
                        className="flex gap-6 overflow-x-auto pb-4 no-scrollbar"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {credits?.cast?.slice(0, 15).map(person => (
                            <div key={person.id} className="group shrink-0 w-32 md:w-40">
                                <div className="aspect-[2/3] rounded-2xl overflow-hidden mb-3 border border-border bg-muted shadow-xl">
                                    <img 
                                        src={person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${person.name}`} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                        alt={person.name} 
                                    />
                                </div>
                                <p className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors uppercase">{person.name}</p>
                                <p className="text-xs text-muted-foreground line-clamp-1">{person.character}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Similar Movies Row */}
                <section className="text-left rtl:text-right">
                    <MovieRow 
                        title={t('movie.moreLikeThis')} 
                        movies={similarMovies} 
                        loading={loadingSimilar} 
                    />
                </section>
            </div>
        </div>
    );
};

export default MovieDetailsPage;
