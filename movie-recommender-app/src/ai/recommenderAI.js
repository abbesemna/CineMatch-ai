/**
 * Agentic AI Movie Recommender
 * Uses OpenAI API to provide conversational movie recommendations
 */

// Genre mapping for context
const GENRE_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
};

// Mood to genre intelligent mapping
const MOOD_MAPPINGS = {
  happy: { genres: [35, 16, 10751, 14], boost: ['Comedy', 'Animation', 'Family', 'Fantasy'] },
  sad: { genres: [18, 10749, 99], boost: ['Drama', 'Romance', 'Documentary'] },
  depressed: { genres: [35, 16, 10751, 18], boost: ['Comedy', 'Animation', 'Uplifting Drama'] },
  anxious: { genres: [35, 16, 10751], boost: ['Light Comedy', 'Animation', 'Family'] },
  excited: { genres: [28, 12, 878, 14], boost: ['Action', 'Adventure', 'Sci-Fi', 'Fantasy'] },
  bored: { genres: [28, 12, 53, 9648], boost: ['Action', 'Adventure', 'Thriller', 'Mystery'] },
  relaxed: { genres: [35, 10751, 16, 14], boost: ['Comedy', 'Family', 'Animation', 'Fantasy'] },
  scared: { genres: [27, 53], boost: ['Horror', 'Thriller'] },
  romantic: { genres: [10749, 35, 18], boost: ['Romance', 'Romantic Comedy', 'Drama'] },
  lonely: { genres: [10749, 18, 35], boost: ['Romance', 'Drama', 'Feel-good Comedy'] },
  angry: { genres: [28, 53, 80], boost: ['Action', 'Thriller', 'Crime'] },
  nostalgic: { genres: [18, 36, 10749], boost: ['Drama', 'Historical', 'Classic Romance'] },
  adventurous: { genres: [12, 14, 878, 28], boost: ['Adventure', 'Fantasy', 'Sci-Fi', 'Action'] },
  thoughtful: { genres: [18, 99, 36, 9648], boost: ['Drama', 'Documentary', 'History', 'Mystery'] },
  curious: { genres: [99, 878, 9648, 36], boost: ['Documentary', 'Sci-Fi', 'Mystery', 'History'] },
  stressed: { genres: [35, 16, 10751], boost: ['Comedy', 'Animation', 'Light Family'] },
  lost: { genres: [18, 12, 878], boost: ['Inspirational Drama', 'Adventure', 'Sci-Fi'] },
  hopeful: { genres: [18, 10749, 12], boost: ['Uplifting Drama', 'Romance', 'Adventure'] }
};

/**
 * Main function to send message to AI and get movie recommendations
 */
export async function sendAIMessage({ 
  apiKey, 
  provider = 'openai',
  model = 'gpt-4o-mini',
  conversation = [], 
  userMessage, 
  movies = [],
  maxResults = 6 
}) {
  try {
    // Build system prompt with movie context
    const systemPrompt = buildSystemPrompt(movies);
    
    // Build conversation history
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversation,
      { role: 'user', content: userMessage }
    ];

    // Call OpenAI API
    const response = await callOpenAI({
      apiKey,
      model,
      messages,
      temperature: 0.8,
      maxTokens: 800
    });

    if (!response || !response.content) {
      throw new Error('Invalid API response');
    }

    const assistantText = response.content;

    // Extract movie recommendations intelligently
    const recommendations = await extractMovieRecommendations(
      assistantText, 
      userMessage, 
      movies, 
      maxResults
    );

    return {
      assistantText,
      recommendations,
      success: true
    };

  } catch (error) {
    console.error('AI Error:', error);
    return {
      assistantText: null,
      recommendations: [],
      success: false,
      error: error.message
    };
  }
}

/**
 * Build comprehensive system prompt
 */
