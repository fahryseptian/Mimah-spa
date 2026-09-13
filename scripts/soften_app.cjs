const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(/shadow-lg/g, 'shadow-soft-hover');
content = content.replace(/shadow-md/g, 'shadow-soft');
content = content.replace(/shadow-2xl/g, 'shadow-soft-hover');
content = content.replace(/bg-stone-900/g, 'bg-white');
content = content.replace(/border-stone-800/g, 'border-stone-100');
content = content.replace(/border-stone-700/g, 'border-stone-100');
fs.writeFileSync('src/App.tsx', content, 'utf8');
