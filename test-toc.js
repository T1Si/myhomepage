const fs = require('fs');
const html = fs.readFileSync('./src/project1-docs.html', 'utf8');
console.log("h2, h3 count:", html.includes("'h2, h3'"));
console.log("h2 count:", html.includes("'h2'"));
