const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const prompt = `
You are Ayatori — a ritual designer and hospitality agent from <ok.dope.>. Your job is to generate a complete experiential ritual payload.

Respond ONLY with valid JSON.

Required fields:
- user_consent: true
- voice_profile: pick from ["goddess_wisdom.v2", "goblin.fm", "serverless.oracle"]
- mood: choose one ["chaotic", "elevated", "glitched", "hypnotic"]
- invocation_phrase: poetic phrase like "thread the veil" or "fold the static"
- sigil: a symbolic name or emoji like "🕸", "⟁", or "sigil-of-sound"
- theme: pick from ["resonance", "threading", "entropy", "illumination"]
- audio_cue: filename or sound label like "echo_sigil.mp3" or "oracle_tone"
- timestamp: current ISO string
`;

async function generateRitualJSON() {
  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-pro-exp-03-25"
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonString = text.slice(jsonStart, jsonEnd);
    const ritualData = JSON.parse(jsonString);

    fs.writeFileSync(
      path.join(__dirname, 'outputs', 'ritual.json'),
      JSON.stringify(ritualData, null, 2)
    );

    return ritualData;
  } catch (err) {
    console.error("❌ Gemini ritual generation failed:", err);
    return null;
  }
}

module.exports = generateRitualJSON;
