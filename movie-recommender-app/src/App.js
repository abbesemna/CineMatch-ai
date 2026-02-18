import React, { useState, useEffect, useRef } from 'react';
import { Film, Sparkles, TrendingUp, Star, Calendar, Search, X, Loader2, MessageCircle, Send, ChevronLeft, ChevronRight } from 'lucide-react';

// Genre ID to name mapping
const GENRE_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
};

// Mood to genre mapping - IMPROVED FOR BETTER FILTERING
const MOOD_TO_GENRES = {
  happy: { positive: [35, 16, 10751], negative: [27, 53, 80, 18] },      // Comedy, Animation, Family - NO horror, thriller, crime, drama
  sad: { positive: [18, 10749], negative: [28, 27, 35, 53] },             // Drama, Romance - NO action, horror, comedy, thriller
  excited: { positive: [28, 12, 878], negative: [18] },                   // Action, Adventure, Sci-Fi - NO drama
  relaxed: { positive: [35, 10751, 16, 14], negative: [27, 53, 80] },     // Comedy, Family, Animation, Fantasy - NO horror, thriller, crime
  scared: { positive: [27, 53], negative: [35, 10751, 16] },              // Horror, Thriller - NO comedy, family, animation
  romantic: { positive: [10749], negative: [80, 27, 28, 53] },            // Romance - NO crime, horror, action, thriller
  thoughtful: { positive: [18, 99, 36], negative: [28, 27, 35] },         // Drama, Documentary, History - NO action, horror, comedy
  adventurous: { positive: [12, 14, 878], negative: [18, 80] }            // Adventure, Fantasy, Sci-Fi - NO drama, crime
};

const MOVIES_PER_PAGE = 50;

