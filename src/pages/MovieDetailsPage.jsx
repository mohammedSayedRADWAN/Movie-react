import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
    Star, 
    Clock, 
    Calendar, 
    Play, 
    Plus, 
    Share2, 
    ArrowLeft,
    ShieldAlert,
    UserCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const MovieDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock data for a horror movie theme
    const movie = {
        title: "The Sobrenatural Initiation",
        tagline: "Some doors should never be opened.",
        rating: "8.4",
        year: "2026",
        duration: "2h 14m",
        genre: ["Horror", "Mystery", "Thriller"],
        synopsis: "When a group of architecture students discovers a sealed chamber in the basement of a 19th-century mental asylum, they unwittingly trigger a series of events that blur the line between the physical world and the supernatural realm. As the initiation begins, they must solve the building's darkest secret or become part of its history forever.",
        director: "E. L. Dash",
        cast: [
            { name: "John Weaver", role: "Alex", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John" },
            { name: "Sarah Thorne", role: "Elena", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
            { name: "Marcus Vane", role: "Professor Silas", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" },
        ],
        backdrop: "/movie_banner.jpg"
    };

    return (
        <div className="min-h-screen bg-[#050000] text-white -m-4">
            {/* Hero Section */}
            <div className="relative h-[70vh] w-full overflow-hidden">
                <img 
                    src={movie.backdrop} 
                    className="w-full h-full object-cover opacity-60"
                    alt={movie.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050000] via-[#050000]/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 w-full p-8 lg:p-16 space-y-6">
                    <Button 
                        variant="ghost" 
                        className="text-red-500 hover:text-red-400 p-0 h-auto gap-2"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="w-5 h-5" /> Back to Movies
                    </Button>
                    
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <Badge className="bg-red-600 hover:bg-red-700 text-white border-none px-3 py-1">Featured</Badge>
                            <span className="flex items-center gap-1 text-yellow-500 font-bold">
                                <Star className="w-4 h-4 fill-current" /> {movie.rating}
                            </span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic">{movie.title}</h1>
                        <p className="text-xl text-red-200/70 italic font-medium">"{movie.tagline}"</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-gray-400">
                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {movie.year}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {movie.duration}</span>
                        <div className="flex gap-2">
                            {movie.genre.map(g => (
                                <span key={g} className="px-2 py-0.5 border border-red-900/50 rounded-md text-[10px] uppercase tracking-widest">{g}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="max-w-7xl mx-auto px-8 lg:px-16 py-12 grid lg:grid-cols-3 gap-12">
                
                {/* Left Column: Synopsis & Action */}
                <div className="lg:col-span-2 space-y-10">
                    <section className="space-y-4">
                        <h3 className="text-2xl font-bold border-l-4 border-red-600 pl-4">Synopsis</h3>
                        <p className="text-lg text-gray-300 leading-relaxed">
                            {movie.synopsis}
                        </p>
                    </section>

                    <div className="flex flex-wrap gap-4">
                        <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 h-12 text-lg font-bold shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                            <Play className="w-5 h-5 mr-2 fill-current" /> Watch Now
                        </Button>
                        <Button variant="outline" className="border-red-900/50 hover:bg-red-950/30 text-white rounded-full px-8 h-12">
                            <Plus className="w-5 h-5 mr-2" /> Add to List
                        </Button>
                        <Button variant="ghost" className="text-gray-400 hover:text-white rounded-full w-12 h-12 p-0">
                            <Share2 className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Cast Section */}
                    <section className="space-y-6">
                        <h3 className="text-2xl font-bold border-l-4 border-red-600 pl-4">Lead Cast</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                            {movie.cast.map(person => (
                                <div key={person.name} className="group cursor-pointer">
                                    <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 border border-red-900/20">
                                        <img src={person.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={person.name} />
                                        <div className="absolute inset-0 bg-red-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <p className="font-bold text-white group-hover:text-red-500 transition-colors">{person.name}</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-tighter">{person.role}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column: Info Sidebar */}
                <div className="space-y-8">
                    <Card className="bg-[#1a0505]/40 border-red-900/30 text-white backdrop-blur-sm">
                        <CardContent className="p-8 space-y-6">
                            <div>
                                <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Director</h4>
                                <p className="text-xl font-medium">{movie.director}</p>
                            </div>
                            <div className="pt-4 border-t border-red-900/20">
                                <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Parental Guidance</h4>
                                <div className="flex items-center gap-2">
                                    <ShieldAlert className="w-5 h-5 text-yellow-500" />
                                    <span className="text-sm font-semibold">Rated R for intense horror</span>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-red-900/20">
                                <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-2">Original Studio</h4>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <UserCircle2 className="w-6 h-6" />
                                    <span className="font-bold">ITI Crimson Studios</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-8 rounded-3xl bg-gradient-to-br from-red-950/20 to-transparent border border-red-900/10">
                        <h4 className="text-lg font-bold mb-4">You might also like</h4>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex gap-4 items-center group cursor-pointer">
                                    <div className="w-16 h-16 rounded-xl bg-red-950/50 flex-shrink-0 overflow-hidden">
                                        <div className="w-full h-full bg-gradient-to-br from-red-600/20 to-[#050000]" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm group-hover:text-red-500 transition-colors line-clamp-1">Dark Initiation {i}</p>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Horror • 202{i}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetailsPage;
