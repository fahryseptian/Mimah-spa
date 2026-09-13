const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
content = content.replace(/<meta name="theme-color" content="#064e3b" \/>/, '<meta name="theme-color" content="#059669" />');
fs.writeFileSync('index.html', content, 'utf8');
