# ✅ CineMatch AI - Pre-Launch Checklist

Complete this checklist to ensure everything is properly configured before running the application.

## 📋 Prerequisites Check

- [ ] **Node.js v14+** installed
  ```bash
  node --version  # Should show v14.0.0 or higher
  ```
  
- [ ] **npm** available
  ```bash
  npm --version   # Should show 6.0.0 or higher
  ```

- [ ] **AiML Account** created
  - Go to https://www.aimlapi.com
  - Sign in or create account

## 🔑 API Key Setup

- [ ] **AiML API Key Generated**
  - Go to https://www.aimlapi.com
  - Create or copy your API key from the dashboard
  - Save it somewhere safe

## 🔧 Configuration Setup

### Backend Server Configuration

- [ ] **Navigate to backend directory**
  ```bash
  cd cinematch-ai-proxy
  ```

- [ ] **.env file created**
  - [ ] On Windows: Run `echo AIML_API_KEY=your-key > .env`
  - [ ] On Mac/Linux: Create manually or use provided script
  - [ ] File contains: `AIML_API_KEY=your-api-key-here`
  - [ ] File contains: `PORT=3001`

- [ ] **Verify .env file exists**
  ```bash
  cat .env  # Should show your API key
  ```

- [ ] **Dependencies installed**
  ```bash
  npm install
  # Should complete with no errors
  ```

### Frontend Configuration

- [ ] **Navigate to frontend directory**
  ```bash
  cd ../movie-recommender-app
  ```

- [ ] **.env.local file exists** (optional, but ensure project has it)

- [ ] **Movie dataset exists**
  - [ ] Check `public/movies_dataset.csv` exists
  - [ ] File is not empty (>1MB)

- [ ] **Dependencies installed**
  ```bash
  npm install
  # Should complete with no errors
  ```

## 🚀 Pre-Startup Verification

### Backend Server Checks

- [ ] **Port 3001 is available**
  ```bash
  # Windows:
  netstat -ano | findstr :3001
  # If nothing shows, port is free
  
  # Mac/Linux:
  lsof -i :3001
  # If "command not found", port is free
  ```

- [ ] **API key format correct**
  - [ ] Starts with `sk-`
  - [ ] At least 20 characters long
  - [ ] No quotes around it in .env
  - [ ] No extra spaces

### Frontend Checks

- [ ] **Port 3000 is available**
  ```bash
  # Windows:
  netstat -ano | findstr :3000
  
  # Mac/Linux:
  lsof -i :3000
  ```

- [ ] **Directory structure correct**
  ```
  movie-recommender-app/
  ├── src/
  │   ├── App.js       ✓
  │   ├── index.js     ✓
  │   └── ai/
  │       └── recommenderAI.js  ✓
  ├── public/
  │   ├── index.html   ✓
  │   └── movies_dataset.csv    ✓
  ├── package.json     ✓
  └── node_modules/    ✓ (created after npm install)
  ```

## 📊 Health Check

Before launching full app, verify each component:

### 1. Test Backend Server

```bash
# Terminal 1 - Start backend
cd cinematch-ai-proxy
npm start

# Should see:
# ✅ CineMatch AI Proxy Server Started
# 📍 Server running on: http://localhost:3001
# 🔑 OpenAI API key configured
```

### 2. Test Health Endpoint

```bash
# Terminal 2 - Test the server
curl http://localhost:3001/health

# Should return:
# {"status":"ok","service":"CineMatch AI Proxy","apiKey":"✅ Configured"}
```

### 3. Test Frontend Server

```bash
# Terminal 3 - Start frontend
cd movie-recommender-app
npm start

# Should see:
# Compiled successfully!
# App runs on: http://localhost:3000
```

### 4. Test in Browser

- [ ] Open http://localhost:3000 in browser
- [ ] Movies load in grid
- [ ] Can search movies
- [ ] Can click mood buttons
- [ ] Can open AI Chat panel
- [ ] Chat input box is enabled

## 🎯 Startup Procedure

### Option A: Automated (Windows)
```bash
./start-windows.bat
# Automatically handles everything
```

