const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir('src/components', (file) => {
  if (!file.endsWith('.tsx')) return;
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(/shadow-lg shadow-emerald-950\/60/g, 'shadow-soft-hover shadow-emerald-200');
  content = content.replace(/shadow-md shadow-emerald-950\/50/g, 'shadow-soft shadow-emerald-200');
  content = content.replace(/shadow-lg/g, 'shadow-soft-hover');
  content = content.replace(/shadow-md/g, 'shadow-soft');
  content = content.replace(/shadow-2xl/g, 'shadow-soft-hover');
  
  content = content.replace(/bg-stone-900/g, 'bg-white'); // One more pass for any remaining dark bgs
  content = content.replace(/border-stone-800/g, 'border-stone-100');
  content = content.replace(/border-stone-700/g, 'border-stone-100');

  fs.writeFileSync(file, content, 'utf8');
});

console.log('All components softened and lightened');
