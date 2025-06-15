#!/usr/bin/env node

// Test script to verify MCP server is working

const { spawn } = require('child_process');

console.log('🧪 Testing Web Preview MCP Server...\n');

// Start the MCP server
const server = spawn('node', ['dist/server.js'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env, HEADLESS: 'false', PREVIEW_PORT: '8300' }
});

// Handle server output
let serverReady = false;

server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('Server:', output.trim());
  
  if (output.includes('Preview server running')) {
    serverReady = true;
    runTests();
  }
});

server.stderr.on('data', (data) => {
  console.error('Server Error:', data.toString());
});

// Test MCP protocol communication
async function runTests() {
  console.log('\n📋 Running MCP Protocol Tests...\n');
  
  // Test 1: List available tools
  const listToolsRequest = {
    jsonrpc: '2.0',
    method: 'tools/list',
    id: 1
  };
  
  server.stdin.write(JSON.stringify(listToolsRequest) + '\n');
  
  // Give it a moment to process
  setTimeout(() => {
    // Test 2: Call preview_open tool
    const previewRequest = {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'preview_open',
        arguments: {
          url: 'https://example.com',
          mode: 'local',
          autoRefresh: false
        }
      },
      id: 2
    };
    
    console.log('\n🌐 Testing preview_open tool...');
    server.stdin.write(JSON.stringify(previewRequest) + '\n');
  }, 1000);
  
  // Clean up after tests
  setTimeout(() => {
    console.log('\n✅ Tests completed! Shutting down server...');
    server.kill();
    process.exit(0);
  }, 5000);
}

// Handle process termination
process.on('SIGINT', () => {
  server.kill();
  process.exit(0);
});