import fs from 'fs';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateRitualJSON() {
  try {
    const prompt = `
You are a poetic ritual architect. Create a valid JSON object for a hospitality ritual with the following keys:

{
  "invocation_phrase": "string",
  "mood": "string (descriptive & poetic)",
  "theme": "string (symbolic or culinary)",
  "voice_profile": "string",
  "call_to_action": "string",
  "response_time": number,
  "format": "string (e.g. 'dialogue', 'vision', etc.)"
}

Respond with ONLY valid, parseable JSON. Do not wrap in markdown or text.
    `.trim();

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You generate JSON schemas for a poetic AI ritual interface." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    const rawText = response.choices[0]?.message?.content || '{}';

    // Parse the result to validate it's real JSON
    const ritual = JSON.parse(rawText);

    fs.writeFileSync('outputs/ritual.json', JSON.stringify(ritual, null, 2));
    console.log("✅ ritual.json successfully written!");
    return ritual;

  } catch (err) {
    console.error("❌ OpenAI ritual generation failed:", err);
    return null;
  }
}
