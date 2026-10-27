
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return Response.json(
      { error: "Method not allowed" },
      { status: 405, headers: corsHeaders }
    );
  }

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      return Response.json(
        { error: "Gemini API key is not configured." },
        { status: 500, headers: corsHeaders }
      );
    }

    const body = await req.json();
    const message =
      typeof body.message === "string" ? body.message.trim() : "";

    if (!message) {
      return Response.json(
        { error: "Please enter a message." },
        { status: 400, headers: corsHeaders }
      );
    }

    if (message.length > 4000) {
      return Response.json(
        { error: "Message is too long. Maximum 4000 characters." },
        { status: 400, headers: corsHeaders }
      );
    }


    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    let geminiResponse: Response;

    try {
      geminiResponse = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          signal: controller.signal,
          body: JSON.stringify({
            systemInstruction: {
              parts: [{
                text: "You are AniGalnexo AI, a fast and friendly anime companion. Answer directly in the user's language. Keep replies concise, usually 2-5 sentences. For anime recommendations, give a short list with one-line reasons. Avoid long introductions and unnecessary explanations. Be accurate and never invent facts."
              }]
            },
            contents: [{
              role: "user",
              parts: [{ text: message }]
            }],
            generationConfig: {
              temperature: 0.5,
              maxOutputTokens: 300
            }
          })
        }
      );
    } finally {
      clearTimeout(timeoutId);
    }

    console.log("Calling Gemini API...");
    const data = await geminiResponse.json();


    if (!geminiResponse.ok) {
      console.error("Gemini API error:", {
        status: geminiResponse.status,
        data,
      });

      return Response.json(
        {
          error: "Gemini API request failed.",
          details: data?.error?.message || "Unknown Gemini API error",
          status: geminiResponse.status,
        },
        { status: 502, headers: corsHeaders }
      );
    }
    console.log(
      "Gemini response received:",
      geminiResponse.status
    );

    const reply = data.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text ?? "")
      .join("")
      .trim();

    if (!reply) {
      return Response.json(
        { error: "AI could not generate a reply. Please try again." },
        { status: 502, headers: corsHeaders }
      );
    }

    return Response.json(
      { reply },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Anime chat error:", error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500, headers: corsHeaders }
    );
  }
});
