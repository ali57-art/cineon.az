import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Input validation
    if (!body.title || typeof body.title !== 'string') {
      return new Response(JSON.stringify({ error: 'Başlıq tələb olunur' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (body.title.length > 200) {
      return new Response(JSON.stringify({ error: 'Başlıq çox uzundur' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (body.plot && body.plot.length > 2000) {
      return new Response(JSON.stringify({ error: 'Süjet təsviri çox uzundur' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (body.genre && body.genre.length > 100) {
      return new Response(JSON.stringify({ error: 'Janr çox uzundur' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Sanitize inputs to prevent prompt injection
    const title = body.title.replace(/[\n\r]/g, ' ').trim();
    const year = body.year?.replace(/[\n\r]/g, ' ').trim() || '';
    const plot = body.plot?.replace(/[\n\r]/g, ' ').trim() || '';
    const genre = body.genre?.replace(/[\n\r]/g, ' ').trim() || '';
    const language = body.language?.trim() || 'az';
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating AI summary for:', title);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a concise movie summarizer. Write ultra-brief, engaging summaries in ${language} language. Keep summaries to exactly 3-5 sentences, focusing on the core plot and main appeal.`
          },
          {
            role: 'user',
            content: `Write a 5-sentence summary for "${title}" (${year}, ${genre}). Plot: ${plot || 'No plot available'}`
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Limit aşıldı, bir az sonra yenidən cəhd edin.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI krediti bitib, administratora müraciət edin.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`Lovable AI error: ${response.status}`);
    }

    const data = await response.json();
    const summary = data.choices[0].message.content;

    console.log('AI summary generated successfully');

    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-movie-summary function:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
