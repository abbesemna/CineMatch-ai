#!/bin/bash
# CineMatch AI - Start both frontend and backend servers (Linux/Mac)
# Usage: ./start.sh

set -e  # Exit on any error

echo ""
echo "============================================================"
echo "  🎬  CineMatch AI - Starting Application"
echo "============================================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please download from: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo ""

# Check if .env exists in backend
if [ ! -f cinematch-ai-proxy/.env ]; then
  echo "⚠️  Backend .env file not found!"
  echo ""
  echo "📝 Create your .env file:"
  echo "   1. Go to https://www.aimlapi.com"
  echo "   2. Get your AiML API key"
  echo ""
  read -p "Enter your AiML API key: " APIKEY
  
  if [ -z "$APIKEY" ]; then
    echo "❌ No API key provided. Setup cancelled."
    exit 1
  fi
  
  cat > cinematch-ai-proxy/.env << EOF
AIML_API_KEY=$APIKEY
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
EOF
  
  echo "✓ .env file created"
  echo ""
fi

# Function to cleanup on exit
cleanup() {
  echo ""
  echo "🛑 Shutting down..."
  kill $BACKEND_PID 2>/dev/null || true
  wait $BACKEND_PID 2>/dev/null || true
  echo "✓ Backend stopped"
  exit 0
}

# Set trap to cleanup on Ctrl+C
trap cleanup SIGINT SIGTERM

# Check if dependencies need installing
if [ ! -d "cinematch-ai-proxy/node_modules" ]; then
  echo "📦 Installing backend dependencies (first time only)..."
  cd cinematch-ai-proxy
  npm install
  cd ..
  echo "✓ Backend dependencies installed"
  echo ""
fi

if [ ! -d "movie-recommender-app/node_modules" ]; then
  echo "📦 Installing frontend dependencies (first time only)..."
  cd movie-recommender-app
  npm install
  cd ..
  echo "✓ Frontend dependencies installed"
  echo ""
fi

# Start backend in background
echo "🔌 Starting backend proxy server..."
cd cinematch-ai-proxy
npm start &
BACKEND_PID=$!
echo "✅ Backend started on http://localhost:3001"
echo ""

# Wait for backend to start
sleep 2

# Start frontend
cd ../movie-recommender-app
echo "🌐 Starting React frontend..."
echo "✅ Frontend will open on http://localhost:3000"
echo ""
echo "============================================================"
echo "  Application is running!"
echo "============================================================"
echo ""
echo "  🌐 Frontend: http://localhost:3000"
echo "  🔌 API Server: http://localhost:3001"
echo "  📊 Health Check: http://localhost:3001/health"
echo ""
echo "  Press Ctrl+C to stop both servers"
echo ""
echo "============================================================"
echo ""

npm start

# Keep backend running
wait $BACKEND_PID

echo "🎨 Starting frontend (port 3000)..."
cd ../movie-recommender-app
npm install 2>/dev/null
npm start

# If we get here, frontend was stopped. Kill backend too.
kill $BACKEND_PID 2>/dev/null
echo "👋 All servers stopped"
