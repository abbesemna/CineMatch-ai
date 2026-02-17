# 🔌 CineMatch AI Proxy Server

[![Express](https://img.shields.io/badge/Express-4.18-blue)](https://expressjs.com)
[![Node](https://img.shields.io/badge/Node-14+-green)](https://nodejs.org)
[![Gemma Model](https://img.shields.io/badge/AiML%20API-Gemma%203n%204B-green)](https://aimlapi.com)

A **secure Express.js proxy server** for AiML API requests (Gemma 3n 4B model). Keeps your API key safe on the backend while serving the React frontend.

## 🔐 Why a Proxy?

**Direct Frontend Calls** ❌
```
Browser → Exposes API Key → AiML API
Risk: Anyone can see your API key in browser network tab
Cost: API abuse from exposed keys
```

**Proxy Pattern** ✅
```
Browser → Proxy Server → (Hidden API Key) → AiML API
Safe: API key never exposed to frontend
Secure: Can validate & limit requests
Control: Easy to add rate limiting, logging, filtering
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API Key
```bash
# Create .env file
echo AIML_API_KEY=your-key-here > .env
echo PORT=3001 >> .env
echo NODE_ENV=development >> .env
```

### 3. Start Server
```bash
npm start
```

✅ **Server runs on: http://localhost:3001**

## 📝 Configuration

### Environment Variables (.env)

```env
# Required - Your AiML API Key from https://www.aimlapi.com
AIML_API_KEY=your-actual-key-here

# Optional - Server Configuration
PORT=3001                                    # Default: 3001
NODE_ENV=development                        # development or production
CORS_ORIGIN=http://localhost:3000          # Allowed frontend origins
```

⚠️ **Important:** Add `.env` to `.gitignore` - never commit API keys!

## 🔗 API Endpoints

### Health Check
```http
GET /health
```
Check server status and API key configuration.

**Response:**
```json
{
  "status": "ok",
  "service": "CineMatch AI Proxy",
  "timestamp": "2024-02-17T10:30:00Z",
  "apiKey": "✅ Configured"
}
```

### Chat Completion
```http
POST /api/chat
Content-Type: application/json
```

**Request:**
```json
{
  "model": "gemma-3n-4b",
  "messages": [
    {
      "role": "system",
      "content": "You are a movie recommendation expert..."
    },
    {
      "role": "user",
      "content": "Recommend a funny movie"
    }
  ],
  "temperature": 0.8,
  "max_tokens": 1000
}
```

**Response:**
```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "I'd recommend 'The Grand Budapest Hotel'..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 98,
    "completion_tokens": 45,
    "total_tokens": 143
  },
  "model": "gemma-3n-4b"
}
```

## 📦 Dependencies

```json
{
  "express": "^4.18.2",      // Web framework
  "cors": "^2.8.5",          // CORS middleware
  "node-fetch": "^2.7.0",    // HTTP requests
  "dotenv": "^16.3.1"        // Environment variables
}
```

## 🔧 Development

### Run with Hot Reload
```bash
npm run dev
```
Uses nodemon for automatic restarts on file changes.

### Run Production Build
```bash
npm start
```

## 🌐 Connecting from Frontend

### Setup in React
```javascript
// In your React component
const response = await fetch('http://localhost:3001/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gemma-3n-4b',
    messages: [
      {
        role: 'user',
        content: 'What movies do you recommend?'
      }
    ],
    temperature: 0.8,
    max_tokens: 1000
  })
});

const data = await response.json();
// Use data.choices[0].message.content
```

### Update Frontend URL
In `movie-recommender-app/.env.local`:
```env
REACT_APP_API_URL=http://localhost:3001
```

## 🚨 Error Handling

### 400 - Invalid Messages
```json
{
  "error": "Invalid or empty messages",
  "message": "Please provide an array of message objects"
}
```

### 401 - Missing API Key
```json
{
  "error": "API Key Error",
  "message": "AiML API key not configured",
  "solution": "Create a .env file with AIML_API_KEY=your-key-here"
}
```

### 429 - Rate Limited (AiML API)
```json
{
  "error": "AiML API Request Failed",
  "status": 429,
  "message": "Too many requests - please retry later"
}
```

### 500 - Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Error description",
  "timestamp": "2024-02-17T10:30:00Z"
}
```

## 📊 Server Logs

The server logs all requests with timestamps:
```
📨 2024-02-17T10:30:00Z - POST /api/chat
🔄 Processing 3 messages with model: gemma-3n-4b
✅ Response generated - Tokens used: 143
```

## 🧪 Testing with cURL

### Health Check
```bash
curl http://localhost:3001/health
```

### Send Chat Message
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemma-3n-4b",
    "messages": [{"role": "user", "content": "Hi"}]
  }'
```

## 🌍 Deployment

### Heroku
```bash
git push heroku main
heroku config:set AIML_API_KEY=your-key
```

### Vercel (Serverless)
Convert `ai-proxy.js` to serverless function in `/api` folder.

### AWS Lambda
Wrap Express app with Serverless framework.

### Railway / Render
Git push to auto-deploy, set environment variables in dashboard.

### Your Own Server
```bash
npm install -g pm2
pm2 start cinematch-ai-proxy/server/ai-proxy.js
pm2 save
pm2 startup
```

## 🐛 Troubleshooting

### Server won't start
```
Error: listen EADDRINUSE: address already in use :::3001
```
**Solution:** Port 3001 is already in use
```bash
# Kill the process on port 3001
# Windows: netstat -ano | findstr :3001 then taskkill /PID [PID]
# Mac/Linux: lsof -i :3001 | grep LISTEN then kill -9 [PID]
# Or change PORT in .env
```

### API key not recognized
```
Error: AiML API Error (401)
```
**Solutions:**
- Check API key doesn't have spaces in .env
- Verify key is from https://www.aimlapi.com
- Go to AiML dashboard, check API key is valid
- Check account has API credits

### CORS errors
```
Access to XMLHttpRequest blocked by CORS
```
**Solution:** Update `CORS_ORIGIN` in .env
```env
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com
```

### Empty responses
```
Response is null or incomplete
```
**Checklist:**
1. Check AiML API status: https://www.aimlapi.com
2. Verify API key is valid
3. No other errors in server logs
4. Check AiML account has active API credits

## 📈 Performance

- **Response time**: 2-5 seconds (depends on AiML API latency)
- **Concurrent requests**: 100+ (depends on Node.js memory)
- **Auto-scaling**: Easy to add with load balancers
- **Logging**: All requests logged with timestamps

## 📚 Resources

- [Express.js Docs](https://expressjs.com)
- [AiML API Documentation](https://www.aimlapi.com/docs)
- [CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [dotenv Package](https://github.com/motdotla/dotenv)

## 📄 License

MIT - Free to use and modify

## 🙏 Notes

- The proxy validates requests before sending to save API credits
- Responses are cached for 5 minutes (can be configured)
- Logging helps track API usage and debug issues
- CORS is open by default (restrict for production)

---

**Keep your API key safe. Always use a proxy!** 🔐

Questions? Check [SETUP_INSTRUCTIONS.md](../SETUP_INSTRUCTIONS.md) in the root project folder.

