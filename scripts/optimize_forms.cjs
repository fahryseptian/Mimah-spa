const fs = require('fs');

const files = [
  'src/components/Admin/AdminManagement.tsx',
  'src/components/Admin/VoucherManagement.tsx',
  'src/components/Booking/BookingTracking.tsx',
  'src/components/Booking/BookingWizard.tsx',
  'src/components/Booking/LocationPickerMap.tsx',
  'src/components/Booking/TransportCalculator.tsx',
  'src/components/Landing/QuickBookingBar.tsx',
  'src/components/LoginPage.tsx',
  'src/components/TherapistPortal/TherapistDashboard.tsx',
  'src/components/Therapists/TherapistList.tsx'
];

const unifiedStyle = "w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none";
const smallUnifiedStyle = "w-full bg-stone-50/50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none";

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  
  // More aggressive replacements for LoginPage and others
  content = content.replace(/className="w-full px-4 py-3 bg-white border border-stone-100 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500\/50"/g, `className="${unifiedStyle}"`);
  
  // Catch any inputs that have w-full and border
  // We'll use a regex that matches className="w-full ... border ... "
  // Avoiding buttons
  content = content.replace(/<input\s+([^>]*?)className="w-full[^"]*?border[^"]*?"/gs, (match, p1) => {
    const isSmall = match.includes('text-xs');
    return `<input ${p1}className="${isSmall ? smallUnifiedStyle : unifiedStyle}"`;
  });
  
  content = content.replace(/<select\s+([^>]*?)className="w-full[^"]*?border[^"]*?"/gs, (match, p1) => {
    const isSmall = match.includes('text-xs');
    return `<select ${p1}className="${isSmall ? smallUnifiedStyle : unifiedStyle}"`;
  });
  
  content = content.replace(/<textarea\s+([^>]*?)className="w-full[^"]*?border[^"]*?"/gs, (match, p1) => {
    const isSmall = match.includes('text-xs');
    return `<textarea ${p1}className="${isSmall ? smallUnifiedStyle : unifiedStyle}"`;
  });

  fs.writeFileSync(file, content, 'utf8');
});

console.log('Forms optimized thoroughly');
