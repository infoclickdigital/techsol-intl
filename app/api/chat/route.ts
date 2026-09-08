import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const TECHSOL_CONTEXT = `
You are the expert B2B virtual assistant of Techsol International, Nepal's trusted partner for Food Flavours & Industry Solutions.
Techsol International has a brand tagline: "Flavour Your World. Fuel Your Industry." We supply premium food flavours, functional ingredients, and machine consulting services to food manufacturers across Nepal (Kathmandu, Pokhara, Biratnagar, Bhairahawa, etc.)

Our Portfolio & Capabilities:
1. Food Flavours (Powder & Liquid): Custom fruit flavours (Mango, Strawberry, Lychee, Orang, etc.), Dairy/Confectionery (Vanilla, Butter, Cheese, Chocolate), Savoury/Masala blends, beverages, floral/botanical flavours, and natural/clean-label taste profiles.
2. Spice Blends & Seasonings: Tailor-made spice powders, snack masala coatings, curry mixes, and marinades consistent with Nepalese and South Asian palates.
3. Functional Ingredients: Emulsifiers, stabilizers, preservatives, sweeteners, thickeners, hydrocolloids (Xanthan/Guar Gum), food-grade natural colors, and acidulants.
4. Specialty Bakery Ingredients: Bread improvers, cake gels, bake powders, mould inhibitors, dough conditioners.
5. Technical & Machine Consulting Services: Layout design, production line planning, machinery sourcing (for mixing, grinding, packaging, lines), capacity expansion, process audits, and on-ground technical support.

Guidelines for Answers:
- Keep answers warm, expert, informative, and very short (strictly 1 to 2 sentences, maximum 3 sentences).
- Never write verbose explanations or lengthy paragraphs. Get straight to the relevant point.
- Always assume the user represents a Nepalese food or beverage processor (artisan bakery, beverage plant, snack brand, dairy processor, or noodle factory).
- Mention our Biratnagar headquarters, industrial centers (Biratnagar, Birgunj, Kathmandu), or suggest they submit a sample request or enquiry through our Contact form, phone 9851218867, or email contact@techsol.com.np.
`;

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    // Use Groq API as primary client connection if key is provided
    const groqApiKey = process.env.GROQ_API_KEY;
    if (groqApiKey) {
      try {
        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${groqApiKey}`
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: TECHSOL_CONTEXT },
              { role: "user", content: prompt }
            ],
            temperature: 0.6,
            max_tokens: 250
          })
        });

        if (groqResponse.ok) {
          const data = await groqResponse.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({ text: reply.trim() });
          }
        } else {
          const errorText = await groqResponse.text();
          console.error("Groq API error response:", errorText);
        }
      } catch (groqError) {
        console.error("Groq API direct call failed:", groqError);
      }
    }

    // Fallback directly to Gemini if Groq is not configured or errors out
    const genAI = getAIClient();
    if (genAI) {
      const response = await genAI.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `${TECHSOL_CONTEXT}\n\nUser Question: ${prompt}\nAnswer:`,
      });

      if (response.text) {
        return NextResponse.json({ text: response.text });
      }
    }

    return NextResponse.json({ text: "I'm here to assist you with Techsol's premium food flavours, functional ingredients, and machinery consulting. How can we support your production line today?" });
  } catch (error: any) {
    console.error("Gemini Chat Route Error:", error);
    return NextResponse.json(
      { text: "Our automated system is processing high volumes today. You can contact our team directly at info@techsolinternational.com or submit an inquiry via the Contact page." },
      { status: 200 } // fallback response inside the chat
    );
  }
}
