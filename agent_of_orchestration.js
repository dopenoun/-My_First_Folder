// agent_of_orchestration.js

const fs = require('fs');
const path = require('path');

function loadModules() {
  const filePath = path.join(__dirname, 'manifest', 'modules.json');
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('❌ Failed to load modules.json:', err.message);
    process.exit(1);
  }
}

function mapModuleFlow(modules) {
  return modules.map(mod => {
    const targets = mod.routes_to.length > 0 ? mod.routes_to.join(' → ') : 'END';
    return `${mod.name} → ${targets}`;
  });
}

function findUnresolvedDependencies(modules) {
  const allNames = modules.map(m => m.name);
  const unresolved = [];

  modules.forEach(mod => {
    (mod.depends_on || []).forEach(dep => {
      if (!allNames.includes(dep)) {
        unresolved.push({ module: mod.name, missing: dep });
      }
    });
  });

  return unresolved;
}

function main() {
  const modules = loadModules();

  console.log('\n🧠 MODULES LOADED:');
  modules.forEach(m => console.log(`• ${m.name}`));

  console.log('\n🔄 MODULE FLOW MAP:');
  mapModuleFlow(modules).forEach(flow => console.log(`→ ${flow}`));

  const unresolved = findUnresolvedDependencies(modules);
  if (unresolved.length > 0) {
    console.log('\n⚠️ UNRESOLVED DEPENDENCIES FOUND:');
    unresolved.forEach(({ module, missing }) =>
      console.log(`• ${module} is missing dependency: ${missing}`)
    );
  } else {
    console.log('\n✅ All module dependencies are satisfied.');
  }
}

main();
