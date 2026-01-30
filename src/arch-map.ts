// scripts/arch-map.ts
import { Project, SyntaxKind } from "ts-morph";
import * as fs from "fs";

const project = new Project({ tsConfigFilePath: "tsconfig.json" });
const files = project.getSourceFiles("src/**/*.ts");

const modules = files.map(f => {
  const exports = f.getExportedDeclarations();
  const publicApi = [...exports.keys()];
  const imports = f.getImportDeclarations().map(d => d.getModuleSpecifierValue());
  const hasTest = project.getSourceFile(f.getFilePath().replace(/\.ts$/, ".spec.ts")) !== undefined
               || project.getSourceFile(f.getFilePath().replace(/\.ts$/, ".test.ts")) !== undefined;

  return {
    file: f.getFilePath(),
    imports,
    publicApi,
    hasTest,
    lines: f.getFullText().split("\n").length
  };
});

fs.writeFileSync("docs/arch-map.json", JSON.stringify({ generatedAt: new Date().toISOString(), modules }, null, 2));
console.log("Wrote docs/arch-map.json");
