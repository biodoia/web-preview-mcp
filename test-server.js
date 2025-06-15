#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Testing Web Preview MCP Server...');

const serverPath = join(__dirname, 'dist', 'server.js');
const child = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// Send a simple request to list tools
const request = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/list',
  params: {}
};

child.stdin.write(JSON.stringify(request) + '\n');

child.stdout.on('data', (data) => {
  console.log('Response:', data.toString());
});

child.stderr.on('data', (data) => {
  console.error('Error:', data.toString());
});

// Give it some time then exit
setTimeout(() => {
  child.kill();
  process.exit(0);
}, 2000);