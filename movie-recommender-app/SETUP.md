# 🎬 CineMatch AI - Movie Recommender App

A beautiful, AI-powered movie recommendation platform with real-time streaming chat, mood-based filtering, and 10,000+ movies.

## Project Structure

This project is split into two directories:

```
your-projects/
├── movie-recommender-app/        (React Frontend - this folder)
│   ├── src/
│   │   ├── App.js               (Main React app)
│   │   └── ai/
│   │       └── recommenderAI.js (AI helper functions)
│   ├── public/
│   │   └── movies_dataset.csv   (10,000 movies)
│   └── package.json
│
└── cinematch-ai-proxy/          (Backend Server)
    ├── server/
    │   └── ai-proxy.js          (Express proxy for OpenAI)
    ├── package.json
    ├── .env
    └── .env.example
```

## Features

- 🎯 **Mood-based filtering**: Happy, Sad, Excited, Relaxed, Scared, Romantic, Thoughtful, Adventurous
- 💬 **Real-time AI chat**: Talk naturally with the AI about your movie preferences
- 🔍 **Advanced search**: Search by title, genre, year, or description
- 🎬 **10,000+ movies**: From TMDB database with ratings and details
- 📱 **Responsive design**: Beautiful dark UI with animations
- 🔒 **Secure**: Uses a backend proxy to keep your OpenAI API key safe

## Quick Start

### Prerequisites

- Node.js 14+
- npm or yarn
- OpenAI API key (get one at https://platform.openai.com/api-keys)

### Step 1: Start the Backend Proxy Server

In a **new terminal**, navigate to the backend folder:

```bash
cd ../cinematch-ai-proxy
npm install
cp .env.example .env
# Edit .env and add your OpenAI API key
npm start
```

You should see:
```
✅ CineMatch AI Proxy running on http://localhost:4000
```

### Step 2: Start the React Frontend

In **another terminal**, stay in the frontend folder:

```bash
npm install
npm start
```

The app will open at `http://localhost:3000`.

### Step 3: Use the App

1. Click on a **mood button** (Happy, Romantic, etc.) to filter cinema
2. Use the **search bar** to find movies by title, genre, or year
3. Click on any movie card to see details
4. Use the **AI Chat** button to have a real conversation about movies

## How It Works

### Frontend (This App)
- Loads 10,000 movies from CSV
- Filters by mood and search query
- Calls the backend proxy at `http://localhost:4000/api/openai/chat` for AI responses
- Parses AI recommendations and matches them to local movies

### Backend (cinematch-ai-proxy)
- Receives chat requests from the frontend
- Forwards them to OpenAI API with your secure API key
- Returns responses (optionally with streaming)
- Never exposes your API key to clients

## AI Features

The app uses OpenAI's GPT-4o-mini model to:
- Understand natural conversation about movie preferences
- Generate movie recommendations based on mood, genre, and user input
- Provide information about movies (plot, cast, reviews, etc.)
- Parse structured JSON responses to extract exact movie titles

## Configuration

### Environment Variables

The frontend doesn't need any env vars (the proxy handles the API key). However, you can customize:

- `REACT_APP_PROXY_URL`: If your backend is on a different host (default: `http://localhost:4000`)

### Movies Database

The movies are loaded from `public/movies_dataset.csv`. The file contains TMDB data with columns:
- `adult`: Adult content flag
- `backdrop_path`: Movie image URL path
- `genre_ids`: Array of genre IDs
- `id`: TMDB movie ID
- `original_language`: Language code
- `original_title`: Original movie title
- `overview`: Plot description
- `popularity`: Popularity score
- `poster_path`: Poster image URL path
- `release_date`: Release date
- `title`: Movie title
- `video`: Video flag
- `vote_average`: Rating (0-10)
- `vote_count`: Number of votes

## Building for Production

### Frontend Build

```bash
npm run build
```

This creates a `build/` directory ready for deployment on Netlify, Vercel, GitHub Pages, etc.

### Backend Deployment

Deploy the `cinematch-ai-proxy` folder to:
- **Vercel**: `vercel deploy`
- **Heroku**: `git push heroku main`
- **Railway.app**: Connect GitHub repo
- **Your own server**: Copy files and run `npm start`

Don't forget to set `OPENAI_API_KEY` in your deployment platform's environment variables.

## Troubleshooting

### "AI Chat not responding"
1. Check backend is running: `curl http://localhost:4000/health`
2. Verify OPENAI_API_KEY is set in the backend's `.env`
3. Check browser console for errors (F12)
4. Check backend terminal for API errors

### "Movies not loading"
1. Verify `public/movies_dataset.csv` exists and has data
2. Check browser console for network errors
3. Ensure CSV file is not corrupted

### "Search not working"
1. Try searching with exact movie titles first
2. Year search format: "2023", "2022", etc.
3. Genre search: "action", "romantic", "drama", etc.

### "Mood filtering shows wrong movies"
- The app filters movies by including required genres and excluding incompatible ones
- A movie must have at least one positive genre for the mood
- If a movie has negative genres for that mood, it's excluded
- See `MOOD_TO_GENRES` in `src/App.js` for the mapping

## API Reference

### AI Helper Module: `src/ai/recommenderAI.js`

```javascript
import { sendAIMessage, sendAIMessageStreaming } from './ai/recommenderAI';

// Non-streaming request
const { assistantText, recommendations } = await sendAIMessage({
  apiKey: 'use-proxy',
  provider: 'openai',
  model: 'gpt-4o-mini',
  conversation: [],
  userMessage: 'Recommend romantic comedies',
  movies: [],
  maxResults: 6
});

// Streaming request (real-time text updates)
await sendAIMessageStreaming({
  apiKey: 'use-proxy',
  provider: 'openai',
  conversation: [],
  userMessage: 'What are some sci-fi movies?',
  movies: [],
  maxResults: 6,
  onDelta: (chunk) => console.log('Streaming:', chunk),
  onDone: (result) => console.log('Done:', result),
  onError: (err) => console.error('Error:', err)
});
```

## Performance Tips

- The app loads all 10,000 movies into memory (about 5-10MB)
- Initial load takes 2-3 seconds
- Search and filtering is instant on modern browsers
- Chat responses stream in real-time for better UX

## Customization

### Change the Model
Edit `src/App.js` and change:
```javascript
model: 'gpt-4o', // or 'gpt-4-turbo', 'gpt-3.5-turbo'
```

### Add More Moods
In `src/App.js`, update the `moods` array and `MOOD_TO_GENRES` mapping.

### Customize CORS
Edit `cinematch-ai-proxy/server/ai-proxy.js` and change the cors() call to restrict origins.

### Change UI Colors and Theme
Edit `src/index.css` and the Tailwind color classes in `src/App.js`.

## License

MIT - Feel free to use this for personal and commercial projects.

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Read OpenAI documentation: https://platform.openai.com/docs
3. Check TMDB docs for movie data: https://www.themoviedb.org/settings/api

Happy movie hunting! 🍿