### Option B: Automated (Mac/Linux)
```bash
chmod +x start.sh  # Make executable (first time only)
./start.sh
# Automatically starts both servers
```

### Option C: Manual
```bash
# Terminal 1 - Backend
cd cinematch-ai-proxy
npm start

# Terminal 2 - Frontend (wait ~3 seconds)
cd movie-recommender-app
npm start
```

## 🧪 First-Time User Test

After everything is running:

1. [ ] **Movie Loading**
   - [ ] Grid shows movies
   - [ ] Count shows 10,000+ movies
   - [ ] Can scroll through pages

2. [ ] **Search Testing**
   - [ ] Type "action" → shows action movies
   - [ ] Type "2023" → shows 2023 movies
   - [ ] Clear search → shows all movies

3. [ ] **Mood Filtering**
   - [ ] Click "Excited" → fewer movies shown
   - [ ] Selected mood highlighted
   - [ ] Different movies displayed

4. [ ] **Movie Details**
   - [ ] Click movie poster → modal opens
   - [ ] Shows title, rating, date, genres
   - [ ] Popularity and overview visible

5. [ ] **Chat Testing**
   - [ ] Click "AI Chat" → panel opens
   - [ ] Type "recommend a funny movie"
   - [ ] Hit Enter
   - [ ] Wait 2-5 seconds for response
   - [ ] AI recommends movies
   - [ ] Recommended movies shown below

6. [ ] **Full Conversation**
   - [ ] Ask: "Something action instead"
   - [ ] AI acknowledges and changes genre
   - [ ] Shows new action recommendations


## 🚨 Troubleshooting During Setup

### "Node not found"
```
✓ Install Node.js from https://nodejs.org/
✓ Restart terminal after installation
✓ Verify: node --version
```

### ".env file not found"
```
✓ Create in cinematch-ai-proxy directory
✓ Add: OPENAI_API_KEY=sk-your-key-here
✓ Add: PORT=3001
✓ Save and restart backend
```

### "Port already in use"
```
Option 1: Close other Node applications
Option 2: Change PORT in .env (3001 → 3002)
Option 3: Restart computer
```

### "API key rejected"
```
✓ Verify key starts with sk-
✓ Check no extra spaces in .env
✓ Go to https://platform.openai.com/
✓ Verify key hasn't been deactivated
✓ Generate new key if needed
```

### "Cannot reach localhost:3000"
```
✓ Verify frontend process is running
✓ Check terminal for error messages
✓ Try: npm start in movie-recommender-app/
```

### "Chat not responding"
```
✓ Backend running? Check terminal 1
✓ API key valid? Test health endpoint
✓ Port 3001 accessible? Check firewall
✓ Look at browser console (F12) for errors
✓ Look at server terminal for error logs
```

## 📈 Performance Expectations

| Task | Expected Time |
|------|---|
| npm install (backend) | 30-60 seconds |
| npm install (frontend) | 1-2 minutes |
| Backend startup | 1-2 seconds |
| Frontend startup | 5-10 seconds |
| App fully loaded | <15 seconds total |
| Movie loading (10,000) | ~1 second |
| Chat response | 2-5 seconds |
| Search filtering | <100ms |

## ✅ Final Verification

Before declaring "ready", verify:

- [ ] Both servers running without errors
- [ ] Frontend accessible at http://localhost:3000
- [ ] Movies display in grid properly
- [ ] Can search and filter
- [ ] Can click movies for details
- [ ] Chat opens and accepts input
- [ ] Chat sends request successfully
- [ ] AI responds with recommendations
- [ ] Browser console (F12) has no red errors
- [ ] Terminal shows successful requests logs

## 🎉 You're Ready!

If all checks pass, you're ready to:
- Browse 10,000+ movies
- Filter by mood and genre
- Search for specific titles
- Chat with AI about movies
- Get personalized recommendations

## 📞 Still Having Issues?

1. Read: [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)
2. Check: Server terminal for error messages
3. Verify: Browser console (F12 > Console tab)
4. Review: [Troubleshooting Section](./SETUP_INSTRUCTIONS.md#-troubleshooting)

---

**Happy movie hunting! 🍿🎬✨**
