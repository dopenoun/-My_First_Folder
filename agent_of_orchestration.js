const fs = require('fs');
const path = require('path');

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

function executeModules(modules) {
  const executed = new Set();
  const stateLog = [];

  function execute(module) {
    if (executed.has(module.name)) return;

    module.depends_on.forEach(depName => {
      const dep = modules.find(m => m.name === depName);
      if (dep) execute(dep);
    });

    console.log(`🔧 Executing: ${module.name} (${module.type})`);
    console.log(`   🧩 Inputs: ${module.inputs.join(', ')}`);
    console.log(`   🎯 Outputs: ${module.outputs.join(', ')}`);

    const timestamp = new Date().toISOString();

    // Simulate file outputs
    if (module.name === 'Ayatori Ritual') {
      writeOutput('ritual.json', JSON.stringify({
        user_consent: true,
        voice_profile: "goddess_wisdom.v2",
        timestamp
      }, null, 2));
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

  modules.forEach(execute);
  saveState({ executed: Array.from(executed), history: stateLog });
}

const modules = loadModules();
console.log('📦 Loaded Modules:', modules);
executeModules(modules);
