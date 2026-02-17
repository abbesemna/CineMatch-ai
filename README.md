# 🎬 CineMatch AI - AI Movie Recommendation Website

[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-14+-green)](https://nodejs.org/)
[![AiML API](https://img.shields.io/badge/AiML%20API-Gemma%203n%204B-green)](https://aimlapi.com)
[![License](https://img.shields.io/badge/License-MIT-yellow)](#license)

A production-ready movie recommendation platform powered by AI with real-time chatbot, mood-based filtering, and 10,000+ movies.

## ✨ Features

### 🎭 Smart Movie Discovery
- **10,000+ TMDB Movies** - Comprehensive database
- **Mood-Based Filtering** - Intelligent genre recommendations
- **Advanced Search** - Find by title, genre, year, description
- **Real-Time Results** - Instant filtering and pagination
- **Movie Details** - Ratings, overview, genres, release date

### 🤖 AI-Powered Chatbot
- **Conversational Interface** - Chat naturally about movies
- **Context Memory** - Remembers conversation history
- **Smart Recommendations** - Extracts movies from AI responses
- **Real-Time Responses** - Powered by AiML API (Gemma 3n 4B)
- **Mood-Aware** - Understands emotional context

### 🔐 Secure Architecture
- **API Proxy Server** - Hides API keys from frontend
- **CORS Protection** - Safe cross-origin requests
- **Rate Limiting Ready** - Can add request throttling
- **Error Handling** - Comprehensive error messages

## 🏗️ Architecture

```
┌──────────────────────────────┐
│   React Frontend             │
│   (Port 3000)               │
│  - Movie Browser            │
│  - Mood Filter              │
│  - AI Chat Panel            │
└────────────┬─────────────────┘
             │
             ↓ HTTP
             │
┌──────────────────────────────┐
│   Express Proxy Server       │
│   (Port 3001)               │
│  - Validates Requests       │
│  - Manages API Keys         │
│  - Handles Responses        │
└────────────┬─────────────────┘
             │
             ↓ HTTPS
             │
┌──────────────────────────────┐
│   AiML API                   │
│   (Cloud)                   │
│  - Gemma 3n 4B Model       │
│  - Movie Recommendations    │
└──────────────────────────────┘
```

## 📁 Project Structure

```
project-ai/
│
├── 🎬 movie-recommender-app/        (React Frontend - Port 3000)
│   ├── public/
│   │   ├── index.html               (HTML template)
│   │   ├── movies_dataset.csv       (10K TMDB movies)
│   │   └── package.json             (images & assets)
│   ├── src/
│   │   ├── App.js                   (Main React component)
│   │   ├── index.js                 (Entry point)
│   │   ├── index.css                (Global styles)
│   │   └── ai/
│   │       └── recommenderAI.js    (AI utilities)
│   ├── package.json                 (Dependencies)
│   ├── tailwind.config.js          (Tailwind CSS config)
│   ├── postcss.config.js           (PostCSS config)
│   ├── .env.local                  (Frontend env vars)
│   └── README.md
│
├── 🔌 cinematch-ai-proxy/           (Node.js Backend - Port 3001)
│   ├── server/
│   │   └── ai-proxy.js             (Express proxy server)
│   ├── .env                         (API key & config)
│   ├── .env.example                (Config template)
│   ├── .gitignore                  (Git ignore rules)
│   ├── package.json                (Dependencies)
│   └── README.md
│
├── 📖 SETUP_INSTRUCTIONS.md         (Detailed setup guide)
├── 📖 README.md                     (This file)
├── 🚀 start-windows.bat             (Windows startup)
├── 🚀 start.sh                      (Linux/Mac startup)
└── QUICKSTART.md                    (Quick start guide)
```

## 🚀 Quick Start (Choose Your OS)

### 🪟 Windows
```bash
# Simply run the batch file
start-windows.bat

# Or manually:
cd cinematch-ai-proxy
npm install
echo AIML_API_KEY=your-key-here > .env
echo PORT=3001 >> .env
npm start

# In another terminal:
cd movie-recommender-app
npm install
npm start
```

### 🐧 Linux / 🍎 macOS
```bash
# Run the shell script
./start.sh

# Or manually:
cd cinematch-ai-proxy
npm install
cp .env.example .env
# Edit .env with your AiML API key
npm start

# In another terminal:
cd movie-recommender-app
npm install
npm start
```

## 📋 Prerequisites

1. **Node.js** v14+ - [Download](https://nodejs.org/)
2. **npm** or **yarn** - Comes with Node.js
3. **AiML API Key** - [Get free key](https://www.aimlapi.com)

## 🔑 Getting Your AiML API Key

1. Go to [www.aimlapi.com](https://www.aimlapi.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create new API key
5. Copy and save it safely
6. Create `cinematch-ai-proxy/.env`:
   ```env
   AIML_API_KEY=your-actual-key-here
   PORT=3001
   NODE_ENV=development
   ```

## 📖 Full Setup Guide

For detailed setup, troubleshooting, and configuration:

👉 **[Read SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)**

## 🎮 How to Use

### Step 1: Browse Movies
1. Navigate to http://localhost:3000
2. See all 10,000 movies loaded
3. Search by title, genre, year, or description
4. Click any movie for details

### Step 2: Filter by Mood
1. Click mood button (Happy, Excited, Relaxed, Romantic, etc.)
2. Movies filter to match that mood
3. Browse recommended movies
4. Click movie card to see full details

### Step 3: Chat with AI
1. Click **"AI Chat"** button in top right
2. Type your movie preference naturally
   - "I'm feeling sad, recommend something uplifting"
   - "Show me some action movies"
   - "I loved Inception, what else would I like?"
3. Read AI recommendations
4. Click recommended movies in the results

### Step 4: Refine & Explore
1. Ask follow-up questions in chat
2. Get more personalized recommendations
3. Search for specific movies
4. Read full movie details

## 🔐 Security Features

✅ **API Key Protection**
- API keys stored on server only
- Frontend never sees credentials
- Uses secure proxy pattern

✅ **CORS Protection**
- Whitelist allowed origins
- Prevent unauthorized access
- Configurable in `.env`

✅ **Request Validation**
- Validates message format
- Sanitizes user input
- Error handling

✅ **Rate Limiting Ready**
- Easy to add rate limiting
- Prevents API abuse
- Configurable thresholds

## 📊 API Endpoints

### Health Check
```bash
curl http://localhost:3001/health
```
Returns:
```json
{
  "status": "ok",
  "service": "CineMatch AI Proxy",
  "apiKey": "✅ Configured"
}
```

### Chat Completion (powered by AiML API - Gemma 3n 4B)
```bash
curl -X POST http://localhost:3001/api/openai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Recommend a funny movie"
      }
    ]
  }'
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icon library
- **JavaScript ES6+** - Programming language

### Backend
- **Express.js** - Web framework
- **Node.js** - Runtime
- **Native Fetch** - HTTP requests (Node 18+)
- **CORS** - Cross-origin support
- **dotenv** - Environment management

### AI & Data
- **AiML API** - Powered by Gemma 3n 4B model
- **TMDB Dataset** - 10,000+ movies
- **Mood Mapping** - Intelligent genre selection

## 🐛 Troubleshooting

### "Cannot connect to proxy"
- Make sure proxy server is running: `npm start` in `cinematch-ai-proxy`
- Check port 3001 is available
- Verify no firewall blocks localhost

### "API key not configured"
- Create `.env` file in `cinematch-ai-proxy`
- Add `AIML_API_KEY=your-key` (from www.aimlapi.com)
- Restart server

### "404 API key not found"
- Check AiML dashboard for active keys
- Generate new key if expired
- Verify no trailing spaces in `.env`

### Movies not loading
- Check `public/movies_dataset.csv` exists
- Open DevTools (F12) and check Console
- Hard refresh page (Ctrl+Shift+R)

### Chat not responding
- Check proxy server is running
- Look for errors in server terminal
- Verify API key is valid
- Check browser internet connection

**For more help:** See [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md#-troubleshooting)

## 📈 Performance

- **Movie loading**: ~1 second for 10,000 movies
- **Search response**: <100ms for filtered results
- **AI response**: 2-5 seconds depending on API latency
- **Chat streaming**: Real-time via OpenAI streaming

## 🚀 Deployment

### Deploy Proxy Server
- **Heroku**: `git push heroku main`
- **Vercel**: Use serverless functions
- **AWS**: Lambda + API Gateway
- **Railway**: Simple git deployment

### Deploy Frontend
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **GitHub Pages**: For static build
- **AWS S3 + CloudFront**: Static hosting

## 📝 Environment Variables

| Variable | Location | Required | Purpose |
|----------|----------|----------|---------|
| `AIML_API_KEY` | `.env` | ✅ YES | AiML API authentication |
| `PORT` | `.env` | NO | Server port (default: 3001) |
| `NODE_ENV` | `.env` | NO | Environment type |
| `CORS_ORIGIN` | `.env` | NO | Allowed origins |
| `REACT_APP_API_URL` | `.env.local` | NO | API endpoint URL |

## 🎓 Learning Resources

- [AiML API Docs](https://www.aimlapi.com/docs)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Tailwind CSS Docs](https://tailwindcss.com)

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- **TMDB** - Movie database
- **AiML API** - Gemma Model API
- **React Team** - Framework
- **Tailwind Labs** - CSS framework

## 🌟 Features Roadmap

- [ ] User authentication
- [ ] Favorites/watchlist
- [ ] Streaming service links
- [ ] Movie recommendations by actor
- [ ] Social sharing
- [ ] Mobile app
- [ ] Advanced filters
- [ ] Movie ratings history

## 🤝 Contributing

Feel free to fork, improve, and submit pull requests!

## 📞 Support

Need help? Check the detailed guides:
- [Setup Instructions](./SETUP_INSTRUCTIONS.md)
- [Quick Start](./QUICKSTART.md)
- [Server README](./cinematch-ai-proxy/README.md)
- [Frontend README](./movie-recommender-app/README.md)

---

**Made with ❤️ for movie lovers and AI enthusiasts**

Start discovering movies with AI today! 🍿🎬✨

npm start
```

You should see:
```
✅ CineMatch AI Proxy running on http://localhost:4000
```

### 2️⃣ Start the Frontend (in another terminal)

```bash
cd movie-recommender-app
npm install
npm start
```

The app opens at `http://localhost:3000`

### 3️⃣ Use the App

- Click mood buttons to filter movies
- Search by title, genre, or year
- Click any movie for details
- Use AI Chat button for real-time recommendations

## 🎯 Features

### Frontend (movie-recommender-app)
- ✅ 10,000+ movies from TMDB database
- ✅ 8 mood-based filtering options
- ✅ Advanced search (title, genre, year, description)
- ✅ Real-time streaming AI chat
- ✅ Mobile-responsive dark UI with animations
- ✅ Movie detail modal with ratings & info

### Backend (cinematch-ai-proxy)
- ✅ Secure OpenAI API proxy
- ✅ Non-streaming and streaming endpoints
- ✅ Environment-based API key management
- ✅ CORS enabled for frontend-backend communication
- ✅ Health check endpoint

## 🔌 How It Works

1. **User sends message** in chat → React App
2. **Frontend calls proxy** → `POST http://localhost:4000/api/openai/chat`
3. **Proxy forwards to OpenAI** with secure API key (never exposed to browser)
4. **OpenAI responds** with movie recommendations
5. **Frontend parses titles** and matches against local movie database
6. **recommendations displayed** in real-time

This architecture keeps your API key safe on the server while providing a responsive UI.

## 📖 Documentation

- **Frontend Guide**: See `movie-recommender-app/SETUP.md`
- **Backend Guide**: See `cinematch-ai-proxy/README.md`
- **AI Helper API**: See `movie-recommender-app/src/ai/recommenderAI.js` (well-documented)

## 🛠 Development

### Run Both Servers with Auto-Reload

**Backend (Terminal 1):**
```bash
cd cinematch-ai-proxy
npm run dev  # uses nodemon for hot reload
```

**Frontend (Terminal 2):**
```bash
cd movie-recommender-app
npm start    # CRA has built-in auto-reload
```

### Useful Commands

```bash
# Frontend build
cd movie-recommender-app && npm run build

# Backend testing
curl http://localhost:4000/health  # Should return {status: ok}

# Check if APIs are reachable
curl -X POST http://localhost:4000/api/openai/chat \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"test"}]}'
```

## 🌐 Deployment

### Frontend (Static Site)
Build once, deploy to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

### Backend (Server)
Deploy to:
- Vercel serverless
- Render.com
- Railway.app
- Heroku
- Your own server

**Don't forget to set `OPENAI_API_KEY` in production!**

## 🔒 Security Notes

- ✅ **API keys never exposed**: Backend proxy keeps OpenAI key secure
- ✅ **CORS configured**: Only your frontend can call the proxy
- ✅ **Environment variables**: Use `.env` file, never commit it
- ⚠️ **Rate limiting**: Consider adding rate limits to `/api/openai/*` endpoints in production

## 📊 API Reference

### Frontend AI Helper

```javascript
import { sendAIMessage, sendAIMessageStreaming } from './ai/recommenderAI';

// Non-streaming
const { assistantText, recommendations } = await sendAIMessage({
  apiKey: 'use-proxy',
  provider: 'openai',
  model: 'gpt-4o-mini',
  conversation: [],
  userMessage: 'Recommend romantic movies',
  movies: [],
  maxResults: 6
});

// Streaming
await sendAIMessageStreaming({
  ...options,
  onDelta: (chunk) => console.log(chunk),
  onDone: (result) => console.log(result),
  onError: (err) => console.error(err)
});
```

### Backend Proxy Endpoints

**POST /api/openai/chat**
- Non-streaming chat completion
- Forwards to OpenAI, returns full response

**POST /api/openai/stream**
- Streaming chat completion (SSE)
- Returns chunks as they arrive from OpenAI

**GET /health**
- Health check endpoint
- Returns `{ status: "ok", message: "..." }`

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Node version
node --version  # Should be 14+

# Check port 4000 is free
lsof -i :4000   # or check Windows Task Manager

# Missing dependencies
npm install
```

### Frontend can't reach backend
```javascript
// In browser console, test the connection:
fetch('http://localhost:4000/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

### "OPENAI_API_KEY not set" error
```bash
# In cinematch-ai-proxy folder:
export OPENAI_API_KEY="sk-your-key-here"  # Linux/Mac
set OPENAI_API_KEY=sk-your-key-here       # Windows CMD
$env:OPENAI_API_KEY="sk-your-key-here"    # Windows PowerShell

# Or create .env file
cp .env.example .env
# Edit .env with your key
```

## 📝 License

MIT - Use freely for personal & commercial projects

## 🤝 Contributing

Feel free to:
- Add more moods/genres
- Improve the AI prompt engineering
- Add filtering options
- Enhance the UI
- Add testing

## 📞 Support

- 📖 Check `/movie-recommender-app/SETUP.md` for frontend issues
- 📖 Check `/cinematch-ai-proxy/README.md` for backend issues
- 🔗 OpenAI Docs: https://platform.openai.com/docs
- 🔗 TMDB API: https://www.themoviedb.org/settings/api

---

Enjoy discovering amazing movies! 🍿✨