function buildSystemPrompt(movies) {
  const topMovies = movies
    .sort((a, b) => (b.vote_average * b.vote_count) - (a.vote_average * a.vote_count))
    .slice(0, 50)
    .map(m => `${m.title} (${m.release_date?.split('-')[0] || 'N/A'}) - ${getGenreNames(m.genre_ids).join(', ')}`)
    .join('\n');

  return `You are CineMatch AI, an expert movie recommendation assistant with deep knowledge of cinema, emotions, and psychology.

**YOUR ROLE:**
- Understand user's emotional state and preferences through natural conversation
- Recommend movies that match their mood, feelings, and interests
- Be conversational, empathetic, and engaging
- Remember context from previous messages in the conversation
- Provide thoughtful, personalized recommendations

**EMOTIONAL INTELLIGENCE:**
When users express emotions like "sad," "depressed," "lost," "anxious," "stressed," or "feeling bad":
- Acknowledge their feelings with empathy
- Recommend uplifting content or cathartic dramas based on what they need
- For depression/stress: Suggest light comedies, animations, or feel-good movies
- For sadness: Offer both cathartic dramas AND uplifting options, let them choose
- For anxiety: Recommend calm, predictable, comforting content
- For feeling lost: Suggest inspirational journeys and character growth stories

**CONVERSATION STYLE:**
- Keep responses conversational and natural (2-4 sentences)
- Don't use bullet points or lists in conversation
- Reference specific movie titles naturally in your response
- Ask follow-up questions when needed to understand preferences better
- Remember what the user mentioned in previous messages

**MOVIE RECOMMENDATIONS:**
- When recommending movies, mention 3-6 specific titles naturally in your response
- Include movies from different decades when relevant
- Consider ratings (prefer 7.0+) but also hidden gems
- Match genre to mood intelligently

**SAMPLE INTERACTIONS:**
User: "I'm feeling really sad today"
You: "I'm sorry you're feeling down. Would you like something cathartic that lets you feel those emotions, like 'The Shawshank Redemption' or 'Good Will Hunting'? Or would you prefer something uplifting to boost your mood, like 'The Intouchables' or 'Amélie'?"

User: "I want something funny"
You: "Perfect! I'd recommend 'Superbad' for hilarious coming-of-age comedy, 'The Grand Budapest Hotel' for quirky humor, or '21 Jump Street' for action-comedy. What type of humor do you enjoy most?"

User: "Something different, not action"
You: "Got it! How about a psychological thriller like 'Shutter Island', a heartwarming drama like 'About Time', or a mind-bending mystery like 'The Prestige'? What sounds interesting?"

**AVAILABLE MOVIES SAMPLE:**
${topMovies}

**IMPORTANT:**
- Always mention SPECIFIC movie titles in your responses
- Write naturally, like a knowledgeable friend
- Keep responses concise but warm
- Remember the conversation context`;
}

/**
 * Call OpenAI API
 */
async function callOpenAI({ apiKey, model, messages, temperature, maxTokens }) {
  const apiUrl = apiKey === 'use-proxy' 
    ? '/api/openai/chat' 
    : 'https://api.openai.com/v1/chat/completions';

  const headers = {
    'Content-Type': 'application/json'
  };

  // Only add authorization if not using proxy
  if (apiKey !== 'use-proxy') {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  
  return {
    content: data.choices[0].message.content,
    finishReason: data.choices[0].finish_reason
  };
}

/**
 * Intelligently extract movie recommendations from AI response and user query
 */
async function extractMovieRecommendations(aiResponse, userQuery, movies, maxResults) {
  const recommendations = [];
  const seenIds = new Set();

  // Extract movies mentioned in AI response (by title)
  const mentionedMovies = extractMovieTitlesFromText(aiResponse, movies);
  mentionedMovies.forEach(movie => {
    if (!seenIds.has(movie.id) && recommendations.length < maxResults) {
      recommendations.push(movie);
      seenIds.add(movie.id);
    }
  });

  // If we found enough from AI response, return them
  if (recommendations.length >= maxResults) {
    return recommendations.slice(0, maxResults);
  }

  // Otherwise, supplement with intelligent mood/genre matching
  const detectedMood = detectMoodFromText(userQuery.toLowerCase());
  const detectedGenres = detectGenresFromText(userQuery.toLowerCase());

  let genresToMatch = [];
  
  if (detectedMood && MOOD_MAPPINGS[detectedMood]) {
    genresToMatch = MOOD_MAPPINGS[detectedMood].genres;
  } else if (detectedGenres.length > 0) {
    genresToMatch = detectedGenres;
  }

  // Find movies matching the mood/genres
  if (genresToMatch.length > 0) {
    const matchingMovies = movies
      .filter(movie => {
        if (seenIds.has(movie.id)) return false;
        if (!movie.genre_ids || movie.genre_ids.length === 0) return false;
        return movie.genre_ids.some(id => genresToMatch.includes(id));
      })
      .sort((a, b) => {
        const scoreA = (a.vote_average * 0.7) + (a.popularity * 0.3 / 100);
        const scoreB = (b.vote_average * 0.7) + (b.popularity * 0.3 / 100);
        return scoreB - scoreA;
      })
      .slice(0, maxResults - recommendations.length);

    matchingMovies.forEach(movie => {
      if (!seenIds.has(movie.id)) {
        recommendations.push(movie);
        seenIds.add(movie.id);
      }
    });
  }

  // If still not enough, add top-rated movies
  if (recommendations.length < maxResults) {
    const topRated = movies
      .filter(m => !seenIds.has(m.id) && m.vote_average >= 7.0)
      .sort((a, b) => b.vote_average - a.vote_average)
      .slice(0, maxResults - recommendations.length);

    topRated.forEach(movie => {
      if (!seenIds.has(movie.id)) {
        recommendations.push(movie);
        seenIds.add(movie.id);
      }
    });
  }

  return recommendations.slice(0, maxResults);
}

/**
 * Extract movie titles mentioned in text
 */
function extractMovieTitlesFromText(text, movies) {
  const mentioned = [];
  const textLower = text.toLowerCase();

  // Create a map of lowercase titles to movies for faster lookup
  const titleMap = new Map();
  movies.forEach(movie => {
    titleMap.set(movie.title.toLowerCase(), movie);
  });

  // Check each movie title
  movies.forEach(movie => {
    const titleLower = movie.title.toLowerCase();
    
    // Exact title match
    if (textLower.includes(titleLower)) {
      mentioned.push(movie);
      return;
    }

    // Match title in quotes
    const quotedPattern = new RegExp(`['"]${escapeRegex(titleLower)}['"]`, 'i');
    if (quotedPattern.test(textLower)) {
      mentioned.push(movie);
      return;
    }

    // For longer titles, match first few significant words
    const words = titleLower.split(' ').filter(w => w.length > 3);
    if (words.length >= 2) {
      const partialTitle = words.slice(0, 2).join(' ');
      if (textLower.includes(partialTitle)) {
        mentioned.push(movie);
      }
    }
  });

  // Remove duplicates and sort by vote_average
  const unique = Array.from(new Set(mentioned.map(m => m.id)))
    .map(id => mentioned.find(m => m.id === id))
    .sort((a, b) => b.vote_average - a.vote_average);

  return unique;
}

/**
 * Detect mood/emotional state from text
 */
function detectMoodFromText(text) {
  const moodKeywords = {
    happy: ['happy', 'cheerful', 'joyful', 'upbeat', 'good mood', 'feeling great'],
    sad: ['sad', 'down', 'blue', 'melancholy', 'unhappy', 'crying'],
    depressed: ['depressed', 'depression', 'hopeless', 'empty', 'numb', 'worthless'],
    anxious: ['anxious', 'anxiety', 'worried', 'nervous', 'stressed out', 'panic'],
    stressed: ['stressed', 'overwhelmed', 'pressure', 'tense', 'burnout'],
    excited: ['excited', 'pumped', 'energetic', 'hyped', 'thrilled'],
    bored: ['bored', 'boring', 'nothing to do', 'uninterested'],
    relaxed: ['relaxed', 'chill', 'calm', 'peaceful', 'mellow'],
    scared: ['scared', 'frightened', 'terrified', 'spooky', 'creepy'],
    romantic: ['romantic', 'love', 'date night', 'romance', 'loving'],
    lonely: ['lonely', 'alone', 'isolated', 'lonesome', 'solitary'],
    angry: ['angry', 'mad', 'furious', 'pissed', 'frustrated'],
    nostalgic: ['nostalgic', 'nostalgia', 'reminisce', 'old times', 'memories'],
    adventurous: ['adventurous', 'adventure', 'explore', 'discover'],
    thoughtful: ['thoughtful', 'thinking', 'contemplative', 'reflective', 'philosophical'],
    curious: ['curious', 'wondering', 'interested', 'intrigued'],
    lost: ['lost', 'confused', 'directionless', 'unsure', 'adrift'],
    hopeful: ['hopeful', 'optimistic', 'positive', 'looking forward', 'inspired']
  };

  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return mood;
    }
  }

  return null;
}

