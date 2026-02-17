/**
 * Test Script for CineMatch AI
 * Run this to verify your AI recommendation system is working
 */

const fetch = require('node-fetch');
require('dotenv').config();

// Test configuration
const PROXY_URL = 'http://localhost:3001';
const TEST_MESSAGES = [
  "I'm feeling really sad today",
  "I want something funny",
  "Actually, show me action movies instead",
  "What about romantic comedies?"
];

// Sample movies for testing
const SAMPLE_MOVIES = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    genre_ids: [18, 80],
    vote_average: 8.7,
    overview: "Two imprisoned men bond over a number of years..."
  },
  {
    id: 2,
    title: "The Dark Knight",
    genre_ids: [28, 18, 80],
    vote_average: 9.0,
    overview: "Batman faces the Joker..."
  },
  {
    id: 3,
    title: "Amélie",
    genre_ids: [35, 10749],
    vote_average: 8.3,
    overview: "A shy waitress decides to change the lives..."
  }
];

async function testProxyServer() {
  console.log('🧪 Testing CineMatch AI System\n');
  console.log('=' .repeat(60));
  
  try {
    // Test 1: Health Check
    console.log('\n📡 Test 1: Proxy Server Health Check');
    const healthResponse = await fetch(`${PROXY_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Status:', healthData.status);
    console.log('✅ Service:', healthData.service);
    
    // Test 2: OpenAI API Connection
    console.log('\n🤖 Test 2: OpenAI API Connection');
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful movie recommendation assistant.'
      },
      {
        role: 'user',
        content: 'Say "hello" if you can hear me.'
      }
    ];
    
    const apiResponse = await fetch(`${PROXY_URL}/api/openai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.8,
        max_tokens: 100
      })
    });
    
    if (!apiResponse.ok) {
      const error = await apiResponse.text();
      throw new Error(`API Error: ${error}`);
    }
    
    const apiData = await apiResponse.json();
    const aiResponse = apiData.choices[0].message.content;
    console.log('✅ AI Response:', aiResponse);
    
    // Test 3: Conversation Flow
    console.log('\n💬 Test 3: Multi-turn Conversation');
    let conversation = [
      {
        role: 'system',
        content: 'You are CineMatch AI. When recommending movies, mention specific titles.'
      }
    ];
    
    for (const userMsg of TEST_MESSAGES) {
      console.log(`\n👤 User: ${userMsg}`);
      
      conversation.push({ role: 'user', content: userMsg });
      
      const response = await fetch(`${PROXY_URL}/api/openai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: conversation,
          temperature: 0.8,
          max_tokens: 200
        })
      });
      
      const data = await response.json();
      const assistantMsg = data.choices[0].message.content;
      
      console.log(`🤖 AI: ${assistantMsg}`);
      
      conversation.push({ role: 'assistant', content: assistantMsg });
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ ALL TESTS PASSED!');
    console.log('\nYour CineMatch AI system is working correctly.');
    console.log('\n📝 Next Steps:');
    console.log('   1. Start your React app: npm start');
    console.log('   2. Open http://localhost:3000');
    console.log('   3. Click "AI Chat" button');
    console.log('   4. Start chatting about movies!');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED');
    console.error('Error:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Make sure proxy server is running: npm start');
    console.error('   2. Check that OPENAI_API_KEY is set in .env file');
    console.error('   3. Verify your API key is valid and has credits');
    console.error('   4. Check that port 3001 is not in use');
  }
}

// Run tests
testProxyServer();