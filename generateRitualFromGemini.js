// generateRitualFromGemini.js

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateRitualJSON() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonString = text.slice(jsonStart, jsonEnd);
    const ritualData = JSON.parse(jsonString);

    const outputPath = path.join(__dirname, 'outputs', 'ritual.json');
    fs.writeFileSync(outputPath, JSON.stringify(ritualData, null, 2));
    console.log('🔮 Ritual written to outputs/ritual.json');
    return ritualData;
  } catch (err) {
    console.error('❌ Gemini ritual generation failed:', err.message);
    return null;
  }
}

module.exports = generateRitualJSON;

