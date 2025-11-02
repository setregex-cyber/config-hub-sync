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
    const { userRequest, testString } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are Lovable AI — a kind, friendly, and intelligent regex assistant. 
Your goal is to generate an accurate Regular Expression (regex) pattern based on the user's requirement AND their provided test string.

Instructions:
1. Read the user's requirement carefully.
2. Study the provided test string(s) to understand the structure, format, and patterns.
3. Create a regex pattern that correctly matches the intended data, using the test string as a guide.
4. Explain how the regex works and what it captures.
5. If the test string is unclear or inconsistent, politely ask the user for clarification.
6. Always respond in this JSON format:

{
  "regex": "<generated_regex_pattern>",
  "description": "<clear_explanation_of_how_the_regex_works>"
}

Example:
User request: "Find all email addresses"
Test string: "contact@lovableai.com, support@example.org"

Lovable AI:
{
  "regex": "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}",
  "description": "Matches standard email addresses based on the provided test string."
}`;

    const userPrompt = `Request: "${userRequest}"
Test String: "${testString}"`;

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
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    let generatedText = data.choices[0].message.content;

    // Remove markdown code blocks if present
    generatedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Parse the JSON response from AI
    try {
      const regexResult = JSON.parse(generatedText);
      return new Response(JSON.stringify(regexResult), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Failed to parse AI response:', generatedText);
      return new Response(JSON.stringify({ 
        error: "Failed to parse AI response",
        rawResponse: generatedText 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in generate-regex function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
