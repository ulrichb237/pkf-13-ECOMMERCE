/**
 * Migration Angular 11 -> 21 : etape 2.
 * Injecte les sous-composants utilises dans les templates (selectors <app-...>)
 * dans les `imports` standalone de chaque composant parent.
 * Usage : node tools/migrate-21/inject-child-components.js  (racine du workspace v21)
 */
const fs = require('fs');
const path = require('path');

const appDir = path.join(process.cwd(), 'src', 'app');

function listFiles(dir, ext) {
  let out = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) out = out.concat(listFiles(p, ext));
    else if (f.endsWith(ext)) out.push(p);
  }
  return out;
}

// 1. Carte selector -> { className, file }
const selectorMap = {};
for (const file of listFiles(appDir, '.component.ts')) {
  const content = fs.readFileSync(file, 'utf8');
  const m = content.match(/selector:\s*'([^']+)'/);
  const c = content.match(/export class (\w+)/);
  if (m && c) selectorMap[m[1]] = { className: c[1], file };
}

// 2. Pour chaque composant : scanner le template, injecter les classes enfants
let patched = 0;
for (const file of listFiles(appDir, '.component.ts')) {
  let content = fs.readFileSync(file, 'utf8');
  const tplMatch = content.match(/templateUrl:\s*'([^']+)'/);
  if (!tplMatch) continue;
  const tplPath = path.resolve(path.dirname(file), tplMatch[1]);
  if (!fs.existsSync(tplPath)) continue;
  const template = fs.readFileSync(tplPath, 'utf8');

  const selectors = Object.keys(selectorMap).filter(s => s !== 'app-root' && template.includes('<' + s));
  if (selectors.length === 0) continue;

  const toImport = [];
  let changed = false;
  for (const s of selectors) {
    const { className, file: childFile } = selectorMap[s];
    if (childFile === file) continue;
    // import relatif
    let rel = path.relative(path.dirname(file), childFile).replace(/\\/g, '/').replace(/\.ts$/, '');
    if (!rel.startsWith('.')) rel = './' + rel;
    const importRe = new RegExp("import \\{ " + className + " \\} from '" + rel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "';");
    if (!importRe.test(content)) {
      content = content.replace(/^(@Component)/m, `import { ${className} } from '${rel}';\n\n$1`);
      changed = true;
    }
    toImport.push(className);
  }
  if (!changed && toImport.length === 0) continue;

  // Ajouter dans imports: [...] existant
  const m = content.match(/imports:\s*\[([^\]]*)\]/);
  if (m) {
    const current = m[1].trim();
    const merged = current ? current + ', ' + toImport.join(', ') : toImport.join(', ');
    content = content.replace(/imports:\s*\[[^\]]*\]/, `imports: [${merged}]`);
    fs.writeFileSync(file, content, 'utf8');
    patched++;
    console.log('sous-composant(s) injecte(s) :', path.relative(appDir, file), '->', toImport.join(', '));
  } else {
    console.log('!! pas de bloc imports pour', path.relative(appDir, file), '-', toImport.join(', '));
  }
}
console.log('Termine. Composants modifies :', patched);
