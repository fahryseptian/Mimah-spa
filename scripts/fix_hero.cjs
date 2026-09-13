const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Hero Banner Container
content = content.replace(/bg-emerald-900\/95 text-white/g, 'bg-[#FDFBF7] text-stone-900');

// Decorative blurs
content = content.replace(/bg-emerald-500\/10/g, 'bg-emerald-200/40');

// Badge
content = content.replace(/bg-emerald-900\/50 text-emerald-100 .*? border-emerald-500\/20/g, 'bg-white/80 text-emerald-800 border-emerald-200 shadow-sm');
content = content.replace(/text-emerald-300/g, 'text-emerald-600');

// H1 highlight
content = content.replace(/text-emerald-400/g, 'text-emerald-700');

// P text
content = content.replace(/text-emerald-50/g, 'text-stone-600');

// ShareButton props
content = content.replace(/!bg-\[#153b33\] hover:!bg-\[#1c4d43\] !text-emerald-100 !border-emerald-700\/50/g, '!bg-white hover:!bg-stone-50 !text-emerald-800 !border-emerald-200 shadow-sm');

// Below the hero there's a 4-grid features section. Let's check them.
// "bg-emerald-950/40 p-4 rounded-xl border border-emerald-900/50"
content = content.replace(/bg-emerald-950\/40/g, 'bg-white/80 backdrop-blur-sm');
content = content.replace(/border-emerald-900\/50/g, 'border-emerald-100');
content = content.replace(/text-stone-400/g, 'text-stone-500');

fs.writeFileSync('src/App.tsx', content, 'utf8');
console.log('Hero modernized');
