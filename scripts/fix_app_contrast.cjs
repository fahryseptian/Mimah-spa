const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(/bg-white([^>]*?)text-white/g, 'bg-white$1text-stone-900');
content = content.replace(/bg-white([^>]*?)text-stone-100/g, 'bg-white$1text-stone-800');
content = content.replace(/bg-stone-50([^>]*?)text-white/g, 'bg-stone-50$1text-stone-900');
fs.writeFileSync('src/App.tsx', content, 'utf8');