function App() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [displayedMovies, setDisplayedMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMood, setSelectedMood] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load movies data from CSV - LOAD ALL 10K
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/movies_dataset.csv');
        const csvText = await response.text();

        const lines = csvText.split('\n');
        const moviesData = [];
        const seenIds = new Set();

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;

          const values = parseCSVLine(lines[i]);
          if (values.length < 14) continue;

          try {
            const movieId = parseInt(values[3]) || i;

            // Skip duplicates
            if (seenIds.has(movieId)) continue;
            seenIds.add(movieId);

            const movie = {
              id: movieId,
              title: values[10] || 'Untitled',
              overview: values[6] || 'No description available',
              genre_ids: parseGenreIds(values[2]),
              vote_average: parseFloat(values[12]) || 0,
              vote_count: parseInt(values[13]) || 0,
              popularity: parseFloat(values[7]) || 0,
              release_date: values[9] || '',
              poster_path: values[8] || '',
              original_language: values[4] || 'en'
            };

            if (movie.title && movie.title !== 'Untitled' && movie.title.length > 0) {
              moviesData.push(movie);
            }
          } catch (e) {
            continue;
          }
        }

        console.log('✅ Loaded movies:', moviesData.length);
        setMovies(moviesData);
        setFilteredMovies(moviesData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading movies:', error);
        setIsLoading(false);
      }
    };

    loadMovies();
  }, []);

  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  };

  const parseGenreIds = (genreStr) => {
    try {
      genreStr = genreStr.replace(/"/g, '');
      const match = genreStr.match(/\[(.*?)\]/);
      if (match) {
        return match[1].split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      }
      return [];
    } catch {
      return [];
    }
  };

  const getMoodPositiveGenres = (mood) => {
    const info = MOOD_TO_GENRES[mood];
    if (!info) return [];
    return info.positive || [];
  };

  // ENHANCED SEARCH AND FILTER - Searches ALL movies
  useEffect(() => {
    if (!movies.length) return;

    let filtered = [...movies];

    // Apply mood filter - IMPROVED
    if (selectedMood) {
      const moodConfig = MOOD_TO_GENRES[selectedMood];
      if (moodConfig) {
        filtered = filtered.filter(movie => {
          if (!movie.genre_ids || movie.genre_ids.length === 0) return false;

          // Check if movie has ANY negative genres - exclude it
          const hasNegativeGenre = movie.genre_ids.some(id => moodConfig.negative.includes(id));
          if (hasNegativeGenre) return false;

          // Check if movie has AT LEAST ONE positive genre
          const hasPositiveGenre = movie.genre_ids.some(id => moodConfig.positive.includes(id));
          return hasPositiveGenre;
        });
      }
    }

    // ENHANCED SEARCH - searches title, overview, and genres (case-insensitive)
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(movie => {
        const titleLower = movie.title.toLowerCase();
        const titleMatch = titleLower.includes(query);
        const overviewMatch = movie.overview.toLowerCase().includes(query);
        const genreMatch = movie.genre_ids.some(id => {
          const genreName = GENRE_MAP[id];
          return genreName && genreName.toLowerCase().includes(query);
        });
        const yearMatch = movie.release_date && movie.release_date.includes(query);

        // Weight title matches higher - prioritize movies where title starts with query
        return titleMatch || overviewMatch || genreMatch || yearMatch;
      });
    }

    // Sort by relevance and rating
    filtered.sort((a, b) => {
      // If searching, prioritize title matches
      if (searchQuery) {
        const aTitle = a.title.toLowerCase().startsWith(searchQuery.toLowerCase());
        const bTitle = b.title.toLowerCase().startsWith(searchQuery.toLowerCase());
        if (aTitle && !bTitle) return -1;
        if (!aTitle && bTitle) return 1;
      }

      // Then by score
      const scoreA = (a.vote_average * 0.7) + (a.popularity * 0.3 / 100);
      const scoreB = (b.vote_average * 0.7) + (b.popularity * 0.3 / 100);
      return scoreB - scoreA;
    });

    setFilteredMovies(filtered);
    setCurrentPage(1); // Reset to first page on filter change

    console.log(`📊 Filtered: ${filtered.length} movies from ${movies.length} total`);
  }, [selectedMood, searchQuery, movies]);

  // PAGINATION - Update displayed movies when page changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * MOVIES_PER_PAGE;
    const endIndex = startIndex + MOVIES_PER_PAGE;
    setDisplayedMovies(filteredMovies.slice(startIndex, endIndex));
    setTotalPages(Math.ceil(filteredMovies.length / MOVIES_PER_PAGE));

    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filteredMovies, currentPage]);

  // REAL CONVERSATIONAL AI with memory via OpenAI Proxy
  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const newMessage = { role: 'user', content: userMessage };
    setChatMessages(prev => [...prev, newMessage]);
    const currentQuery = userMessage;
    setUserMessage('');
    setIsAiTyping(true);

    try {
      // Call AiML API (Gemma 3n 4B) via the proxy server
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...chatMessages.map(msg => ({
              role: msg.role === 'assistant' ? 'assistant' : 'user',
              content: msg.content
            })),
            { role: 'user', content: currentQuery }
          ],
          temperature: 0.8,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Extract specific message from proxy or AiML error structure
        const specificMessage = errorData.details?.message ||
          errorData.details?.error?.message ||
          errorData.message ||
          `API Error: ${response.status}`;
        throw new Error(specificMessage);
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content ||
        "I'd love to help you find great movies! What kind of mood are you in?";

      setChatMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);

      // Clear previous recommendations and find new ones
      setAiRecommendations([]);

      // Find matching movies from database
      setTimeout(() => {
        findMoviesFromResponse(aiResponse, currentQuery);
      }, 300);

    } catch (error) {
      console.error('AI Error:', error);

      const fallbackResponse = generateFallbackResponse(currentQuery);

      // Check for common error types to provide better guidance
      const errorMessage = error.message.toLowerCase();
      let guidance = 'please ensure the proxy server is running';

      if (errorMessage.includes('limit') || errorMessage.includes('quota') || errorMessage.includes('forbidden')) {
        guidance = 'the API key has reached its limit - please update AIML_API_KEY in .env';
      } else if (errorMessage.includes('key') || errorMessage.includes('auth')) {
        guidance = 'API key issue - please check your .env configuration';
      }

      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: `${fallbackResponse} (Note: ${guidance})`
      }]);

      // Clear and suggest based on context
      setAiRecommendations([]);
      setTimeout(() => {
        suggestBasedOnContext(currentQuery);
      }, 300);
    } finally {
      setIsAiTyping(false);
    }
  };

  // Find movies mentioned in AI response
  const findMoviesFromResponse = (response, query) => {
    // Search for movies in the dataset that are mentioned in the response
    const mentioned = movies.filter(movie => {
      const movieTitleLower = movie.title.toLowerCase();
      const responseLower = response.toLowerCase();
      // Check if title is mentioned in response
      if (responseLower.includes(movieTitleLower)) {
        return true;
      }
      // Check for partial matches (for long titles)
      const titleWords = movieTitleLower.split(' ');
      if (titleWords.length >= 2) {
        const firstTwoWords = titleWords.slice(0, 2).join(' ');
        if (responseLower.includes(firstTwoWords)) {
          return true;
        }
      }
      return false;
    });

    if (mentioned.length > 0) {
      const unique = Array.from(new Set(mentioned.map(m => m.id)))
        .map(id => mentioned.find(m => m.id === id));
      console.log(`✅ Found ${unique.length} movies in dataset from AI response`);
      setAiRecommendations(unique);
    } else {
      console.log('ℹ️ No exact matches found, suggesting by genre/mood');
      suggestBasedOnContext(query);
    }
  };

  const generateFallbackResponse = (query) => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('funny') || lowerQuery.includes('comedy') || lowerQuery.includes('laugh')) {
      return "Great choice! Comedy is perfect for lifting your mood. Let me show you some hilarious options that'll have you laughing out loud!";
    } else if (lowerQuery.includes('scary') || lowerQuery.includes('horror') || lowerQuery.includes('thriller')) {
      return "Ooh, feeling brave! I've got some spine-tingling thrillers and horror films that'll keep you on the edge of your seat!";
    } else if (lowerQuery.includes('action') || lowerQuery.includes('exciting') || lowerQuery.includes('adventure')) {
      return "Action-packed adventures coming right up! These high-energy films will keep your adrenaline pumping!";
    } else if (lowerQuery.includes('romantic') || lowerQuery.includes('love') || lowerQuery.includes('romance')) {
      return "Aww, romance! I've got some beautiful love stories that'll warm your heart. Perfect for a cozy night in!";
    } else if (lowerQuery.includes('sad') || lowerQuery.includes('drama') || lowerQuery.includes('emotional')) {
      return "Sometimes we need a good emotional journey. Here are some powerful dramas that'll really resonate with you.";
    } else if (lowerQuery.includes('different') || lowerQuery.includes('change') || lowerQuery.includes('instead')) {
      return "Sure! Let me switch gears and show you something completely different!";
    } else {
      return "I can help you find the perfect movie! What kind of vibe are you going for tonight?";
    }
  };

  const suggestBasedOnContext = (query) => {
    const lowerQuery = query.toLowerCase();
    let genreIds = [];

    if (lowerQuery.includes('funny') || lowerQuery.includes('comedy') || lowerQuery.includes('laugh')) {
      genreIds = [35, 16];
    } else if (lowerQuery.includes('scary') || lowerQuery.includes('horror') || lowerQuery.includes('thriller')) {
      genreIds = [27, 53];
    } else if (lowerQuery.includes('action') || lowerQuery.includes('exciting') || lowerQuery.includes('adventure')) {
      genreIds = [28, 12, 878];
    } else if (lowerQuery.includes('romantic') || lowerQuery.includes('love') || lowerQuery.includes('romance')) {
      genreIds = [10749, 35];
    } else if (lowerQuery.includes('drama') || lowerQuery.includes('sad') || lowerQuery.includes('emotional')) {
      genreIds = [18];
    } else if (lowerQuery.includes('sci-fi') || lowerQuery.includes('science') || lowerQuery.includes('futur')) {
      genreIds = [878, 14];
    } else if (lowerQuery.includes('family') || lowerQuery.includes('kids')) {
      genreIds = [10751, 16];
    } else if (lowerQuery.includes('mystery') || lowerQuery.includes('detective')) {
      genreIds = [9648, 53];
    }

    if (genreIds.length > 0) {
      const suggestions = movies
        .filter(m => m.genre_ids.some(id => genreIds.includes(id)))
        .sort((a, b) => (b.vote_average * 0.7 + b.popularity * 0.3) - (a.vote_average * 0.7 + a.popularity * 0.3))
        .slice(0, 6);

      setAiRecommendations(suggestions);
    }
  };

  const moods = [
    { id: 'happy', label: 'Happy', gradient: 'from-yellow-400 to-orange-400' },
    { id: 'sad', label: 'Melancholic', gradient: 'from-blue-400 to-indigo-400' },
    { id: 'excited', label: 'Excited', gradient: 'from-red-400 to-pink-400' },
    { id: 'relaxed', label: 'Relaxed', gradient: 'from-green-400 to-teal-400' },
    { id: 'scared', label: 'Thrilled', gradient: 'from-purple-400 to-violet-400' },
    { id: 'romantic', label: 'Romantic', gradient: 'from-pink-400 to-rose-400' },
    { id: 'thoughtful', label: 'Thoughtful', gradient: 'from-slate-400 to-gray-400' },
    { id: 'adventurous', label: 'Adventurous', gradient: 'from-emerald-400 to-cyan-400' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-purple-400" />
          <p className="text-xl">Loading movie database...</p>
          <p className="text-sm text-gray-400 mt-2">Processing 10,000+ movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow delay-500"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-3">
                <Film className="w-10 h-10 text-purple-400" />
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    CineMatch AI
                  </h1>
                  <p className="text-sm text-gray-400">
                    {movies.length.toLocaleString()} movies • {filteredMovies.length.toLocaleString()} shown • AI-powered
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowChat(!showChat)}
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">AI Chat</span>
                {chatMessages.length > 0 && (
                  <span className="bg-white/20 rounded-full px-2 py-0.5 text-xs">{chatMessages.length}</span>
                )}
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Enhanced Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, genre, year, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-xl text-white placeholder-gray-400 transition-all duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-400 mt-2">
                Found {filteredMovies.length} results for "{searchQuery}"
              </p>
            )}
          </div>

          {/* Mood Selector */}
          <div className="mb-10">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-semibold">What's your mood?</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => {
                    setSelectedMood(selectedMood === mood.id ? null : mood.id);
                    setAiRecommendations([]); // Clear AI recommendations when changing mood
                  }}
                  className={`p-4 rounded-xl transition-all duration-300 ${selectedMood === mood.id
                      ? `bg-gradient-to-br ${mood.gradient} shadow-lg transform scale-105`
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                    }`}
                >
                  <div className="text-xs font-medium">{mood.label}</div>
                </button>
              ))}
            </div>
            {selectedMood && (
              <p className="text-sm text-gray-400 mt-3">
                {moods.find(m => m.id === selectedMood)?.label} mood •
                {getMoodPositiveGenres(selectedMood).map(id => GENRE_MAP[id]).filter(Boolean).join(', ')}
              </p>
            )}
          </div>

          {/* AI Recommendations */}
          {aiRecommendations.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-pink-400" />
                  <h2 className="text-xl font-semibold">AI Recommended for You</h2>
                </div>
                <button
                  onClick={() => setAiRecommendations([])}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Clear
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {aiRecommendations.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} onClick={setSelectedMovie} highlight={true} />
                ))}
              </div>
            </div>
          )}

          {/* Movies Grid */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-semibold">
                  {selectedMood ? `${moods.find(m => m.id === selectedMood)?.label} Movies` : 'All Movies'}
                </h2>
              </div>
              <span className="text-sm text-gray-400">
                Page {currentPage} of {totalPages} • {filteredMovies.length.toLocaleString()} total
              </span>
            </div>

            {displayedMovies.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl">No movies found</p>
                <p className="text-sm mt-2">Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {displayedMovies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} onClick={setSelectedMovie} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2">
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-4 py-2 rounded-lg transition-all ${currentPage === pageNum
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                : 'bg-white/5 hover:bg-white/10'
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Movie Detail Modal */}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}

      {/* AI Chat Panel */}
      {showChat && (
        <ChatPanel
          messages={chatMessages}
          userMessage={userMessage}
          setUserMessage={setUserMessage}
          onSend={handleSendMessage}
          isTyping={isAiTyping}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}

// Movie Card Component
const MovieCard = ({ movie, onClick, highlight }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : `https://via.placeholder.com/300x450/1e293b/8b5cf6?text=${encodeURIComponent(movie.title.substring(0, 20))}`;

  return (
    <div
      onClick={() => onClick(movie)}
      className={`group cursor-pointer transition-all duration-300 hover:-translate-y-2 ${highlight ? 'ring-2 ring-pink-400 rounded-xl' : ''
        }`}
    >
      <div className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
        <div className="aspect-[2/3] overflow-hidden bg-slate-800">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/300x450/1e293b/8b5cf6?text=${encodeURIComponent(movie.title.substring(0, 20))}`;
            }}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 p-4 w-full">
            <h3 className="font-bold text-sm mb-2 line-clamp-2">{movie.title}</h3>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
              {movie.release_date && (
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{movie.release_date.split('-')[0]}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-bold">{movie.vote_average.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

// Movie Detail Modal
const MovieModal = ({ movie, onClose }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : `https://via.placeholder.com/300x450/1e293b/8b5cf6?text=${encodeURIComponent(movie.title.substring(0, 20))}`;

  const genres = movie.genre_ids.map(id => GENRE_MAP[id]).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm rounded-full p-2 hover:bg-black/70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="grid md:grid-cols-3 gap-6 p-6">
            <div className="md:col-span-1">
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-full rounded-xl shadow-2xl"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/300x450/1e293b/8b5cf6?text=${encodeURIComponent(movie.title.substring(0, 20))}`;
                }}
              />
            </div>

            <div className="md:col-span-2 space-y-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">{movie.title}</h2>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
                  {movie.release_date && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{movie.vote_average.toFixed(1)}/10</span>
                    <span className="text-gray-500">({movie.vote_count.toLocaleString()} votes)</span>
                  </div>
                </div>
              </div>

              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs font-medium"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-2">Overview</h3>
                <p className="text-gray-300 leading-relaxed">{movie.overview || 'No overview available.'}</p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Popularity</span>
                    <p className="font-semibold text-lg">{movie.popularity.toFixed(1)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Release Date</span>
                    <p className="font-semibold text-lg">
                      {movie.release_date ? new Date(movie.release_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Chat Panel Component
const ChatPanel = ({ messages, userMessage, setUserMessage, onSend, isTyping, onClose }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden z-50">
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20 backdrop-blur-xl">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="font-semibold">AI Movie Chat</h3>
            <p className="text-xs text-gray-400">Conversational recommendations</p>
          </div>
        </div>
        <button onClick={onClose} className="hover:bg-white/10 rounded-full p-1 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            <Sparkles className="w-12 h-12 mx-auto mb-3 text-purple-400" />
            <p className="text-sm font-semibold mb-2">Chat with AI about movies!</p>
            <div className="text-xs space-y-1 mt-4">
              <p className="bg-white/5 rounded-lg p-2">"What's something funny?"</p>
              <p className="bg-white/5 rounded-lg p-2">"Actually, I want action instead"</p>
              <p className="bg-white/5 rounded-lg p-2">"Tell me more about [movie]"</p>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/10 backdrop-blur-xl border border-white/10'
                }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-3 rounded-2xl flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm text-gray-400">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="flex space-x-2">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
            disabled={isTyping}
          />
          <button
            onClick={onSend}
            disabled={!userMessage.trim() || isTyping}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;