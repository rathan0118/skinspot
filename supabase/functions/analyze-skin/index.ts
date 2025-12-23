import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Analyzing skin image...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content: `You are a dermatology AI assistant designed to help identify potential skin conditions from images. 

IMPORTANT DISCLAIMERS:
- You are NOT a replacement for professional medical advice
- Always recommend consulting a dermatologist for accurate diagnosis
- Your analysis is for educational and informational purposes only

When analyzing skin images, provide:
1. A primary observation of what you see
2. Possible conditions (if identifiable patterns exist)
3. Severity assessment (mild/moderate/severe)
4. General care recommendations
5. When to seek professional help

Be thorough but approachable in your explanations. Use clear, non-alarming language.

Format your response as JSON with this structure:
{
  "condition": "Primary condition name or 'Unable to determine'",
  "confidence": "low/medium/high",
  "severity": "mild/moderate/severe/unknown",
  "description": "Brief description of what you observe",
  "possibleCauses": ["cause1", "cause2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "urgency": "routine/soon/urgent",
  "disclaimer": "Medical disclaimer text"
}`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this skin image and provide your assessment. Remember to be thorough but cautious, and always emphasize the importance of professional medical consultation."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to analyze image" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "No analysis generated" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Analysis complete");

    // Try to parse as JSON, or return raw content
    let analysis;
    try {
      // Extract JSON from the response (it might be wrapped in markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        analysis = {
          condition: "Analysis Complete",
          confidence: "medium",
          severity: "unknown",
          description: content,
          possibleCauses: [],
          recommendations: ["Consult a dermatologist for professional evaluation"],
          urgency: "routine",
          disclaimer: "This is not medical advice. Please consult a healthcare professional."
        };
      }
    } catch {
      analysis = {
        condition: "Analysis Complete",
        confidence: "medium",
        severity: "unknown",
        description: content,
        possibleCauses: [],
        recommendations: ["Consult a dermatologist for professional evaluation"],
        urgency: "routine",
        disclaimer: "This is not medical advice. Please consult a healthcare professional."
      };
    }

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-skin function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
