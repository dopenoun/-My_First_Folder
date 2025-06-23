// generateRitualFromOpenAI.js

const { OpenAI } = require("openai");
const openai = new OpenAI();

async function generateRitualJSON(voiceProfile = "goddess_wisdom.v2") {
  const prompt = `
You are the Ayatori agent. Based on the user's voice profile "${voiceProfile}", generate a ritual configuration in valid JSON format with the following keys:

{
  "invocation_phrase": string,
  "tone": string,
  "user_consent_required": boolean,
  "theme": string,
  "voice_profile": "${voiceProfile}",
  "outputs": [string]
}

The ritual should reflect the personality and mood of the given voice profile. Keep the response concise, structured, and properly formatted as JSON.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;

    // Try parsing the returned string into JSON
    const parsed = JSON.parse(content);
    console.log("✅ ritual.json successfully generated!");
    return parsed;
  } catch (err) {
    console.error("❌ Failed to generate or parse ritual JSON:", err.message);
    return null;
  }
}

module.exports = generateRitualJSON;
