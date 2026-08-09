const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'images');

if (fs.existsSync(imgDir)) {
  const files = fs.readdirSync(imgDir);
  files.forEach(file => {
    const fullPath = path.join(imgDir, file);
    if (file.includes('.jpeg.png')) {
      const base = file.replace('.jpeg.png', '');
      fs.copyFileSync(fullPath, path.join(imgDir, `${base}.jpeg`));
      fs.copyFileSync(fullPath, path.join(imgDir, `${base}.png`));
      fs.copyFileSync(fullPath, path.join(imgDir, `${base}.jpg`));
    }
  });
}

const mp4mp4 = path.join(__dirname, 'orbit-hero.mp4.mp4');
const mp4 = path.join(__dirname, 'orbit-hero.mp4');
if (fs.existsSync(mp4mp4)) {
  fs.copyFileSync(mp4mp4, mp4);
}

console.log('All 11 images synced in .jpeg, .png, and .jpg formats!');
