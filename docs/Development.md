# Development

## Code

## Document

```sh
npm run docs:generate
npm run docs:dev
```

The `docs:generate` will generate API doc from TS code and JSDocs in the comments of TS files. And also copy README.md to the docs folder, so it can be recognized by docusaurus.

`docs:dev` start the doc site locally using docusaurus, you can modify its config at docusaurus.config.ts. It basically turn all markdown files in docs folder into our doc site.
