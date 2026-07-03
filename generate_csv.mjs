import fs from 'fs';
import { hawawshiMenu, butcheryMenu } from './src/data.js';

let csv = "Category,Name,Description,Price\n";

function processMenu(menu) {
  menu.forEach(section => {
    section.items.forEach(item => {
      const name = item.name.replace(/"/g, '""');
      const desc = item.desc ? item.desc.replace(/"/g, '""') : '';
      csv += `"${section.category}","${name}","${desc}",${item.price}\n`;
    });
  });
}

processMenu(hawawshiMenu);
processMenu(butcheryMenu);

fs.writeFileSync('Full_Menu_For_Google_Sheets.csv', csv, 'utf8');
console.log("CSV generated successfully!");
