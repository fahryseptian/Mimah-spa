const fs = require('fs');
let content = fs.readFileSync('src/components/Booking/BookingWizard.tsx', 'utf8');

// Header
content = content.replace(/bg-stone-900 text-white p-5 sm:p-6 rounded-t-3xl sticky top-0 z-20 border-b border-stone-800/g, 'bg-white text-stone-900 p-5 sm:p-6 rounded-t-3xl sticky top-0 z-20 border-b border-stone-100');

// Step summary
content = content.replace(/bg-stone-900 text-white p-4 rounded-2xl flex items-center justify-between/g, 'bg-emerald-50 text-emerald-900 p-4 rounded-2xl flex items-center justify-between border border-emerald-100');

// Info boxes
content = content.replace(/bg-stone-900 text-stone-100 rounded-2xl space-y-3/g, 'bg-stone-50 text-stone-900 rounded-2xl space-y-3 border border-stone-100');

// Confirmation card
content = content.replace(/bg-stone-900 text-white rounded-2xl p-5 max-w-md mx-auto text-left space-y-3/g, 'bg-white rounded-2xl p-5 max-w-md mx-auto text-left space-y-3 border border-stone-100 shadow-soft');

// Various black/stone buttons
content = content.replace(/bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-black/g, 'bg-stone-100 text-stone-900 rounded-xl text-xs font-semibold hover:bg-stone-200');
content = content.replace(/bg-stone-900 hover:bg-black text-white/g, 'bg-emerald-600 hover:bg-emerald-500 text-white');

// General text-white that might be on light backgrounds now
// This is risky, but let's look for specific patterns
content = content.replace(/text-stone-300/g, 'text-stone-500');
content = content.replace(/text-stone-400/g, 'text-stone-500');
content = content.replace(/bg-stone-800/g, 'bg-stone-50');
content = content.replace(/border-stone-800/g, 'border-stone-100');
content = content.replace(/border-stone-700/g, 'border-stone-100');

fs.writeFileSync('src/components/Booking/BookingWizard.tsx', content, 'utf8');
console.log('BookingWizard modernized');
