const fs = require('fs');
let content = fs.readFileSync('src/components/LoginPage.tsx', 'utf8');

// Wrapper
content = content.replace(/bg-stone-900 text-stone-100/g, 'bg-stone-50 text-stone-900');

// Tabs
content = content.replace(/bg-stone-900\/60 text-stone-400 border-stone-700 hover:bg-stone-800/g, 'bg-white text-stone-500 border-stone-100 hover:bg-stone-50');

// Inputs
content = content.replace(/bg-stone-900 border border-stone-700 rounded-xl text-xs sm:text-sm text-white/g, 'bg-white border border-stone-100 rounded-xl text-xs sm:text-sm text-stone-900');
content = content.replace(/placeholder-stone-500/g, 'placeholder-stone-400');

// Inner card
content = content.replace(/bg-stone-800\/80 backdrop-blur-xl border border-stone-700/g, 'bg-white border border-stone-100 shadow-soft');

// Text colors
content = content.replace(/text-stone-300/g, 'text-stone-600');
content = content.replace(/text-stone-400/g, 'text-stone-500');

fs.writeFileSync('src/components/LoginPage.tsx', content, 'utf8');
console.log('LoginPage modernized');
