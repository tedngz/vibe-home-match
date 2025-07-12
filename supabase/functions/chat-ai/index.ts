
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
    const { message, conversationId, userId, userType, userPreferences, propertyImages } = await req.json();

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
      throw propertiesError;
    }

    // Get conversation history
    const { data: chatHistory, error: historyError } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(10);

    if (historyError) {
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
      // Renter context - help with property search
      systemPrompt = `You are Hausto AI, a helpful rental property assistant for renters. You help users find suitable rental properties based on their preferences and needs.

You have access to the following rental properties:

${properties.map(p => `
Property: ${p.title}
Location: ${p.location}
Price: $${p.price}
Size: ${p.size}
Vibe: ${p.vibe}
Description: ${p.description}
Highlights: ${p.highlights?.join(', ')}
`).join('\n')}

Based on the user's preferences and conversation, help them find suitable properties. Be conversational, helpful, and provide specific recommendations when relevant.`;

      if (userPreferences) {
        context += `\nUser preferences:
- Styles: ${userPreferences.styles?.join(', ')}
- Colors: ${userPreferences.colors?.join(', ')}
- Activities: ${userPreferences.activities?.join(', ')}
- Budget: $${userPreferences.priceRange?.[0]} - $${userPreferences.priceRange?.[1]}
- Size: ${userPreferences.size}
- Location: ${userPreferences.location?.join(', ')}
- Move-in: ${userPreferences.moveInDate}`;
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
      throw new Error('OpenAI API key not configured');
    }

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
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    const openaiData = await openaiResponse.json();
    const aiResponse = openaiData.choices[0]?.message?.content || 'Sorry, I could not process your request.';

    // Save AI response to database
    const { error: saveError } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: aiResponse
      });

    if (saveError) {
      throw saveError;
    }

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
