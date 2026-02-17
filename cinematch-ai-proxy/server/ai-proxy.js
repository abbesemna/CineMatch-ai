/**
 * AI Proxy Server for CineMatch AI
 * Handles OpenAI API requests securely without exposing API keys to frontend
 * Provides real-time streaming responses for movie recommendations and chatbot
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Use native fetch (available in Node 18+)
// No need to import anything - fetch is built-in

const app = express();
const PORT = process.env.PORT || 3001;

// Enhanced CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Pre-flight requests
app.use(express.json({ limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  const health = {
    status: 'ok',
    service: 'CineMatch AI Proxy',
    timestamp: new Date().toISOString(),
    apiKey: process.env.OPENAI_API_KEY ? '✅ Configured' : '❌ Missing'
  };
  console.log('✅ Health check passed');
  res.json(health);
});

/**
 * OpenAI Chat Completion Proxy
 * POST /api/openai/chat
 * 
 * Secure proxy endpoint that:
 * - Accepts chat messages from the frontend
 * - Calls AiML API (Gemma 3n 4B) securely with API key hidden
 * - Returns responses to the client
 * 
 * NOTE: Gemma 3n 4B does not support system role - only user and assistant roles
 */
app.post('/api/openai/chat', async (req, res) => {
  try {
    const { messages, temperature = 0.8, max_tokens = 1000 } = req.body;
    
    // Use fixed model for AiML API
    const model = 'google/gemma-3n-e4b-it';

    // === VALIDATION ===
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.warn('⚠️  Invalid messages format received');
      return res.status(400).json({ 
        error: 'Invalid or empty messages',
        message: 'Please provide an array of message objects'
      });
    }

    // === API KEY CHECK ===
    const apiKey = process.env.AIML_API_KEY;
    if (!apiKey) {
      console.error('❌ ERROR: AiML API key not configured');
      return res.status(500).json({ 
        error: 'API Key Error',
        message: 'AiML API key not configured. Please set AIML_API_KEY in .env file',
        solution: 'Create a .env file with AIML_API_KEY=your-key-here'
      });
    }

    console.log(`🔄 Processing ${messages.length} messages with model: google/gemma-3n-e4b-it`);

    // === CALL AIML API VIA FETCH ===
    try {
      const response = await fetch('https://api.aimlapi.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemma-3n-e4b-it',
          messages: messages,
          temperature: Math.min(Math.max(temperature, 0), 2),
          max_tokens: Math.min(max_tokens, 2000)
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ AiML API Error (${response.status}):`, errorText);
        
        let errorDetails = {};
        try {
          errorDetails = JSON.parse(errorText);
        } catch (e) {
          errorDetails = { raw_error: errorText };
        }

        return res.status(response.status).json({ 
          error: 'AiML API Request Failed',
          status: response.status,
          details: errorDetails,
          message: 'Please check your API key and request format'
        });
      }

      const data = await response.json();
      
      // Validate response structure
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('❌ Invalid AiML response structure:', data);
        return res.status(500).json({ 
          error: 'Invalid API Response',
          message: 'AiML API returned unexpected response format'
        });
      }

      console.log(`✅ Response generated - Tokens used: ${data.usage?.total_tokens || 'unknown'}`);
      
      // Return the response to client
      res.json({
        choices: [
          {
            message: data.choices[0].message,
            finish_reason: data.choices[0].finish_reason
          }
        ],
        usage: data.usage,
        model: data.model
      });

    } catch (fetchError) {
      console.error(`❌ AiML API Fetch Error:`, fetchError.message);
      
      return res.status(500).json({ 
        error: 'Network Error',
        message: fetchError.message,
        details: 'Failed to connect to AiML API'
      });
    }

  } catch (error) {
    console.error('❌ Proxy Server Error:', error.message);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
  console.error('❌ Unhandled Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  console.warn(`⚠️  404 - Unknown endpoint: ${req.path}`);
  res.status(404).json({
    error: 'Not Found',
    message: `Endpoint ${req.path} does not exist`,
    available: ['/health', '/api/openai/chat']
  });
});

// === START SERVER ===
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 CineMatch AI Proxy Server Started');
  console.log('='.repeat(60));
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log(`🔗 Chat API endpoint: http://localhost:${PORT}/api/openai/chat`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log('='.repeat(60));
  
  // === CHECK API KEY STATUS ===
  if (!process.env.AIML_API_KEY) {
    console.warn('\n⚠️  WARNING: AIML_API_KEY not configured!');
    console.warn('📝 Setup Instructions:');
    console.warn('   1. Create a .env file in the server directory');
    console.warn('   2. Add: AIML_API_KEY=your-actual-key-here');
    console.warn('   3. Get your key from: https://www.aimlapi.com\n');
  } else {
    console.log('✅ AiML API key is configured and ready\n');
  }

  console.log('ℹ️  The frontend should call: http://localhost:3001/api/openai/chat');
  console.log('ℹ️  Make sure the frontend is running on http://localhost:3000\n');
});

module.exports = app;
