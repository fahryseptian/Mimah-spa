const fs = require('fs');
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// Fix Hero Banner text color
// Find: bg-emerald-900/95 text-stone-900
appContent = appContent.replace(/bg-emerald-900\/95 text-stone-900/g, 'bg-emerald-900/95 text-white');
// The h1 and p tags in hero banner might also need fixing if they were affected.
appContent = appContent.replace(/text-stone-300/g, 'text-emerald-50'); // for the paragraph
// Any other text-stone-900 that should be white in the hero banner?
// Looking for the "Spa & Pijat Panggilan" text... Wait, that doesn't have an explicit text color, it inherits from the wrapper.

// The Promo Bar might also be broken if it used text-white. Let's make sure the footer is okay too.
fs.writeFileSync('src/App.tsx', appContent, 'utf8');
