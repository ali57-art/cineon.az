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
    const { searchQuery, imdbId, type, page } = await req.json();
    const OMDB_API_KEY = Deno.env.get('OMDB_API_KEY');

    if (!OMDB_API_KEY) {
      throw new Error('OMDB_API_KEY is not configured');
    }

    // Input validation
    if (searchQuery && typeof searchQuery !== 'string') {
      throw new Error('Invalid search query');
    }
    if (searchQuery && searchQuery.length > 500) {
      throw new Error('Search query too long');
    }
    if (imdbId && typeof imdbId !== 'string') {
      throw new Error('Invalid IMDb ID');
    }
    if (imdbId && imdbId.length > 20) {
      throw new Error('IMDb ID too long');
    }
    if (type && !['movie', 'series', 'episode', ''].includes(type)) {
      throw new Error('Invalid content type');
    }

    console.log('OMDb request:', { searchQuery, imdbId, type, page });

    // Build OMDb URL server-side
    let url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}`;
    
    if (searchQuery) {
      url += `&s=${encodeURIComponent(searchQuery)}`;
    }
    if (imdbId) {
      url += `&i=${encodeURIComponent(imdbId)}&plot=full`;
    }
    if (type) {
      url += `&type=${encodeURIComponent(type)}`;
    }
    if (page) {
      url += `&page=${encodeURIComponent(page)}`;
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch from OMDb API');
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in omdb-proxy function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      Response: 'False'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
