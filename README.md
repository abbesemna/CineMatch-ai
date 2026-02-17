# 🎬 CineMatch AI - Intelligent Movie Recommendation Engine

[![React](https://img.shields.io/badge/React-18+-blue)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green)](https://nodejs.org/)
[![Gemma Model](https://img.shields.io/badge/AiML%20API-Gemma%203n%204B-green)](https://aimlapi.com)
[![License](https://img.shields.io/badge/License-MIT-yellow)](#license)

An intelligent movie recommendation platform powered by **Gemma 3n 4B** AI model via AiML API. Features mood-based filtering, real-time AI chat, advanced search, and access to 10,000+ movies from TMDB.

## ✨ Features

### 🎭 Smart Movie Discovery
- **10,000+ TMDB Movies** - Comprehensive database with ratings & metadata
- **Advanced Search** - Find by title, genre, year, description, and keywords
- **Real-Time Filtering** - Instant results with live pagination
- **Movie Details** - Ratings, overview, genres, release date, and more
- **Responsive Design** - Works on desktop, tablet, and mobile

### 🤖 AI-Powered Chatbot (Powered by Gemma 3n 4B)
- **Conversational Interface** - Chat naturally about movies and moods
- **Conversation Memory** - ✨ NEW! Remembers full chat history for context-aware responses
- **Smart Recommendations** - AI extracts movie recommendations from natural text
- **Real-Time Streaming** - Responsive answers that appear as they're generated
- **Mood Understanding** - Comprehends emotional context and preferences
- **Follow-up Questions** - Keep refining recommendations based on previous responses

### 🎨 Mood-Based Filtering
- 8+ mood categories (Happy, Excited, Relaxed, Romantic, Sad, Scared, Angry, Contemplative)
- Intelligent genre-to-mood mapping
- One-click filtering for quick discovery
- Combined with search for precise filtering

### 🔐 Secure Architecture
- **Server-Side API Keys** - AiML API key never exposed to browser
- **Request Validation** - Comprehensive input validation & sanitization
- **CORS Protection** - Configurable allowed origins
- **Error Handling** - Clear error messages for debugging
- **Production-Ready** - Built-in logging and monitoring capabilities

## 📊 Dataset Information

### 🎬 Kaggle Movies Dataset

This project uses the **[Movies Dataset](https://www.kaggle.com/datasets/saketsingh9728/movies-dataset)** from Kaggle, a comprehensive collection of 10,000+ movies extracted from TMDB.

**Dataset Details:**
- **Size**: 10,000+ movies with complete metadata
- **Source**: TMDB (The Movie Database)
- **Last Updated**: February 6, 2026 (latest movies included)
- **Use Cases**: 
  - Building movie recommendation systems (like CineMatch!)
  - Data cleaning and preprocessing practice
  - Feature engineering exercises
  - Machine learning and AI projects
  - Pattern analysis and trend discovery

**Dataset Features:**
- Movie titles, genres, release dates
- IMDB/TMDB ratings and reviews
- Movie overviews and descriptions
- Cast and crew information
- Budget, revenue, and runtime data
- And much more!

**Support the Dataset Creator:**
If you find this dataset useful, please consider **[upvoting on Kaggle](https://www.kaggle.com/datasets/saketsingh9728/movies-dataset)** to support the creator (Saket Singh) and help others discover it! 👍

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   WEB BROWSER (Port 3000)              │
│  React App: Movie browsing, mood filters, AI chat UI   │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP Requests (JSON)
                     ↓
┌─────────────────────────────────────────────────────────┐
│            EXPRESS PROXY SERVER (Port 3001)             │
│  • Validates incoming requests                          │
│  • Manages AIML API key securely (NEVER sent to browser)│
│  • Forwards requests to AiML API                        │
│  • Returns responses to frontend                        │
│  • Maintains conversation history context               │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS with API Key
                     ↓
┌─────────────────────────────────────────────────────────┐
│              AiML API (Cloud Service)                    │
│  • Gemma 3n 4B Model - Fast, cost-effective LLM        │
│  • Movie recommendations & chat understanding          │
│  • Real-time response streaming                        │
└─────────────────────────────────────────────────────────┘
```

### Why This Architecture?
✅ **Security**: API keys never exposed to browser  
✅ **Efficiency**: Lightweight Gemma 3n 4B model (10x cheaper than GPT-4)  
✅ **Context**: Full conversation history maintained for better recommendations  
✅ **Control**: Server-side validation prevents API abuse  
✅ **Scalability**: Easy to scale both frontend and backend independently  

### Recent Improvements (Feb 2026)
- ✅ Fixed frontend to use secure proxy instead of direct API calls
- ✅ Implemented conversation memory for context-aware recommendations
- ✅ Added comprehensive request validation and error handling
- ✅ Created startup scripts for easy setup (Windows & Unix)
- ✅ Enhanced documentation with troubleshooting guides
- ✅ Improved CORS configuration for production readiness

## 📁 Project Structure

```
project-ai/
│
├── 🎬 movie-recommender-app/        (React Frontend - Port 3000)
│   ├── public/
│   │   ├── index.html               (HTML template)
│   │   ├── movies_dataset.csv       (10K movies from Kaggle/TMDB dataset)
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
# Easiest way - run the startup script
start-windows.bat

# Or manually:
# Terminal 1 - Start Backend (Proxy Server)
cd cinematch-ai-proxy
npm install
echo AIML_API_KEY=your-key-here > .env
echo PORT=3001 >> .env
npm start

# Terminal 2 - Start Frontend (React App)
cd movie-recommender-app
npm install
npm start
```

### 🐧 Linux / 🍎 macOS
```bash
# Easiest way - run the startup script
chmod +x start.sh
./start.sh

# Or manually:
# Terminal 1 - Start Backend (Proxy Server)
cd cinematch-ai-proxy
npm install
cp .env.example .env
# Edit .env with your AiML API key
npm start

# Terminal 2 - Start Frontend (React App)
cd movie-recommender-app
npm install
npm start
```

## 📋 Prerequisites

1. **Node.js** v14+ - [Download](https://nodejs.org/)
2. **npm** or **yarn** - Comes with Node.js
3. **AiML API Key** - [Get free key](https://www.aimlapi.com)

## 🔑 Getting Your AiML API Key

1. Visit [www.aimlapi.com](https://www.aimlapi.com)
2. Sign up for a free account (or log in)
3. Navigate to API Keys section
4. Create a new API key or copy your existing one
5. Save the key to `cinematch-ai-proxy/.env`:
   ```env
   AIML_API_KEY=your-key-here
   PORT=3001
   NODE_ENV=development
   ```
6. Restart the proxy server
7. Test it's working: `curl http://localhost:3001/health`

**Note**: Gemma 3n 4B is a lightweight, fast, and cost-effective open-source model. You get generous free credits to try it out!

## 📖 Full Setup Guide & Documentation

For detailed setup, configuration, troubleshooting, and more:

- 📘 **[SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)** - Complete step-by-step setup guide
- 🚀 **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute quick start
- 🔄 **[CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md)** - What's new and fixed (architecture improvements)
- ✅ **[IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)** - Feature checklist
- ⚡ **[PRE_LAUNCH_CHECKLIST.md](./PRE_LAUNCH_CHECKLIST.md)** - Pre-deployment checklist
- 📁 **[cinematch-ai-proxy/README.md](./cinematch-ai-proxy/README.md)** - Backend server documentation
- 📁 **[movie-recommender-app/README.md](./movie-recommender-app/README.md)** - Frontend app documentation

## 🎮 How to Use

### Step 1: Access the Application
1. Open http://localhost:3000 in your browser
2. You'll see 10,000+ movies loaded from the TMDB database
3. The frontend automatically communicates with the proxy server at http://localhost:3001

### Step 2: Browse & Search
- **Browse**: Scroll through all available movies
- **Search**: Use the search bar to find movies by:
  - Title
  - Genre
  - Year
  - Description keywords
- **Quick Filter**: See movie details by clicking any movie card

### Step 3: Filter by Mood
1. Click one of the mood buttons (Happy 😊, Excited 🤩, Relaxed 😌, Romantic 💕, etc.)
2. Movies automatically filter to match that mood preference
3. Mood-based filtering uses intelligent genre mapping
4. Browse the curated recommendations for that mood

### Step 4: Chat with AI (Gemma 3n 4B)
1. Click the **"AI Chat"** button in the top right
2. Type your movie preference naturally:
   - *"I'm feeling sad, recommend something uplifting"*
   - *"Show me some action-adventure movies from the 90s"*
   - *"I loved Inception, what else would I like?"*
   - *"What are the best romantic comedies?"*
3. The AI (powered by Gemma 3n 4B) will:
   - **Understand context** - Knows about movies and moods
   - **Remember history** - Keeps track of your previous messages in the conversation
   - **Recommend movies** - Extracts movie titles from its responses
   - **Respond in real-time** - Uses streaming for interactive responses
4. Click any recommended movie in the chat results to view full details
5. Ask follow-up questions - The AI remembers the full conversation history!

### Step 5: Refine & Explore
- Use mood filters for quick browsing
- Use AI chat for detailed conversations
- Combine both approaches for best results
- Read complete movie information (ratings, overview, cast)

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

## 📊 API Endpoints (Proxy Server)

### Health Check
```bash
curl http://localhost:3001/health
```
Response:
```json
{
  "status": "ok",
  "service": "CineMatch AI Proxy",
  "apiKey": "✅ Configured"
}
```

### Chat Completion (Powered by Gemma 3n 4B via AiML API)
```bash
curl -X POST http://localhost:3001/api/openai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "user",
        "content": "Recommend a funny movie"
      }
    ]
  }'
```

Response:
```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Here are some funny movies I recommend: Superbad (2007), The Grand Budapest Hotel (2014), and Knives Out (2019)..."
      }
    }
  ],
  "usage": {
    "prompt_tokens": 15,
    "completion_tokens": 87,
    "total_tokens": 102
  }
}
```

### How It Works
1. Frontend sends chat message to **http://localhost:3001/api/openai/chat**
2. Backend proxy validates the request
3. Proxy forwards to **AiML API** with secure API key (never exposed to frontend)
4. **Gemma 3n 4B** model processes the request
5. Response streams back to frontend in real-time
6. Full conversation history is maintained and sent with each request for context awareness

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library
- **Tailwind CSS** - Utility-first styling framework
- **Lucide React** - Beautiful icon library
- **JavaScript ES6+** - Modern JavaScript

### Backend (Proxy Server)
- **Express.js** - Web framework
- **Node.js** - JavaScript runtime
- **Native Fetch API** - HTTP requests (Node 18+)
- **CORS** - Cross-origin request handling
- **dotenv** - Environment variable management

### AI & Data Layer
- **AiML API** - Gemma 3n 4B model (cost-effective, fast, open-source LLM)
- **Movie Dataset** - 10,000+ movies from TMDB via [Kaggle Dataset](https://www.kaggle.com/datasets/saketsingh9728/movies-dataset) (Up-to-date as of Feb 6, 2026)
- **Intelligent Mood Mapping** - Genre-to-mood correlation system
- **Conversation Memory** - Full message history preservation

## 🐛 Troubleshooting

### "Cannot connect to proxy"
- Ensure proxy server is running: Run `npm start` in `cinematch-ai-proxy` folder
- Check port 3001 is available - no other services using it
- Verify no firewall is blocking localhost connections
- On Windows, check if you need to allow Node.js through firewall

### "API key not configured" or "401 Unauthorized"
- Create `.env` file in `cinematch-ai-proxy` folder (if missing)
- Add your AiML API key: `AIML_API_KEY=your-actual-key-here`
- Get a free key at https://www.aimlapi.com
- Restart the proxy server after adding the key
- Make sure there are no spaces or quotes around the key

### "Cannot find movies dataset"
- Verify `movie-recommender-app/public/movies_dataset.csv` exists
- File should contain 10,000+ movies from TMDB
- Check file permissions are readable
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

### Chat not responding
- Check proxy server terminal for error messages
- Verify the proxy is listening on port 3001
- Confirm API key is valid in AiML dashboard
- Check browser console (F12) for network errors
- Ensure both frontend (3000) and backend (3001) are running

### Movies not loading in browser
- Open DevTools (F12) and check Console tab for errors
- Verify `movies_dataset.csv` is in the correct path
- Try hard refreshing the page (Ctrl+Shift+R)
- Check that the CSV file size is reasonable (~5-10MB)

### Port Already in Use
```bash
# Windows - Find and kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac - Find and kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Common Error: "Invalid or empty messages"
- Ensure you're sending proper message format to `/api/openai/chat` endpoint
- Messages must be an array with at least one message object
- Each message needs `role` ("user" or "assistant") and `content` fields

## 📈 Performance

- **Movie loading**: ~1 second for 10,000 movies
- **Search response**: <100ms for filtered results
- **AI response**: 2-5 seconds depending on API latency
- **Chat streaming**: Real-time via OpenAI streaming

## 🚀 Deployment

### Deploy Backend (Proxy Server)
The proxy server is the crucial component - it keeps your API key secure and handles all AI requests.

**Options:**
- **Heroku**: `git push heroku main`
- **Railway.app**: Connect GitHub repo, auto-deploys
- **Render.com**: Managed platform, easy setup
- **AWS Lambda**: Serverless option for low traffic
- **Your own VPS**: Full control with a Linux server

**Important**: Always set `AIML_API_KEY` in your hosting platform's environment variables.

### Deploy Frontend (React App)
The frontend is a static app that connects to your deployed backend.

**Options:**
- **Vercel**: `vercel deploy` (Recommended - made by Next.js creators)
- **Netlify**: `netlify deploy` (Great for React CRA)
- **GitHub Pages**: Free static hosting (for public projects)
- **AWS S3 + CloudFront**: Scalable static hosting
- **Firebase Hosting**: Google's static hosting solution

**Before deploying front-end**, update the API URL in `.env.local`:
```env
REACT_APP_API_URL=https://your-deployed-proxy-url.com
```

### Full Deployment Example (Railway.app)
1. Deploy backend first:
   - Push repo to GitHub
   - Connect to Railway, select the `cinematch-ai-proxy` directory
   - Add environment variable: `AIML_API_KEY=your-key`
   - Get the deployed URL (e.g., `https://app-xyz.railway.app`)
2. Deploy frontend:
   - Connect frontend folder to another Railway service
   - Add `REACT_APP_API_URL=https://app-xyz.railway.app`
   - Deploy

Both services now work in production with Gemma 3n 4B powering all recommendations!

## 📝 Environment Variables

### Backend (.env in cinematch-ai-proxy)
| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `AIML_API_KEY` | ✅ YES | N/A | AiML API authentication key (get free at aimlapi.com) |
| `PORT` | NO | 3001 | Server port to listen on |
| `NODE_ENV` | NO | development | Environment type (development/production) |
| `CORS_ORIGIN` | NO | localhost:3000 | Allowed frontend URLs (comma-separated) |

### Frontend (.env.local in movie-recommender-app)
| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `REACT_APP_API_URL` | NO | http://localhost:3001 | Backend proxy server URL |
| `REACT_APP_MOVIES_CSV_PATH` | NO | /movies_dataset.csv | Path to movies dataset |

### Example Backend .env
```env
AIML_API_KEY=sk-your-key-from-aimlapi-here
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

### Example Frontend .env.local
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_MOVIES_CSV_PATH=/movies_dataset.csv
```

## 🎓 Learning Resources

- [AiML API Documentation](https://www.aimlapi.com/docs) - API reference & examples
- [Gemma Model Info](https://ai.google.dev/gemma) - About the Gemma 3n 4B model
- [React Documentation](https://react.dev) - React framework docs
- [Express.js Guide](https://expressjs.com) - Node.js web framework
- [Tailwind CSS Docs](https://tailwindcss.com) - Utility-first CSS framework
- [TMDB API](https://www.themoviedb.org/settings/api) - Movie database API

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- **TMDB** - Movie database (The Movie Database)
- **Kaggle Dataset** - [Movies Dataset](https://www.kaggle.com/datasets/saketsingh9728/movies-dataset) by Saket Singh - 10K movies extracted from TMDB, perfect for data cleaning, preprocessing, feature engineering, and building recommendation systems. *Please upvote on Kaggle if you find the dataset relevant!*
- **AiML API** - Gemma Model API (open-source, cost-effective LLM)
- **React Team** - Framework and documentation
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

## 📞 Support & Help

**Getting Started?**
- 🪟 Windows: Run `start-windows.bat` for automatic setup
- 🐧 Linux/Mac: Run `./start.sh` for automatic setup
- 📖 Read [QUICKSTART.md](./QUICKSTART.md) for 5-minute setup

**Having Issues?**
1. Check [Troubleshooting](#-troubleshooting) section above
2. Review [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) for detailed help
3. Check [CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md) to understand recent improvements
4. See specific component docs:
   - Backend: [cinematch-ai-proxy/README.md](./cinematch-ai-proxy/README.md)
   - Frontend: [movie-recommender-app/README.md](./movie-recommender-app/README.md)

**Common Questions:**
- Q: "Where do I get an AiML API key?"  
  A: Free at [www.aimlapi.com](https://www.aimlapi.com) - just sign up!
- Q: "Does the AI remember what I said?"  
  A: Yes! Full conversation history is maintained in the chat.
- Q: "Can I deploy this?"  
  A: Yes! See [Deployment](#-deployment) section above.
- Q: "How many movies can it recommend?"  
  A: From 10,000+ in the database, plus AI can create new suggestions based on your preferences.

---

**Made with ❤️ for movie lovers and AI enthusiasts**

Start discovering movies with AI today! 🍿🎬✨
