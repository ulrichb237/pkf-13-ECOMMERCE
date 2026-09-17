/**
 * Audit MCP Angular : appelle get_best_practices, list_projects et
 * onpush_zoneless_migration via le serveur stdio `ng mcp`.
 * Usage : node tools/migrate-21/mcp-audit.js  (racine du workspace v21)
 */
const { spawn } = require('child_process');

const cli = 'node_modules/@angular/cli/bin/ng.js';
const proc = spawn('node', [cli, 'mcp'], { cwd: process.cwd() });

const send = (obj) => proc.stdin.write(JSON.stringify(obj) + '\n');

let buffer = '';
proc.stdout.on('data', (chunk) => {
  buffer += chunk.toString();
  let idx;
  while ((idx = buffer.indexOf('\n')) !== -1) {
    const line = buffer.slice(0, idx).trim();
    buffer = buffer.slice(idx + 1);
    if (!line) continue;
    try { handleMessage(JSON.parse(line)); } catch { /* ligne partielle */ }
  }
});

function handleMessage(msg) {
  if (msg.id === 1) {
    send({ jsonrpc: '2.0', method: 'notifications/initialized' });
    send({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'get_best_practices', arguments: {} } });
    send({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'list_projects', arguments: {} } });
    send({ jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'onpush_zoneless_migration', arguments: { fileOrDirPath: 'src/app' } } });
  } else if (msg.id === 2) {
    const text = (msg.result && msg.result.content || []).map(c => c.text).join('\n');
    console.log('===== GET_BEST_PRACTICES (extrait) =====');
    console.log(text.slice(0, 4500));
    console.log('===== ... (tronque) =====');
  } else if (msg.id === 3) {
    const text = (msg.result && msg.result.content || []).map(c => c.text).join('\n');
    console.log('===== LIST_PROJECTS =====');
    console.log(text.slice(0, 1200));
  } else if (msg.id === 4) {
    const text = (msg.result && msg.result.content || []).map(c => c.text).join('\n');
    console.log('===== ONPUSH_ZONELESS_MIGRATION (extrait) =====');
    console.log(text.slice(0, 3000));
    console.log('===== ... (tronque) =====');
    proc.kill();
    process.exit(0);
  }
}

send({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'buffy', version: '1.0' } } });
setTimeout(() => { console.error('timeout MCP'); proc.kill(); process.exit(1); }, 120000);
