// agent_of_orchestration.js

const fs = require('fs');
const path = require('path');
const generateRitualJSON = require("./generateRitualFromOpenAI");

const modulesPath = path.join(__dirname, 'manifest', 'modules.json');
const statePath = path.join(__dirname, 'state', 'state.json');
const outputsDir = path.join(__dirname, 'outputs');

fs.mkdirSync(outputsDir, { recursive: true });
fs.mkdirSync(path.dirname(statePath), { recursive: true });

function loadModules() {
  try {
    const data = fs.readFileSync(modulesPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('❌ Failed to load modules:', err);
    process.exit(1);
  }
}

function saveState(state) {
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
  console.log('🧠 State saved to state/state.json');
}

function writeOutput(filename, data) {
  const filePath = path.join(outputsDir, filename);
  fs.writeFileSync(filePath, data);
  console.log(`💾 Output written: outputs/${filename}`);
}

async function executeModules(modules) {
  const executed = new Set();
  const stateLog = [];

  async function execute(module) {
    if (executed.has(module.name)) return;

    for (const depName of module.depends_on) {
      const dep = modules.find(m => m.name === depName);
      if (dep) await execute(dep);
    }

    console.log(`🔧 Executing: ${module.name} (${module.type})`);
    console.log(`   🧩 Inputs: ${module.inputs.join(', ')}`);
    console.log(`   🎯 Outputs: ${module.outputs.join(', ')}`);

    const timestamp = new Date().toISOString();

    if (module.name === 'Ayatori Ritual') {
      try {
        const ritualData = await generateRitualJSON();
        if (ritualData) {
          writeOutput('ritual.json', JSON.stringify(ritualData, null, 2));
          console.log('✅ ritual.json successfully written!');
        } else {
          console.warn('⚠️ No ritual data returned.');
        }
      } catch (err) {
        console.error('❌ Error generating ritual from OpenAI:', err.message);
      }
    }

    if (module.name === 'Card Viewer') {
      writeOutput('rendered_view.html', `
        <html><body><h1>🔥 Dumpster Fire Ritual Viewer</h1>
        <p>Loaded from ritual.json</p></body></html>
      `);
    }

    stateLog.push({
      module: module.name,
      type: module.type,
      timestamp,
      inputs: module.inputs,
      outputs: module.outputs
    });

    executed.add(module.name);
  }

  for (const module of modules) {
    await execute(module);
  }

  saveState({ executed: Array.from(executed), history: stateLog });
}

async function main() {
  const modules = loadModules();
  console.log('📦 Loaded Modules:', modules);
  await executeModules(modules);
}

main().catch(console.error);
