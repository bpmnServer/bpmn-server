// Builds the model editor (modeler/src) into public/modeler: modeler.js and modeler.css, and the decision
// editor: decision.js and decision.css; the Report for other pages (an instance's): report.js and report.css.
//   node modeler/build.mjs            production build
//   node modeler/build.mjs --watch    rebuild on change, with source maps
//   node modeler/build.mjs --dev      one build, not minified, with source maps
import * as esbuild from 'esbuild';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const watch = process.argv.includes('--watch');
const dev = watch || process.argv.includes('--dev');

const options = {
    absWorkingDir: root,
    entryPoints: { modeler: 'modeler/src/index.js', decision: 'modeler/src/decision.js', report: 'modeler/src/report/view.js' },
    outdir: 'public/modeler',
    bundle: true,
    format: 'iife',
    target: 'es2020',
    minify: !dev,
    sourcemap: dev ? 'inline' : false,
    jsx: 'automatic',
    jsxImportSource: '@bpmn-io/properties-panel/preact',
    loader: { '.woff': 'file', '.woff2': 'file', '.ttf': 'file', '.eot': 'file', '.svg': 'file' },
    logLevel: 'info'
};

if (watch)
    await (await esbuild.context(options)).watch();
else
    await esbuild.build(options);
