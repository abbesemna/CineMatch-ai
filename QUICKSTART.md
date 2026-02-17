#  Quick Start - Get Running in 5 Minutes

## Prerequisites
- Node.js 14+ ([Download](https://nodejs.org/))
- npm (comes with Node.js)
- AiML API key ([Get free key](https://www.aimlapi.com))

## Step 1 - Get Your AiML API Key (2 min)

1. Go to **[www.aimlapi.com](https://www.aimlapi.com)**
2. Sign in to your AiML account (or create one)
3. Navigate to **API Keys section**
4. Click **"Create new API key"**
5. **Copy the key** - you won't see it again!
6. **Keep it safe** - treat like a password

## Step 2 - Setup Backend Proxy Server (1 min)

`bash
# Navigate to backend
cd cinematch-ai-proxy

# Install dependencies
npm install

# Create .env file with your API key
# On Windows:
echo AIML_API_KEY=your-key-here > .env
echo PORT=3001 >> .env

# On Mac/Linux:
cat > .env << EOF
AIML_API_KEY=your-key-here
PORT=3001
NODE_ENV=development
EOF
`

 **Your .env should look like:**
`env
AIML_API_KEY=your-actual-key-here
PORT=3001
NODE_ENV=development
`

## Step 3 - Start Backend Server (0 min)

`bash
# Still in cinematch-ai-proxy directory
npm start
`

 You should see:
`
 CineMatch AI Proxy Server Started
 Server running on: http://localhost:3001
 AiML API key is configured and ready
`

**Keep this terminal open!** The server must run while using the app.

## Step 4 - Start Frontend (0 min)

**Open a NEW terminal window** and run:

`bash
# Navigate to frontend
cd movie-recommender-app

# Install dependencies
npm install

# Start the app
npm start
`

 **App automatically opens at http://localhost:3000**

If it doesn't open automatically, visit: **http://localhost:3000**

##  You're Done! Start Using CineMatch AI

### Quick Test
1. **Search**: Type "action" in search box
2. **Filter**: Click "Excited" mood button
3. **Chat**: Click "AI Chat" button, ask "What's a funny movie?"
4. **Details**: Click any movie poster

##  Common Issues

### "Cannot connect to proxy"
`
Solution: Check proxy server is running
- Look at the first terminal window
- Should show: "Server running on: http://localhost:3001"
- If not, go back to Step 3
`

### "API key error"
`
Solution: Check your .env file
- Go to cinematch-ai-proxy/.env
- Make sure AIML_API_KEY=your-key is correct
- No quotes around the key!
- Restart server after editing
`

### "Movies not loading"
`
Solution: Clear cache and refresh
- Press Ctrl+Shift+R (hard refresh)
- Or open DevTools (F12) > Network tab
`

### Still stuck?
 Read [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) for detailed help

##  Important Endpoints

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | React app |
| Backend | http://localhost:3001 | API proxy (AiML) |
| Health Check | http://localhost:3001/health | Server status |

##  Next Steps

- Explore 10,000+ movies
- Chat with AI (powered by Gemma 3n 4B) for recommendations
- Filter by mood and genre
- Try different searches

**Enjoy discovering movies! **
