import * as fs from 'fs';

const sourcePath = './README.md';
const destinationPath = './docs/README.md';

// Read the content of the source file
fs.readFile(sourcePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Replace markdown links of the format '[text](./docs/xxx)' with '[text](xxx)'
  const updatedData = data.replace(/\]\(\.\/docs\/(.*?)\)/g, ']($1)');

  // Write the updated content to the destination file
  fs.writeFile(destinationPath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log(`File copied from ${sourcePath} to ${destinationPath} with internal links updated.`);
  });
});
