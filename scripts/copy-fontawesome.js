#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'node_modules', '@fortawesome', 'fontawesome-free', 'webfonts');
const targetDir = path.join(__dirname, '..', 'assets', 'webfonts');

console.log('📁 Copying Font Awesome webfonts...');

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Copy all files from source to target
const files = fs.readdirSync(sourceDir);
files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`   ✓ ${file}`);
});

console.log('✅ Font Awesome webfonts copied successfully!');
