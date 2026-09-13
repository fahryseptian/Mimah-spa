const fs = require('fs');
let content = fs.readFileSync('src/components/Landing/PromoVoucherStrip.tsx', 'utf8');

// The main container background is emerald-50.
// Let's make the inner cards white.
content = content.replace(/className="bg-stone-800\/90 rounded-2xl/g, 'className="bg-white rounded-2xl');
content = content.replace(/border-stone-700\/80/g, 'border-emerald-100');
content = content.replace(/shadow-lg/g, 'shadow-soft');

// The voucher code badge
content = content.replace(/bg-emerald-950 text-emerald-800/g, 'bg-emerald-100 text-emerald-800');
content = content.replace(/border-emerald-600\/50/g, 'border-emerald-200');

// The discount badge
content = content.replace(/text-amber-400 bg-amber-950\/60/g, 'text-amber-700 bg-amber-50');
content = content.replace(/border-amber-700\/40/g, 'border-amber-200');

// The title and description
content = content.replace(/text-emerald-950/g, 'text-stone-900');
content = content.replace(/text-emerald-800/g, 'text-stone-600');

// The bottom section
content = content.replace(/border-t border-stone-700\/60/g, 'border-t border-stone-100');
content = content.replace(/bg-stone-700\/80 hover:bg-stone-700/g, 'bg-stone-50 hover:bg-stone-100');
content = content.replace(/text-emerald-800 hover:text-emerald-950/g, 'text-stone-600 hover:text-stone-900');

// The "Gunakan" button
content = content.replace(/text-emerald-950/g, 'text-white'); // It was emerald-950 on bg-emerald-600, let's make it white for contrast
content = content.replace(/shadow-emerald-950\/50/g, 'shadow-emerald-200');

// The "Hemat s/d 50rb" badge
content = content.replace(/text-rose-300 border border-rose-500\/30/g, 'text-rose-700 border border-rose-200');
content = content.replace(/bg-rose-500\/20/g, 'bg-rose-50');

// The border-b in header
content = content.replace(/border-b border-stone-800/g, 'border-b border-emerald-100');

fs.writeFileSync('src/components/Landing/PromoVoucherStrip.tsx', content, 'utf8');
console.log('PromoVoucherStrip colors fixed');
