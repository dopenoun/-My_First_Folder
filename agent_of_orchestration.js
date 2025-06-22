// agent_of_orchestration.js
const fs = require('fs');
const path = require('path');

function loadModules() {
  const filePath = path.join(__dirname, 'manifest', 'modules.json');
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('❌ Failed to load modules:', err);
    process.exit(1);
  }
}

// 👇 Run agent
const modules = loadModules();
console.log('📦 Loaded Modules:', modules);
