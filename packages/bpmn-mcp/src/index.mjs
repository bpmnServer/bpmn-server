#!/usr/bin/env node
// BPMN Server's MCP: the running server's API over stdio. .env says which server and with which keys.
import fs from 'node:fs';
import dotenv from 'dotenv';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { BPMNClient, BPMNClient2 } from 'bpmn-client';
import { tools } from './tools.mjs';

// stdout is the MCP protocol: what the client libraries print must not reach it
console.log = console.error;

dotenv.config({ path: process.env.BPMN_ENV_FILE || '.env', quiet: true });
const { HOST = 'localhost', PORT = '3000', API_KEY, ADMIN_API_KEY } = process.env;
if (!API_KEY) throw new Error('API_KEY is required: set it in .env, or name the file with BPMN_ENV_FILE');

const clients = {
  v1: new BPMNClient(HOST, Number(PORT), API_KEY, { adminApiKey: ADMIN_API_KEY }),
  v2: new BPMNClient2(HOST, Number(PORT), API_KEY, { adminApiKey: ADMIN_API_KEY }),
};

const { version } = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const server = new McpServer({ name: 'bpmn-server', version });
for (const tool of tools) {
  server.registerTool(tool.name, { description: tool.description, inputSchema: tool.input, annotations: tool.annotations }, async args => {
    try {
      const result = await tool.run(clients, args);
      return { content: [{ type: 'text', text: typeof result === 'string' ? result : JSON.stringify(result) }] };
    } catch (error) {
      return { isError: true, content: [{ type: 'text', text: String(error?.message || error) }] };
    }
  });
}

await server.connect(new StdioServerTransport());
