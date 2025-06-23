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
You are a ritual architect for Ayatori by Serviō. Generate a structured JSON object called "ritual.json" using the following keys:

- invocation_phrase (string)
- mood (string, poetic)
- theme (string, abstract or culinary)
- voice_profile (string, voice identity name)
- call_to_action (string, guiding phrase)
- response_time (number, estimated seconds)
- format (string, e.g. "dialogue", "vision", "audio")

Ensure the structure is clean, parseable JSON. Begin now.
    `.trim();

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You generate ritual schemas for a poetic AI interface." },
        { role: "user", content: prompt }
      ]
    });

    const text = response.choices[0]?.message?.content || "{}";
    const ritualData = JSON.parse(text);

    fs.writeFileSync("outputs/ritual.json", JSON.stringify(ritualData, null, 2));
    console.log("✅ ritual.json written to outputs/");
    return ritualData;

  } catch (err) {
    console.error("❌ OpenAI ritual generation failed:", err);
    return null;
  }
}
