#!/usr/bin/env -S node
// Minimal runner to launch an MCP stdio->HTTP adapter pointing to your remotionmcp.
// Usage examples:
//  pnpm mcp:remotion                 # defaults to MCP_NAME=remotionmcp, MCP_URI=http://localhost:4000
//  MCP_URI=http://localhost:8787 pnpm mcp:remotion
//  MCP_NAME=my-remotion MCP_URI=https://example.com/mcp pnpm mcp:remotion

import {spawn} from 'child_process';

const MCP_NAME = process.env.MCP_NAME || 'remotionmcp';
const MCP_URI = process.env.MCP_URI || 'http://localhost:4000';

const args = [
  '-y',
  '-p','pkce-challenge@5',
  '-p','@modelcontextprotocol/sdk@1.18.0',
  '-p','@pyroprompts/mcp-stdio-to-streamable-http-adapter',
  '-c','mcp-stdio-to-streamable-http-adapter'
];

const child = spawn('npx', args, {
  env: { ...process.env, MCP_NAME, URI: MCP_URI },
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => process.exit(code ?? 0));

