// listModels.js
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main() {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.GEMINI_API_KEY);
    const data = await response.json();
    console.log('📜 Available Models:');
    data.models.forEach(model => {
      console.log(`- ${model.name}`);
    });
  } catch (error) {
    console.error('❌ Failed to list models:', error);
  }
}

main();
