/**
 * Migration Angular 11 (NgModule) -> 21 (standalone) : etape 1.
 * Injecte les `imports` de composants (directives/pipes utilises dans les
 * templates) dans chaque @Component, pour la conversion standalone.
 * Prerequis : app.module.ts supprime, app.routes.ts / app.config.ts / app.ts en place.
 * Usage : node tools/migrate-21/inject-imports.js  (depuis la racine du workspace v21)
 */
const fs = require('fs');
const path = require('path');

const appDir = path.join(process.cwd(), 'src', 'app');

const DIRECTIVE_MAP = {
  'ngIf': { name: 'NgIf', from: '@angular/common' },
  'ngFor': { name: 'NgFor', from: '@angular/common' },
  'ngClass': { name: 'NgClass', from: '@angular/common' },
  'ngStyle': { name: 'NgStyle', from: '@angular/common' },
  'ngModel': { name: 'FormsModule', from: '@angular/forms' },
  'router-outlet': { name: 'RouterOutlet', from: '@angular/router' },
  'routerLink': { name: 'RouterLink', from: '@angular/router' },
  'currency': { name: 'CurrencyPipe', from: '@angular/common' },
  'date': { name: 'DatePipe', from: '@angular/common' },
  'number': { name: 'DecimalPipe', from: '@angular/common' },
  'json': { name: 'JsonPipe', from: '@angular/common' },
};

function listFiles(dir) {
  let out = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) out = out.concat(listFiles(p));
    else if (f.endsWith('.component.ts')) out.push(p);
  }
  return out;
}

function findDecoratorBlock(content) {
  const start = content.indexOf('@Component({');
  if (start === -1) return null;
  let depth = 0, i = start;
  for (; i < content.length; i++) {
    if (content[i] === '{') depth++;
    else if (content[i] === '}') {
      depth--;
      if (depth === 0) break;
    }
  }
  // include trailing '});' if present
  let end = content.indexOf(')', i);
  return { start, end: end + 1 };
}

const files = listFiles(appDir);
let patched = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('standalone: false') || content.includes('imports:')) {
    // deja traite (ou scaffold) : ignorer sauf si decorator vide d'imports mais utilise des directives
  }
  const block = findDecoratorBlock(content);
  if (!block) continue;
  const decorator = content.slice(block.start, block.end);

  // Lire le template
  let template = '';
  const tMatch = decorator.match(/templateUrl:\s*'([^']+)'/);
  if (tMatch) {
    const tplPath = path.resolve(path.dirname(file), tMatch[1]);
    if (fs.existsSync(tplPath)) template = fs.readFileSync(tplPath, 'utf8');
  } else {
    const inline = decorator.match(/template:\s*`([\s\S]*?)`/);
    if (inline) template = inline[1];
  }
  if (!template) continue;

  // Detecter les directives/pipes utilises
  const needed = new Map(); // name -> from
  for (const [token, meta] of Object.entries(DIRECTIVE_MAP)) {
    let used = false;
    if (token === 'ngIf' || token === 'ngFor' || token === 'ngClass' || token === 'ngStyle' || token === 'ngModel') {
      used = template.includes(token);
    } else if (token === 'router-outlet') {
      used = template.includes('<router-outlet');
    } else if (token === 'routerLink') {
      used = template.includes('routerLink') || template.includes('routerLinkActive');
    } else {
      // pipes : {{ x | date }} etc.
      const re = new RegExp('\\|\\s*' + token + '\\b');
      used = re.test(template);
    }
    if (used) needed.set(meta.name, meta.from);
  }
  if (needed.size === 0) continue;

  // Eviter les doublons avec des imports existants dans le decorator
  const existingImports = decorator.match(/imports:\s*\[[^\]]*\]/);
  if (existingImports) continue;

  // Grouper par module source
  const byModule = {};
  for (const [name, from] of needed) {
    (byModule[from] = byModule[from] || []).push(name);
  }

  // Ajouter les imports en haut du fichier
  const importLines = Object.entries(byModule).map(([from, names]) => `import { ${names.join(', ')} } from '${from}';`).join('\n');
  const firstImport = content.search(/^import /m);
  const insertAt = firstImport === -1 ? 0 : firstImport;
  content = content.slice(0, insertAt) + importLines + '\n' + content.slice(insertAt);

  // Injecter imports: [...] dans le decorator (apres la premiere ligne du decorator)
  const names = [...needed.keys()].join(', ');
  const block2 = findDecoratorBlock(content);
  const decorator2 = content.slice(block2.start, block2.end);
  const newDecorator = decorator2.replace(/(@Component\(\{\s*\n)/, `$1  imports: [${names}],\n`);
  if (newDecorator === decorator2) continue;
  content = content.slice(0, block2.start) + newDecorator + content.slice(block2.end);

  fs.writeFileSync(file, content, 'utf8');
  patched++;
  console.log('import(s) injecte(s) :', path.relative(appDir, file), '->', names);
}

console.log('Termine. Composants modifies :', patched);
