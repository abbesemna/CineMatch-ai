# 🎬 CineMatch AI - Intelligent Movie Recommendation Engine

[![React](https://img.shields.io/badge/React-18+-blue)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green)](https://nodejs.org/)
[![Gemma Model](https://img.shields.io/badge/AiML%20API-Gemma%203n%204B-green)](https://aimlapi.com)
[![License](https://img.shields.io/badge/License-MIT-yellow)](#license)

An intelligent movie recommendation platform powered by **Gemma 3n 4B** AI model via AiML API. Features mood-based filtering, real-time AI chat, advanced search, and access to 10,000+ movies from TMDB.

## ✨ Features

### Smart Movie Discovery
- **10,000+ TMDB Movies** - Comprehensive database with ratings & metadata
- **Advanced Search** - Find by title, genre, year, description, and keywords
- **Mood-Based Filtering** - Intelligent genre-to-mood mapping for discovery
- **Real-Time Filtering** - Instant results with live pagination
- **Movie Details** - Ratings, overview, genres, release date, and more

### AI-Powered Chatbot (Powered by Gemma 3n 4B)
- **Conversational Interface** - Chat naturally about movies and moods
- **Smart Recommendations** - AI extracts movie recommendations from natural text
- **Real-Time Streaming** - Responsive answers that appear as they're generated

## 📊 Dataset Information

### Kaggle Movies Dataset

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

## Architecture Overview

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




## Project Structure

```
CineMatch-ai/
│
├── 🎬 movie-recommender-app/        (React Frontend - Port 3000)
│   ├── public/
│   │   ├── index.html               (HTML template)
│   │   ├── movies_dataset.csv       (10K movies from Kaggle/TMDB dataset)
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
└── 🚀 start.sh                      (Linux/Mac startup)
```

## Quick Start (Choose Your OS)

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

## Prerequisites

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

## How to Use

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



## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library
- **Tailwind CSS** - Utility-first styling framework
- **Lucide React** - Beautiful icon library
- **JavaScript ES6+** - Modern JavaScript

### Backend (Proxy Server)
- **Express.js** - Web framework
- **Node.js** - JavaScript runtime

### AI & Data Layer
- **AiML API** - Gemma 3n 4B model (cost-effective, fast, open-source LLM)
- **Movie Dataset** - 10,000+ movies from TMDB via [Kaggle Dataset](https://www.kaggle.com/datasets/saketsingh9728/movies-dataset) (Up-to-date as of Feb 6, 2026)

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







## 🎓 Learning Resources

- [AiML API Documentation](https://www.aimlapi.com/docs) - API reference & examples
- [Gemma Model Info](https://ai.google.dev/gemma) - About the Gemma 3n 4B model
- [React Documentation](https://react.dev) - React framework docs
- [Express.js Guide](https://expressjs.com) - Node.js web framework
- [Tailwind CSS Docs](https://tailwindcss.com) - Utility-first CSS framework
- [TMDB API](https://www.themoviedb.org/settings/api) - Movie database API

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

## Acknowledgments

- **Kaggle Dataset** - [Movies Dataset](https://www.kaggle.com/datasets/saketsingh9728/movies-dataset) by Saket Singh - 10K movies extracted from TMDB, perfect for data cleaning, preprocessing, feature engineering, and building recommendation systems. *Please upvote on Kaggle if you find the dataset relevant!*
- **AiML API** - Gemma Model API (open-source, cost-effective LLM)
  
---

**Made with ❤️ for movie lovers and AI enthusiasts**

Start discovering movies with AI today! 🍿🎬✨
