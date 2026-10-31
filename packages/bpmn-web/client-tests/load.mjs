// Loads a browser client script (public/javascripts/*.js) into a vm sandbox with
// minimal browser/jQuery/gsap stubs, so its PURE functions can be unit-tested in node
// without a DOM. Only pure functions are exercised by the tests; DOM/animation helpers
// are present but not called.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const JS_DIR = fileURLToPath(new URL('../public/javascripts/', import.meta.url));

function makeChainable() {
  const chain = new Proxy(function () {}, {
    get(_t, prop) {
      if (prop === 'get') return () => null;
      if (prop === 'length') return 0;
      if (prop === 'each') return () => chain;
      return () => chain;            // every method returns the chain
    },
    apply() { return chain; },
  });
  return chain;
}

// `capture` lists top-level const/let identifiers to expose on the sandbox
// (vm only auto-exposes `var` and function declarations as context globals).
export function loadClientScript(name, extraGlobals = {}, capture = []) {
  let code = readFileSync(JS_DIR + name, 'utf8');
  for (const id of capture) {
    code += `\n;try{ globalThis[${JSON.stringify(id)}] = ${id}; }catch(e){}`;
  }

  const jq = function () { return makeChainable(); };
  jq.isArray = Array.isArray;
  jq.each = (coll, cb) => {
    if (Array.isArray(coll)) coll.forEach((v, i) => cb(i, v));
    else for (const k in coll) cb(k, coll[k]);
  };

  const gsapStub = {
    timeline: () => ({ addPause() {}, play() {}, to() {}, call() {}, add() {} }),
    registerPlugin() {}, to() { return {}; }, set() {},
  };
  const documentStub = {
    addEventListener() {}, querySelector() { return null; },
    querySelectorAll() { return []; }, getElementById() { return null; },
    createElementNS() { return { setAttributeNS() {}, appendChild() {}, classList: { add() {} } }; },
    createTextNode() { return {}; },
  };

  const sandbox = {
    console, JSON, Array, Object, Math, Date, String, Number, Boolean,
    document: documentStub, window: {}, gsap: gsapStub, MotionPathPlugin: {},
    $: jq, jQuery: jq,
    ...extraGlobals,
  };
  sandbox.global = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: name });
  return sandbox;
}
