
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
    const { imageUrls, generateContent = false } = await req.json();

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Analyze each image for vibe characteristics and optionally generate content
    const analyses = await Promise.all(
      imageUrls.map(async (imageUrl: string, index: number) => {
        const basePrompt = generateContent 
          ? `Analyze this rental property image and describe what you see. Focus on unique architectural features, design elements, lighting, space characteristics, and any special amenities or highlights visible. Be detailed and specific about what makes this property special. After your analysis, return a JSON object with vibe characteristics (scale 1-10): modern, cozy, luxurious, minimalist, colorful, spacious, natural_light, urban, rustic, elegant, plus a 'detailed_analysis' field with your observations.`
          : `Analyze this rental property image and return a JSON object with the following vibe characteristics (scale 1-10): modern, cozy, luxurious, minimalist, colorful, spacious, natural_light, urban, rustic, elegant. Also provide a brief description of the overall vibe.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: basePrompt
                  },
                  {
                    type: 'image_url',
                    image_url: { url: imageUrl }
                  }
                ]
              }
            ],
            max_tokens: generateContent ? 500 : 300,
          }),
        });

        const data = await response.json();
        const content = data.choices[0]?.message?.content || '{}';
        
        try {
          // Try to extract JSON from the response
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          const jsonStr = jsonMatch ? jsonMatch[0] : content;
          const parsed = JSON.parse(jsonStr);
          
          return {
            ...parsed,
            image_index: index,
            raw_analysis: content
          };
        } catch {
          // Fallback if JSON parsing fails
          return {
            modern: 5,
            cozy: 5,
            luxurious: 5,
            minimalist: 5,
            colorful: 5,
            spacious: 5,
            natural_light: 5,
            urban: 5,
            rustic: 5,
            elegant: 5,
            description: 'Unable to analyze image',
            detailed_analysis: generateContent ? content : 'Analysis failed',
            image_index: index,
            raw_analysis: content
          };
        }
      })
    );

    // Aggregate the analyses and generate content if requested
    const aggregated = {
      modern: Math.round(analyses.reduce((sum, a) => sum + (a.modern || 5), 0) / analyses.length),
      cozy: Math.round(analyses.reduce((sum, a) => sum + (a.cozy || 5), 0) / analyses.length),
      luxurious: Math.round(analyses.reduce((sum, a) => sum + (a.luxurious || 5), 0) / analyses.length),
      minimalist: Math.round(analyses.reduce((sum, a) => sum + (a.minimalist || 5), 0) / analyses.length),
      colorful: Math.round(analyses.reduce((sum, a) => sum + (a.colorful || 5), 0) / analyses.length),
      spacious: Math.round(analyses.reduce((sum, a) => sum + (a.spacious || 5), 0) / analyses.length),
      natural_light: Math.round(analyses.reduce((sum, a) => sum + (a.natural_light || 5), 0) / analyses.length),
      urban: Math.round(analyses.reduce((sum, a) => sum + (a.urban || 5), 0) / analyses.length),
      rustic: Math.round(analyses.reduce((sum, a) => sum + (a.rustic || 5), 0) / analyses.length),
      elegant: Math.round(analyses.reduce((sum, a) => sum + (a.elegant || 5), 0) / analyses.length),
      image_analyses: analyses
    };

    // Generate unique title and description if requested
    if (generateContent) {
      const detailedAnalyses = analyses.map(a => a.detailed_analysis || a.raw_analysis).join('\n\n');
      
      const contentResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a creative real estate marketing expert. Based on detailed property image analyses, create unique and compelling rental listing content that highlights the property's specific features and appeals to potential renters.`
            },
            {
              role: 'user',
              content: `Based on these property image analyses, create a unique and compelling rental listing:

Property Analysis:
${detailedAnalyses}

Vibe Scores (1-10):
- Modern: ${aggregated.modern}
- Cozy: ${aggregated.cozy}
- Luxurious: ${aggregated.luxurious}
- Minimalist: ${aggregated.minimalist}
- Spacious: ${aggregated.spacious}
- Natural Light: ${aggregated.natural_light}
- Urban: ${aggregated.urban}

Create:
1. A catchy, unique title (max 60 characters) that captures the property's essence
2. A compelling description (100-200 words) that highlights specific features you observed
3. 3-5 key highlights/features that make this property special

Format as JSON:
{
  "title": "your catchy title",
  "description": "your compelling description",
  "highlights": ["highlight1", "highlight2", "highlight3"]
}`
            }
          ],
          max_tokens: 600,
          temperature: 0.8,
        }),
      });

      const contentData = await contentResponse.json();
      const contentText = contentData.choices[0]?.message?.content || '{}';
      
      try {
        const jsonMatch = contentText.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : contentText;
        const generatedContent = JSON.parse(jsonStr);
        aggregated.generated_content = generatedContent;
      } catch (error) {
        console.error('Error parsing generated content:', error);
        aggregated.generated_content = {
          title: "Beautiful Rental Property",
          description: "A wonderful space perfect for your next home.",
          highlights: ["Great location", "Modern amenities", "Spacious rooms"]
        };
      }
    }

    return new Response(
      JSON.stringify({ analysis: aggregated }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in analyze-vibe function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
