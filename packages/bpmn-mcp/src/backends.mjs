import fs from 'node:fs/promises';
import path from 'node:path';
import { verifyModel } from 'bpmn-server';

export function cleanName(name) {
  if (typeof name !== 'string' || !name || name.length > 160 || name.includes('/') || name.includes('\\') || name === '.' || name === '..') {
    throw new Error('Invalid model name');
  }
  return name.endsWith('.bpmn') ? name.slice(0, -5) : name;
}

export function localBackend(folder, allowWrites = false) {
  if (!folder) throw new Error('DEFINITIONS_PATH required');
  const root = path.resolve(folder);
  const fileOf = name => path.join(root, cleanName(name) + '.bpmn');
  return {
    mode: 'server',
    async listModels() { return (await fs.readdir(root)).filter(n => n.endsWith('.bpmn')).map(n => n.slice(0, -5)); },
    async getModel(name) { return { name: cleanName(name), xml: await fs.readFile(fileOf(name), 'utf8') }; },
    async validateModel(xml, name = 'model') { return verifyModel(xml, undefined, cleanName(name), { decisionsFolder: root }); },
    async saveModel(name, xml, confirm = false) {
      if (!allowWrites || !confirm) throw new Error('Writing needs MCP_ALLOW_WRITES=true and confirm=true');
      if (typeof xml !== 'string' || xml.length > 2000000) throw new Error('Invalid XML');
      const validation = await this.validateModel(xml, name);
      if (!validation.valid) return { saved: false, validation };
      const file = fileOf(name);
      const realRoot = await fs.realpath(root);
      if (path.dirname(file) !== realRoot) throw new Error('Invalid model path');
      try {
        const info = await fs.lstat(file);
        if (!info.isFile() || info.isSymbolicLink()) throw new Error('Unsafe target');
      } catch (error) { if (error.code !== 'ENOENT') throw error; }
      await fs.writeFile(file, xml);
      return { saved: true, name: cleanName(name), validation };
    }
  };
}

export async function clientBackend(env) {
  const { BPMNClient2 } = await import('bpmn-client');
  if (!env.API_KEY) throw new Error('API_KEY is required');
  const client = new BPMNClient2(env.HOST || 'localhost', Number(env.PORT || 3000), env.API_KEY, { adminApiKey: env.ADMIN_API_KEY });
  return {
    mode: 'client',
    listModels: () => client.model.list(),
    getModel: name => client.model.load(cleanName(name)),
    validateModel: (xml, name = 'model') => verifyModel(xml, undefined, cleanName(name)),
    listInstances: (query = {}) => client.data.findInstances(query),
    findItems: (query = {}) => client.data.findItems(query),
    async saveModel() { throw new Error('Remote writes are not enabled in this first release'); }
  };
}
