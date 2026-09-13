const fs = require('fs');

function updateFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [search, replace] of replacements) {
    // using regex for global replacement
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    content = content.replace(regex, replace);
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

// 1. Update App.tsx
updateFile('src/App.tsx', [
  ['bg-stone-100/70', 'bg-[#FAFAFA]'], // Main background
  ['bg-[#0f2a24]', 'bg-emerald-900/95'], // Hero background - slightly warmer/softer dark green
  ['bg-stone-900 text-stone-400', 'bg-white text-stone-600 border-t border-stone-200 shadow-sm'], // Footer
  ['border-stone-800', 'border-stone-200'], // Footer borders
  ['text-white', 'text-stone-900'], // Some white text to dark in footer (careful with this one, maybe leave footer text white if footer is dark, but I made it white background)
]);

console.log('App.tsx updated');

// Let's refine the footer text replacement for App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(/<footer className="mt-16 bg-stone-900 text-stone-400 text-xs border-t border-stone-800">/g, '<footer className="mt-16 bg-white text-stone-600 text-xs border-t border-stone-200 shadow-sm">');
appContent = appContent.replace(/<span className="text-lg font-bold text-white font-serif-display tracking-tight">/g, '<span className="text-lg font-bold text-stone-900 font-serif-display tracking-tight">');
appContent = appContent.replace(/<div className="font-bold text-white uppercase tracking-wider text-\[11px\]">/g, '<div className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">');
appContent = appContent.replace(/<div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center/g, '<div className="pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-center');
appContent = appContent.replace(/hover:text-white/g, 'hover:text-stone-900');
appContent = appContent.replace(/bg-stone-800\/60/g, 'bg-stone-100');
appContent = appContent.replace(/border border-stone-800/g, 'border border-stone-200');

fs.writeFileSync('src/App.tsx', appContent, 'utf8');

// 2. Update Navbar.tsx
let navContent = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Main Navbar wrap
navContent = navContent.replace(/bg-stone-900 text-stone-100 shadow-md border-b border-stone-800/g, 'bg-white/95 backdrop-blur-md text-stone-800 shadow-sm border-b border-stone-200');

// Top Notification Bar
navContent = navContent.replace(/bg-emerald-950 border-b border-emerald-900\/60 text-emerald-200/g, 'bg-emerald-50 border-b border-emerald-100 text-emerald-800');
navContent = navContent.replace(/text-white font-mono bg-emerald-900\/80/g, 'text-emerald-900 font-mono bg-emerald-100');
navContent = navContent.replace(/text-emerald-300\/90/g, 'text-emerald-700');
navContent = navContent.replace(/<strong className="text-white font-semibold">/g, '<strong className="text-emerald-900 font-semibold">');
navContent = navContent.replace(/text-emerald-300 border border-emerald-500\/30/g, 'text-emerald-700 border border-emerald-300');

// Logo text
navContent = navContent.replace(/text-white font-serif-display whitespace-nowrap/g, 'text-stone-900 font-serif-display whitespace-nowrap');
navContent = navContent.replace(/text-stone-400 hidden sm:block/g, 'text-stone-500 hidden sm:block');

// Buttons / Dropdown
navContent = navContent.replace(/bg-stone-800\/80 hover:bg-stone-800 text-stone-200 rounded-lg border border-stone-700\/80/g, 'bg-stone-50 hover:bg-stone-100 text-stone-700 rounded-lg border border-stone-200');
navContent = navContent.replace(/<strong className="text-white">/g, '<strong className="text-stone-900">');
navContent = navContent.replace(/bg-stone-800 rounded-xl shadow-xl border border-stone-700/g, 'bg-white rounded-xl shadow-xl border border-stone-100');
navContent = navContent.replace(/hover:bg-stone-700/g, 'hover:bg-stone-50');
navContent = navContent.replace(/bg-emerald-900\/40 text-emerald-300/g, 'bg-emerald-50 text-emerald-700');
navContent = navContent.replace(/text-stone-300/g, 'text-stone-600');

// Points badge
navContent = navContent.replace(/bg-amber-950\/30 border border-amber-900\/50/g, 'bg-amber-50 border border-amber-200');
navContent = navContent.replace(/text-amber-200/g, 'text-amber-600');

// Customer nav items
navContent = navContent.replace(/text-stone-400 hover:text-white/g, 'text-stone-500 hover:text-emerald-700');
navContent = navContent.replace(/text-emerald-400 border-b-2 border-emerald-500/g, 'text-emerald-700 border-b-2 border-emerald-600');

// Admin/Therapist controls
navContent = navContent.replace(/border border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-white/g, 'border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900');
navContent = navContent.replace(/border border-rose-900\/50 text-rose-400 bg-rose-950\/20 hover:bg-rose-900\/40/g, 'border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100');
navContent = navContent.replace(/hover:bg-stone-800/g, 'hover:bg-stone-100');

// Mobile menu
navContent = navContent.replace(/bg-stone-900 border-t border-stone-800/g, 'bg-white border-t border-stone-200');
navContent = navContent.replace(/bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-900 border border-emerald-600\/50/g, 'bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200');
navContent = navContent.replace(/text-white/g, 'text-stone-900');

fs.writeFileSync('src/components/Navbar.tsx', navContent, 'utf8');
console.log('Navbar.tsx updated');

