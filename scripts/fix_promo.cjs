const fs = require('fs');
let content = fs.readFileSync('src/components/Landing/PromoVoucherStrip.tsx', 'utf8');

// Container
content = content.replace(/bg-stone-900/g, 'bg-emerald-50');
content = content.replace(/border-emerald-700\/40/g, 'border-emerald-200');
content = content.replace(/shadow-xl text-stone-100/g, 'shadow-soft text-emerald-900');

// Header Text
content = content.replace(/text-emerald-400/g, 'text-emerald-600');
content = content.replace(/text-stone-400/g, 'text-emerald-700/80');
content = content.replace(/text-stone-300/g, 'text-emerald-800');

// Inner cards
content = content.replace(/bg-stone-800\/60/g, 'bg-white/80 backdrop-blur-sm');
content = content.replace(/border-emerald-500\/30/g, 'border-emerald-100');
content = content.replace(/text-white/g, 'text-emerald-950');

// Buttons / UI Elements inside
content = content.replace(/bg-stone-900\/80/g, 'bg-emerald-100/80');
content = content.replace(/border-stone-700\/50/g, 'border-emerald-200');
content = content.replace(/bg-emerald-950\/50/g, 'bg-emerald-100');

content = content.replace(/text-emerald-300/g, 'text-emerald-800');
content = content.replace(/text-stone-500/g, 'text-emerald-600/70');

fs.writeFileSync('src/components/Landing/PromoVoucherStrip.tsx', content, 'utf8');
console.log('Promo Banner softened');
