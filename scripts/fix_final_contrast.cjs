const fs = require('fs');

function fixFile(file, search, replace) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(search, replace);
  fs.writeFileSync(file, content, 'utf8');
}

// Navbar contrast
let nav = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
nav = nav.replace(/bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-stone-900/g, 'bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white');
nav = nav.replace(/bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-stone-900/g, 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white');
fs.writeFileSync('src/components/Navbar.tsx', nav, 'utf8');

// Promo button contrast
let promo = fs.readFileSync('src/components/Landing/PromoVoucherStrip.tsx', 'utf8');
promo = promo.replace(/bg-emerald-600 hover:bg-emerald-500 text-stone-900/g, 'bg-emerald-600 hover:bg-emerald-500 text-white');
fs.writeFileSync('src/components/Landing/PromoVoucherStrip.tsx', promo, 'utf8');

// Booking Wizard buttons
let booking = fs.readFileSync('src/components/Booking/BookingWizard.tsx', 'utf8');
booking = booking.replace(/bg-emerald-600 hover:bg-emerald-500 text-stone-900/g, 'bg-emerald-600 hover:bg-emerald-500 text-white');
fs.writeFileSync('src/components/Booking/BookingWizard.tsx', booking, 'utf8');

console.log('Final contrast fixes applied');
