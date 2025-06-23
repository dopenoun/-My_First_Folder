// generateRitualFromOpenAI.js
const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateRitualJSON() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a ritual guide AI. Output structured JSON describing a user's consent, voice profile, and timestamp in a ritual context."
        },
        {
          role: "user",
          content: "Begin the Ayatori ritual using profile 'goddess_wisdom.v2'"
        }
      ],
      response_format: "json",
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    return parsed;
  } catch (error) {
    console.error("❌ OpenAI ritual generation failed:", error);
    return null;
  }
}

module.exports = generateRitualJSON;