/**
 * Detect genres from text
 */
function detectGenresFromText(text) {
  const genreKeywords = {
    28: ['action', 'fighting', 'battles', 'explosions', 'adrenaline'],
    12: ['adventure', 'journey', 'quest', 'explore', 'expedition'],
    16: ['animation', 'animated', 'cartoon', 'anime'],
    35: ['comedy', 'funny', 'hilarious', 'laugh', 'humor', 'comedic'],
    80: ['crime', 'detective', 'investigation', 'heist', 'gangster'],
    99: ['documentary', 'real story', 'true story', 'educational'],
    18: ['drama', 'dramatic', 'emotional', 'serious', 'intense'],
    10751: ['family', 'kids', 'children', 'family-friendly'],
    14: ['fantasy', 'magical', 'magic', 'wizards', 'mythical'],
    36: ['history', 'historical', 'period', 'based on true events'],
    27: ['horror', 'scary', 'terrifying', 'creepy', 'haunted'],
    10402: ['music', 'musical', 'concert', 'singing', 'dance'],
    9648: ['mystery', 'mysterious', 'whodunit', 'puzzle', 'enigma'],
    10749: ['romance', 'romantic', 'love story', 'relationship'],
    878: ['sci-fi', 'science fiction', 'futuristic', 'space', 'robots', 'ai'],
    53: ['thriller', 'suspense', 'tense', 'edge of your seat', 'gripping'],
    10752: ['war', 'battle', 'military', 'soldier', 'combat'],
    37: ['western', 'cowboy', 'frontier', 'wild west']
  };

  const detected = [];
  
  for (const [genreId, keywords] of Object.entries(genreKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      detected.push(parseInt(genreId));
    }
  }

  return detected;
}

/**
 * Get genre names from genre IDs
 */
function getGenreNames(genreIds) {
  return genreIds.map(id => GENRE_MAP[id]).filter(Boolean);
}

/**
 * Escape regex special characters
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default sendAIMessage;