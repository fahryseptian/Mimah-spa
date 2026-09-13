const fs = require('fs');

function softenFile(file) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/shadow-md/g, 'shadow-soft');
  content = content.replace(/shadow-lg/g, 'shadow-soft-hover');
  content = content.replace(/shadow-xl/g, 'shadow-soft-hover');
  content = content.replace(/shadow-2xl/g, 'shadow-soft-hover');
  // soften some border colors
  content = content.replace(/border-stone-200/g, 'border-stone-100');
  fs.writeFileSync(file, content, 'utf8');
}

softenFile('src/components/Services/ServiceCatalog.tsx');
softenFile('src/components/Landing/HowItWorks.tsx');
softenFile('src/components/Landing/QuickBookingBar.tsx');
softenFile('src/App.tsx');
softenFile('src/components/Navbar.tsx');
softenFile('src/components/Booking/BookingWizard.tsx');

console.log('Softened shadows and borders');
