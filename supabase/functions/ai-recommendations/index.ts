import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // Accept either { prompt } (free-form) OR { genre, type } (legacy)
    const rawPrompt: string | undefined = typeof body.prompt === "string" ? body.prompt : undefined;
    const rawGenre: string | undefined = typeof body.genre === "string" ? body.genre : undefined;

    if (!rawPrompt && !rawGenre) {
      return new Response(JSON.stringify({ error: "Prompt və ya janr tələb olunur" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (rawPrompt && rawPrompt.length > 1000) {
      return new Response(JSON.stringify({ error: "Mətn çox uzundur (max 1000)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (rawGenre && rawGenre.length > 100) {
      return new Response(JSON.stringify({ error: "Janr çox uzundur" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (body.type && !["movie", "series", "both"].includes(body.type)) {
      return new Response(JSON.stringify({ error: "Yanlış növ" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Sanitize
    const prompt = rawPrompt?.replace(/[\n\r]+/g, " ").trim();
    const genre = rawGenre?.replace(/[\n\r]/g, " ").trim();
    const language = (body.language ?? "az").toString().trim() || "az";
    const type = (body.type ?? "movie").toString().trim() || "movie";

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const typeInstruction =
      type === "series"
        ? "YALNIZ TV serialları tövsiyə et (filmlər YOX). Hər tövsiyənin type sahəsi 'series' olmalıdır."
        : type === "both"
        ? "Filmlər və TV serialları qarışıq tövsiyə et. Hər tövsiyə üçün type sahəsini düzgün təyin et ('movie' və ya 'series')."
        : "YALNIZ filmlər tövsiyə et (TV serialları YOX). Hər tövsiyənin type sahəsi 'movie' olmalıdır.";

    const systemPrompt = `Sən Cineon film platformasının AI köməkçisisən. İstifadəçiyə ${language} dilində, mehribanane cavab ver.

QAYDALAR:
- 3-5 ${type === "series" ? "serial" : type === "both" ? "film/serial" : "film"} tövsiyə et
- Hər biri üçün: dəqiq orijinal İngilis adı (axtarış üçün vacibdir), il, qısa 1-2 cümləlik səbəb, type
- ${typeInstruction}
- Yalnız tool calling ilə strukturlaşdırılmış cavab qaytar`;

    const userPrompt = prompt
      ? `İstifadəçi belə bir ${type === "series" ? "serial" : type === "both" ? "film və ya serial" : "film"} axtarır: "${prompt}"`
      : `${genre} janrında ${type === "series" ? "serial" : type === "both" ? "film və ya serial" : "film"} tövsiyə et.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_recommendations",
              description: "Return movie/series recommendations to the user.",
              parameters: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    description: "Qısa, mehribanane şəxsi mesaj (1-2 cümlə)",
                  },
                  recommendations: {
                    type: "array",
                    minItems: 3,
                    maxItems: 5,
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Orijinal İngilis adı" },
                        year: { type: "string" },
                        description: { type: "string", description: "Niyə bu film? 1-2 cümlə" },
                        type: { type: "string", enum: ["movie", "series"], description: "movie və ya series" },
                      },
                      required: ["title", "year", "description", "type"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["message", "recommendations"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_recommendations" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Çox sorğu. Bir az gözləyin." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI krediti bitib. Workspace-ə kredit əlavə edin." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    let parsed: { message: string; recommendations: Array<{ title: string; year: string; description: string }> } | null = null;

    if (toolCall?.function?.arguments) {
      try {
        parsed = JSON.parse(toolCall.function.arguments);
      } catch (e) {
        console.error("Tool arg parse error:", e);
      }
    }

    if (!parsed) {
      // Fallback: try plain content
      const content = data.choices?.[0]?.message?.content ?? "";
      return new Response(JSON.stringify({ message: "", recommendations: [], raw: content }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI recommendations error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
