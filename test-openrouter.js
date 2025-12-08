// Quick test script for OpenRouter API
require('dotenv').config({ path: '.env.local' });

const OPENROUTER_API_KEY = process.env.OPENROUTER_API;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function testOpenRouter() {
  console.log('🔑 API Key:', OPENROUTER_API_KEY ? `${OPENROUTER_API_KEY.substring(0, 20)}...` : 'NOT FOUND');
  
  if (!OPENROUTER_API_KEY) {
    console.error('❌ OPENROUTER_API key not found in .env.local');
    return;
  }

  console.log('\n🚀 Testing OpenRouter API with multiple models...\n');

  const models = [
    'meta-llama/llama-3.2-3b-instruct:free',
    'microsoft/phi-3-mini-128k-instruct:free',
    'qwen/qwen-2-7b-instruct:free',
    'google/gemini-2.0-flash-exp:free',
  ];

  for (const model of models) {
    console.log(`\n🔄 Trying model: ${model}`);
    
    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'PodLink Test',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI assistant in an accountability app. Keep responses brief and supportive.'
            },
            {
              role: 'user',
              content: "I'm struggling with my goal to quit social media. Can you help?"
            }
          ],
          temperature: 0.7,
          max_tokens: 200,
        }),
      });

      console.log('📡 Response Status:', response.status, response.statusText);

      if (response.status === 429) {
        const errorText = await response.text();
        console.log('⏭️  Rate limited, trying next model...');
        continue;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error Response:', errorText);
        continue;
      }

      const data = await response.json();
      
      if (data.error) {
        console.error('❌ API Error:', data.error);
        continue;
      }

      const aiMessage = data.choices?.[0]?.message?.content || 'No response';
      
      console.log('✅ Success! AI Response:');
      console.log('─'.repeat(60));
      console.log(aiMessage);
      console.log('─'.repeat(60));
      
      console.log('\n📊 Response Details:');
      console.log('- Model:', data.model);
      console.log('- ID:', data.id);
      console.log('- Usage:', data.usage);
      
      return; // Success, exit
      
    } catch (error) {
      console.error('❌ Error with', model, ':', error.message);
      continue;
    }
  }
  
  console.error('\n❌ All models failed or are rate-limited');
}

testOpenRouter();
