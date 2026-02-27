# CineMatch AI - Complete Setup Guide

A full-featured movie recommendation website with AI chatbot powered by AiML API (Gemma 3n 4B model).

## Project Architecture

```
┌─────────────────────────┐
│  React Frontend App     │
│ (Port 3000)            │
│ - Movie Browsing       │
│ - Mood-based Filters   │
│ - AI Chat Panel        │
└────────────┬────────────┘
             │ HTTP
             ↓
┌─────────────────────────┐
│  AI Proxy Server        │
│ (Port 3001)            │
│ - Secure API Gateway   │
│ - AiML API Proxy       │
│ - Request Processing   │
└────────────┬────────────┘
             │ HTTPS
             ↓
┌─────────────────────────┐
│  AiML API               │
│  (Cloud)               │
│  - Gemma 3n 4B Model   │
│  - Movie Recommendations│
└─────────────────────────┘
```

## Prerequisites

- **Node.js** v14+ ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **AiML API Key** ([Get free key](https://www.aimlapi.com))

## Quick Start (5 Minutes)

### 1. Get Your AiML API Key

1. Go to [www.aimlapi.com](https://www.aimlapi.com)
2. Log in or create an account
3. Navigate to API Keys section
4. Create new API key
5. Copy the key safely

### 2. Setup API Proxy Server

```bash
# Navigate to server directory
cd cinematch-ai-proxy

# Install dependencies
npm install

# Create .env file with your API key
echo AIML_API_KEY=your-key-here > .env
echo PORT=3001 >> .env
echo NODE_ENV=development >> .env

# Start the server
npm start
```

You should see:
```
CineMatch AI Proxy Server Started
📍 Server running on: http://localhost:3001
AiML API key is configured and ready
```

**Keep this terminal open!** The server must run constantly.

### 3. Setup React Frontend Application

In a **new terminal window**:

```bash
# Navigate to frontend directory
cd movie-recommender-app

# Install dependencies
npm install

# Create .env.local file (optional - already configured by default)
echo REACT_APP_API_URL=http://localhost:3001 > .env.local

# Start the development server
npm start
```

The app will open automatically at `http://localhost:3000`

## Features

### Movie Browsing
- **10,000+ movies** from TMDB dataset
- **Smart search** by title, genre, year, or description
- **Mood-based filtering** with intelligent genre matching
- **Rating & popularity** sorting
- **Responsive grid** layout with poster images

### AI Chatbot
- **Real-time conversation** about movies
- **Mood-aware** recommendations
- **Context memory** across multiple messages
- **Natural responses** using Gemma 3n 4B model
- **Movie extraction** - automatically finds mentioned movies

### Mood Selection
- Happy, Sad/Melancholic, Excited, Relaxed
- Thrilled (Horror/Thriller), Romantic
- Thoughtful, Adventurous
- **Auto-filters** movies based on mood

### 💬 Real-Time Chat Features
- Conversational interface
- Streaming responses (via proxy)
- Movie recommendations in chat
- Mood context awareness
- Conversation history

## Project Structure

```
project-ai/
├── cinematch-ai-proxy/          # Express.js backend server
│   ├── server/
│   │   └── ai-proxy.js          # Main proxy server
│   ├── .env                      # API keys (create this)
│   ├── .env.example              # Template for .env
│   ├── package.json              # Dependencies
│   └── README.md                 # Server docs
│
└── movie-recommender-app/       # React frontend app
    ├── src/
    │   ├── App.js               # Main component
    │   ├── ai/
    │   │   └── recommenderAI.js # AI utilities
    │   ├── index.js             # Entry point
    │   └── index.css            # Styles
    ├── public/
    │   ├── index.html           # HTML template
    │   └── movies_dataset.csv   # Movie database
    ├── .env.local               # Frontend config
    ├── package.json             # Dependencies
    └── README.md                # Frontend docs
```

## 🔧 Configuration

### Server Configuration (.env)

```env
# Required - Your AiML API Key (from www.aimlapi.com)
AIML_API_KEY=your-actual-key-here

# Optional - Server settings
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

### Frontend Configuration (.env.local)

```env
# API Proxy endpoint
REACT_APP_API_URL=http://localhost:3001

# Movie database path
REACT_APP_MOVIES_CSV_PATH=/movies_dataset.csv
```

## 🔐 API Security

### Why a Proxy Server?
- ✅ **Hides API Keys** - your AiML API key never reaches the client
- ✅ **Rate Limiting** - can control request frequency
- ✅ **Validation** - sanitizes requests before sending to AiML API
- ✅ **Logging** - tracks API usage and errors
- ✅ **CORS Handling** - manages cross-origin requests safely

### Request Flow
```
Client (Browser)
  ↓ POST /api/chat
Proxy Server (Node.js)
    ↓ POST https://api.aimlapi.com/v1/chat/completions
    ↓ + Authorization: Bearer [HIDDEN API KEY]
AiML API
    ↓ returns response
Proxy Server
    ↓ returns to client
Client receives recommendations
```

## Troubleshooting

### "Cannot connect to proxy server"
```
Error: Failed to fetch from http://localhost:3001
```
**Solution:** Make sure proxy server is running
```bash
cd cinematch-ai-proxy
npm start
# Should show: Server running on: http://localhost:3001
```

### "AIML_API_KEY not configured"
```
Error: AiML API key not configured
```
**Solution:** Create .env file with your key
```bash
cd cinematch-ai-proxy
echo AIML_API_KEY=your-key-here > .env
npm start
```

### "API Error: 401 Unauthorized"
```
Error: AiML API Error (401)
```
**Solutions:**
- Check your API key is correct (no extra spaces)
- Verify key is active in AiML dashboard
- Generate a new key from aimlapi.com

### Chat not responding
```
Issues: Chat sending but no response
```
**Checklist:**
1. Is proxy server running on port 3001?
2. Is API key set in .env?
3. Check browser console (F12) for errors
4. Check server terminal for error messages

### Movies not loading
```
"Loading movie database..." stays visible
```
**Solutions:**
- Check `public/movies_dataset.csv` exists
- Open browser DevTools (F12 > Console) for errors
- Try refreshing the page
- Clear cache: Ctrl+Shift+Del

### CORS errors
```
No 'Access-Control-Allow-Origin' header
```
**Solution:** Make sure proxy server CORS is configured correctly
In `ai-proxy.js`, verify CORS origins include your frontend URL.

## API Endpoints

### Health Check
```http
GET http://localhost:3001/health
```
Returns:
```json
{
  "status": "ok",
  "service": "CineMatch AI Proxy",
  "apiKey": "✅ Configured"
}
```

### Chat Completion (AiML API - Gemma 3n 4B)
```http
POST http://localhost:3001/api/chat
Content-Type: application/json

{
  "messages": [
    {
      "role": "user",
      "content": "What's a good comedy movie?"
    }
  ],
  "temperature": 0.8,
  "max_tokens": 1000
}
```

Returns:
```json
{
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "I'd recommend 'The Grand Budapest Hotel' for a quirky comedy..."
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 120,
    "completion_tokens": 45,
    "total_tokens": 165
  }
}
```

## 🌐 Environment Variables Reference

| Variable | Server | Frontend | Required | Default |
|----------|--------|----------|----------|---------|
| `AIML_API_KEY` | ✅ | ❌ | YES | - |
| `PORT` | ✅ | ❌ | NO | 3001 |
| `NODE_ENV` | ✅ | ❌ | NO | development |
| `REACT_APP_API_URL` | ❌ | ✅ | NO | http://localhost:3001 |

## Usage Examples

### Via Chat Interface
```
User: "I'm feeling sad today"
AI: "I'm sorry you're feeling down. How about 'The Shawshank 
Redemption' for an uplifting drama, or 'Good Will Hunting' 
for inspiration?"

User: "Something funny instead"
AI: "Perfect! Try 'The Grand Budapest Hotel' for quirky humor,
'Superbad' for hilarious coming-of-age comedy, or '21 Jump Street'
for action-comedy fun!"
```

### Via Mood Selection
1. Click mood button (e.g., "Excited")
2. Filtered movies appear with matching genres
3. Click a movie for details
4. Open AI Chat for personalized recommendations

### Via Search
- Type in search bar: movie title, genre, year, or description
- Results update in real-time
- Click movie for full details

## 🤝 Contributing

To improve the chatbot or add features:

1. Edit `src/app.js` for UI changes
2. Edit `src/ai/recommenderAI.js` for AI logic
3. Edit `cinematch-ai-proxy/server/ai-proxy.js` for API changes
4. Test thoroughly before committing

## 📝 Notes

- **Movie Dataset**: 10,000+ movies from TMDB (public dataset)
- **AI Model**: Gemma 3n 4B (cost-effective, fast, open-source)
- **Frontend**: React 18 with Tailwind CSS
- **Styling**: Glassmorphism design with gradients
- **Icons**: Lucide React library

## 🔗 Key Resources

- [AiML API Docs](https://www.aimlapi.com/docs)
- [AiML Pricing](https://www.aimlapi.com/pricing)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Tailwind CSS Docs](https://tailwindcss.com)

## 📞 Support

If you encounter issues:

1. **Check logs**: Look at both server and browser console
2. **Test health endpoint**: `curl http://localhost:3001/health`
3. **Verify API key**: Make sure it's a valid OpenAI key
4. **Check network**: Ensure proxy server is running
5. **Clear cache**: Hard refresh browser cache

Your CineMatch AI movie recommendation website is ready!

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001/api/chat
- **Health Check**: http://localhost:3001/health

Enjoy finding the perfect movies through intelligent AI recommendations!
