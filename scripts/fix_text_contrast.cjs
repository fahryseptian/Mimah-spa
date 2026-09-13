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
  
  // If we find bg-white and text-white together (likely from our previous replace)
  content = content.replace(/bg-white([^>]*?)text-white/g, 'bg-white$1text-stone-900');
  content = content.replace(/bg-white([^>]*?)text-stone-100/g, 'bg-white$1text-stone-800');
  content = content.replace(/bg-stone-50([^>]*?)text-white/g, 'bg-stone-50$1text-stone-900');
  
  // But wait, some buttons are emerald and SHOULD have white text
  // Let's restore those
  content = content.replace(/bg-emerald-600([^>]*?)text-stone-900/g, 'bg-emerald-600$1text-white');
  content = content.replace(/bg-emerald-500([^>]*?)text-stone-900/g, 'bg-emerald-500$1text-white');
  content = content.replace(/bg-teal-600([^>]*?)text-stone-900/g, 'bg-teal-600$1text-white');
  content = content.replace(/from-emerald-600([^>]*?)text-stone-900/g, 'from-emerald-600$1text-white');

  fs.writeFileSync(file, content, 'utf8');
});

console.log('Text contrast fixed');
