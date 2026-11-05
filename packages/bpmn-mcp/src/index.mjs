#!/usr/bin/env node
import dotenv from 'dotenv';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { clientBackend, localBackend } from './backends.mjs';

dotenv.config({ path: process.env.BPMN_ENV_FILE || '.env', quiet: true });

const mode = process.env.MCP_MODE || 'client';
if (!['client', 'server'].includes(mode)) throw new Error('MCP_MODE must be client or server');
const backend = mode === 'client' ? await clientBackend(process.env) :
  localBackend(process.env.DEFINITIONS_PATH, process.env.MCP_ALLOW_WRITES === 'true');

const server = new McpServer({ name: 'bpmn-server', version: '0.1.0' });
const wrap = fn => async args => {
  try {
    const result = await fn(args);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  } catch (err) {
    return { isError: true, content: [{ type: 'text', text: String(err.message || err) }] };
  }
};

server.tool('list_models', 'List process models in the configured BPMN environment', {}, wrap(() => backend.listModels()));
server.tool('get_model', 'Read a process model for analysis or editing', { name: z.string() },
  wrap(({ name }) => backend.getModel(name)));
server.tool('validate_model', 'Validate BPMN XML against BPMN Server semantics, without executing the process',
  { name: z.string(), xml: z.string() }, wrap(({ name, xml }) => backend.validateModel(xml, name)));
server.tool('save_model', 'Write a validated local BPMN definition (server mode only). Requires explicit consent and opt-in.',
  { name: z.string(), xml: z.string(), confirm: z.boolean() },
  wrap(({ name, xml, confirm }) => backend.saveModel(name, xml, confirm)));
if (mode === 'client') {
  server.tool('list_instances', 'Find process instances in the running BPMN application',
    { query: z.record(z.any()).optional() }, wrap(({ query }) => backend.listInstances(query)));
  server.tool('find_items', 'Find workflow items in the running BPMN application',
    { query: z.record(z.any()).optional() }, wrap(({ query }) => backend.findItems(query)));
}

await server.connect(new StdioServerTransport());
