const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, 'src');

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(file));
    } else {
      if (file.endsWith('.css')) results.push(file);
    }
  });
  return results;
}

const cssFiles = walkDir(cssDir);

const replaceMap = {
  'var(--dark-900)': 'var(--bg-main)',
  'var(--dark-800)': 'var(--bg-secondary)',
  'var(--dark-700)': 'var(--bg-tertiary)',
  'var(--dark-600)': 'var(--bg-hover)',
  'var(--white)': 'var(--text-main)',
  '#080a0e': 'var(--bg-main)',
  '#0d1018': 'var(--bg-secondary)',
  '#141820': 'var(--bg-tertiary)',
  '#1c2230': 'var(--bg-hover)',
  '#0b0e17': 'var(--bg-tertiary)',
  'rgba(255, 255, 255, 0.05)': 'var(--bg-hover)',
  'rgba(255, 255, 255, 0.03)': 'var(--bg-tertiary)',
  'rgba(255, 255, 255, 0.07)': 'var(--border-color)',
  'rgba(255,255,255,0.06)': 'var(--border-color)',
  'rgba(255,255,255,0.08)': 'var(--border-color)',
  'rgba(255,255,255,0.15)': 'var(--border-hover)',
  'var(--slate-400)': 'var(--text-muted)',
  'var(--slate-300)': 'var(--text-dim)',
  'var(--slate-200)': 'var(--text-main)'
};

cssFiles.forEach(file => {
  if (file.endsWith('globals.css')) return;
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  Object.keys(replaceMap).forEach(key => {
    if (content.includes(key)) {
      content = content.replaceAll(key, replaceMap[key]);
      changed = true;
    }
  });
  
  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${path.basename(file)}`);
  }
});
