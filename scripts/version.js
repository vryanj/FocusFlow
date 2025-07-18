#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read current version from package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const currentVersion = packageJson.version;

console.log(`Current FocusFlow version: ${currentVersion}`);

// Update VERSION.md
const versionContent = fs.readFileSync('VERSION.md', 'utf8');
const updatedVersionContent = versionContent.replace(
  /Current Version: \d+\.\d+\.\d+/,
  `Current Version: ${currentVersion}`
);
fs.writeFileSync('VERSION.md', updatedVersionContent);

// Update sw.js
const swContent = fs.readFileSync('sw.js', 'utf8');
const updatedSwContent = swContent.replace(
  /const CACHE_NAME = 'focusflow-cache-v[\d.]+'/,
  `const CACHE_NAME = 'focusflow-cache-v${currentVersion}'`
);
fs.writeFileSync('sw.js', updatedSwContent);

console.log('✅ Version updated in:');
console.log('  - package.json');
console.log('  - VERSION.md');
console.log('  - sw.js (CACHE_NAME)');
console.log('');
console.log('📝 Don\'t forget to:');
console.log('  1. Update CHANGELOG.md with new changes');
console.log('  2. Commit your changes');
console.log('  3. Create a git tag: git tag v' + currentVersion);
console.log('  4. Push with tags: git push origin main --tags'); 