const fs = require('fs');
let content = fs.readFileSync('vite.config.ts', 'utf8');

content = content.replace(
  /name: 'Mimah Spa - Home Service Specialist',/,
  "name: 'Mimah Spa - Pijat Panggilan Medan',"
);
content = content.replace(
  /description: 'Layanan Spa & Pijat Profesional Home Service di Medan dan sekitarnya.',/,
  "description: 'Layanan Spa & Pijat Profesional khusus wanita. Terapis datang ke rumah Anda di Medan dan sekitarnya.',"
);
content = content.replace(
  /theme_color: '#064e3b', \/\/ emerald-950/,
  "theme_color: '#059669', // emerald-600"
);
content = content.replace(
  /background_color: '#fafaf9', \/\/ stone-50/,
  "background_color: '#FDFBF7',"
);

fs.writeFileSync('vite.config.ts', content, 'utf8');
console.log('PWA Manifest updated');
