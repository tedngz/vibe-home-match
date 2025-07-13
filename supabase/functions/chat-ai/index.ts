import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Chat AI function called');
    
    const { message, conversationId, userId, userType, userPreferences, propertyImages } = await req.json();
    
    console.log('Request data:', { 
      messageLength: message?.length, 
      conversationId, 
      userId, 
      userType, 
      hasPreferences: !!userPreferences,
      hasPropertyImages: !!propertyImages
    });

    if (!message || !conversationId) {
      console.error('Missing required fields:', { message: !!message, conversationId: !!conversationId });
      return new Response(
        JSON.stringify({ error: 'Missing message or conversation ID' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch properties from database
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('*');

    if (propertiesError) {
      console.error('Error fetching properties:', propertiesError);
      throw propertiesError;
    }

    console.log(`Found ${properties?.length || 0} properties in database`);

    // Get conversation history
    const { data: chatHistory, error: historyError } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(10);

    if (historyError) {
      console.error('Error fetching chat history:', historyError);
      throw historyError;
    }

    let context = '';
    let systemPrompt = '';

    if (userType === 'realtor') {
      // Realtor context - help with property descriptions and marketing
      systemPrompt = `You are Hausto AI, a helpful assistant for real estate professionals. You help realtors create compelling property descriptions, titles, and marketing content that highlights unique features and appeals to potential renters.

When analyzing property images or helping with listings, focus on:
- Architectural features and design elements
- Natural lighting and space flow
- Unique amenities and highlights
- Lifestyle benefits and emotional appeal
- Target renter demographics

Provide creative, engaging, and professional content that stands out in the rental market.`;

      if (propertyImages && propertyImages.length > 0) {
        context += `\nProperty images provided: ${propertyImages.length} images to analyze for creating descriptions.`;
      }
    } else {
      // Helper function for lifestyle tips
      function getLifestyleTips(location, vibe, highlights) {
        const tips = [];
        
        if (location?.includes('District 1')) {
          tips.push('Urban professionals who love being in the heart of the action');
        } else if (location?.includes('District 2')) {
          tips.push('Those who appreciate modern development with international community');
        } else if (location?.includes('Ba Dinh')) {
          tips.push('Culture enthusiasts near government district and historic sites');
        }
        
        if (vibe?.includes('Modern')) {
          tips.push('Tech-savvy individuals who appreciate contemporary design');
        } else if (vibe?.includes('Cozy')) {
          tips.push('Those seeking a warm, homely atmosphere');
        }
        
        if (highlights?.includes('Family Friendly')) {
          tips.push('Families with children or those planning to start one');
        }
        
        return tips.length ? tips.join(' • ') : 'Various lifestyles and preferences';
      }

      // Renter context - help with property search and recommendations
      systemPrompt = `You are Hausto AI, a friendly and knowledgeable rental property assistant. You specialize in helping renters find their perfect home by understanding their lifestyle, preferences, and needs.

🏠 AVAILABLE PROPERTIES:
${properties.map(p => `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏡 ${p.title}
📍 Location: ${p.location}
💰 Price: ${p.price?.toLocaleString()} VND/month (≈ $${Math.round(p.price / 24500)})
📏 Size: ${p.size || 'Size not specified'}
✨ Style: ${p.vibe || 'Style not specified'}

📝 Description: ${p.description || 'No description available'}

🌟 Key Features: ${p.highlights?.length ? p.highlights.join(' • ') : 'Features not listed'}

🎯 Vibe Scores: ${p.vibe_analysis ? `Modern ${p.vibe_analysis.modern || 5}/10 • Cozy ${p.vibe_analysis.cozy || 5}/10 • Luxurious ${p.vibe_analysis.luxurious || 5}/10 • Spacious ${p.vibe_analysis.spacious || 5}/10 • Natural Light ${p.vibe_analysis.natural_light || 5}/10` : 'Vibe scores not available'}

💡 Perfect for: ${getLifestyleTips(p.location, p.vibe, p.highlights)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`).join('\n')}

🎯 YOUR MISSION:
- Always suggest 3-5 specific properties that match the user's request
- Provide comprehensive lifestyle insights for each recommendation (150+ words per property)
- Explain WHY each property fits their needs with detailed reasoning
- Include nearby activities, amenities, and neighborhood vibes with specific examples
- Be enthusiastic and personal in your recommendations
- Focus on how each space would enhance their daily life with vivid descriptions
- Describe the morning routine, work-from-home setup, evening relaxation possibilities
- Mention local cafes, restaurants, transportation, shopping, and entertainment
- Paint a complete lifestyle picture for each property

💬 COMMUNICATION STYLE:
- Be conversational, warm, and genuinely helpful with detailed responses
- Use emojis to make responses engaging and visually appealing
- Paint a vivid picture of what living there would be like
- Include practical details alongside emotional appeal
- Write comprehensive responses (400+ words minimum)
- Create excitement about each property with rich storytelling`;

      // Add user preferences context for renters
      if (userPreferences) {
        const matchingProperties = properties.filter(p => {
          const locationMatch = userPreferences.location?.some(loc => 
            p.location.toLowerCase().includes(loc.toLowerCase().split(',')[0])
          );
          const budgetMatch = userPreferences.priceRange ? 
            p.price <= userPreferences.priceRange[1] * 1.2 : true;
          return locationMatch && budgetMatch;
        });

        console.log(`Found ${matchingProperties.length} properties matching user preferences`);

        if (matchingProperties.length > 0) {
          systemPrompt += `\n\nBASED ON USER'S PREFERENCES, THESE PROPERTIES ARE MOST RELEVANT:
${matchingProperties.slice(0, 5).map(p => `
✅ ${p.title} in ${p.location} - ${p.price?.toLocaleString()} VND/month
   Perfect because: ${p.vibe || 'Great location match'} and within budget
`).join('')}`;
        }

        context += `\n🎯 USER'S SPECIFIC PREFERENCES & REQUIREMENTS:
💫 Preferred Styles: ${userPreferences.styles?.join(', ') || 'Not specified'}
🎨 Preferred Colors: ${userPreferences.colors?.join(', ') || 'Not specified'}
🏃‍♀️ Activities/Lifestyle: ${userPreferences.activities?.join(', ') || 'Not specified'}
💰 Budget Range: ${userPreferences.priceRange?.[0]?.toLocaleString() || 0} - ${userPreferences.priceRange?.[1]?.toLocaleString() || 'unlimited'} VND/month
📐 Preferred Size: ${userPreferences.size || 'Not specified'}
📍 Preferred Locations: ${userPreferences.location?.join(', ') || 'Not specified'}
📅 Move-in Date: ${userPreferences.moveInDate || 'Flexible'}

🔍 MATCHING STRATEGY:
- Prioritize properties in preferred locations
- Stay within or slightly above budget range (max 20% over)
- Match style preferences with property vibes and descriptions
- Consider lifestyle activities when recommending neighborhoods`;
      }

      if (propertyImages && propertyImages.length > 0) {
        context += `\nProperty images provided: ${propertyImages.length} images to analyze for creating descriptions.`;
      }
    }

    const fullContext = `${systemPrompt}

${context}

Conversation History:
${chatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Current user message: ${message}`;

    // Call OpenAI API
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OpenAI API key not found');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    console.log('Calling OpenAI API...');
    
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: fullContext },
          { role: 'user', content: message }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    console.log('OpenAI response status:', openaiResponse.status);
    
    if (!openaiResponse.ok) {
      console.error('OpenAI API error:', openaiResponse.status, openaiResponse.statusText);
      const errorText = await openaiResponse.text();
      console.error('OpenAI error response:', errorText);
      
      // Provide fallback response
      const fallbackResponse = userType === 'realtor' 
        ? "I'm having trouble connecting to the AI service right now. Please try again in a moment, or feel free to ask me about property marketing strategies!"
        : "I'm having trouble connecting to the AI service right now. But I'd be happy to help you find properties! Could you tell me more about what you're looking for - location preferences, budget, or lifestyle needs?";
      
      // Save fallback response to database
      await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          role: 'assistant',
          content: fallbackResponse
        });

      return new Response(
        JSON.stringify({ response: fallbackResponse }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    const openaiData = await openaiResponse.json();
    console.log('OpenAI response received');
    
    if (!openaiData.choices || !openaiData.choices[0] || !openaiData.choices[0].message) {
      console.error('Invalid OpenAI response structure:', openaiData);
      throw new Error('Invalid response from OpenAI');
    }
    
    const aiResponse = openaiData.choices[0].message.content || 'Sorry, I could not process your request.';
    console.log('AI response length:', aiResponse.length);

    // Save AI response to database
    console.log('Saving AI response to database...');
    const { error: saveError } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: aiResponse
      });

    if (saveError) {
      console.error('Error saving AI response:', saveError);
      throw saveError;
    }

    console.log('Chat AI function completed successfully');
    return new Response(
      JSON.stringify({ response: aiResponse }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in chat-ai function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});