// generateRitualFromOpenAI.js

const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

module.exports = async function generateRitualJSON() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a ritual-generating assistant. Output JSON with keys like 'voice_profile', 'mood', 'invocation_phrase', 'theme', and 'modules'."
        },
        {
          role: "user",
          content: "Generate a new JSON-based ritual configuration for a voice-based agent called Ayatori."
        }
      ],
      temperature: 0.7
    });

    const result = response.choices?.[0]?.message?.content;
    if (!result) throw new Error("No content returned from OpenAI");

    return JSON.parse(result);
  } catch (err) {
    console.error("❌ Failed to generate ritual JSON:", err.message);
    return null;
  }
};
