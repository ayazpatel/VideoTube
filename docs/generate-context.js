// File: scripts/generate-context.js
// Usage: node generate-context.js > express_context.txt

const fs   = require('fs');
const path = require('path');

// Base folder to walk (change as needed)
const baseDir = path.resolve(__dirname, '../backend/express_js/');

// Optional: skip these directories
const skipDirs = ['node_modules', '.git', 'public/temp'];

function walk(dir, fileList = []) {
  fs.readdirSync(dir).forEach(item => {
    const fullPath = path.join(dir, item);
    const relPath  = path.relative(baseDir, fullPath).replace(/\\/g, '/');

    // skip node_modules, git metadata, etc
    if (skipDirs.some(d => relPath.startsWith(d))) return;

    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  });
  return fileList;
}

// Gather all files under backend/express_js
const allFiles = walk(baseDir);

// Emit a single text file: for each file, print a header and then its contents
allFiles.forEach(fp => {
  const rel = path.relative(baseDir, fp).replace(/\\/g, '/');
  console.log('='.repeat(80));
  console.log(`File: ${rel}`);
  console.log('='.repeat(80));
  console.log(fs.readFileSync(fp, 'utf8'));
  console.log('\n\n');
});