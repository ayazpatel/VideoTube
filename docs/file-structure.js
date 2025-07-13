// File: scripts/generate-structure.js
// Run via: node fs.js > project-structure.txt

const fs   = require('fs');
const path = require('path');

function walk(dir, fileList = []) {
  fs.readdirSync(dir).forEach(item => {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  });
  return fileList;
}

const projectRoot = path.resolve(__dirname, '..');
const allFiles    = walk(projectRoot);
console.log(allFiles.join('\n'));