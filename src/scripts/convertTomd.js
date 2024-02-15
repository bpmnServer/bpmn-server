const fs = require('fs');
const readline = require('readline');

var myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);
if (myArgs.length<2) {
	console.log("Syntax inputFile outputFile");
	return;
}
const inputFile =myArgs[0];
const outputFile =myArgs[1];
console.log('generating '+inputFile +' into '+outputFile);


const readInterface = readline.createInterface({
    input: fs.createReadStream(inputFile),
    output: process.stdout,
    console: false
});

console.log('-------------------------------------------------------');

const lines=[];
readInterface.on('line', function(line) {
    
	
	if (line.startsWith('///'))
		line=line.substring(3);
	 
    console.log('=>'+line);
	lines.push(line);
	
});
readInterface.on('close', function () {

console.log("Writing" + lines.length);
var id = fs.openSync(outputFile, 'w', 666);

	lines.forEach(line=>{
    fs.writeSync(id, line + "\n", null, 'utf8');
		
	});

fs.closeSync(id );
console.log("done");
console.log(' end -------------------------------------------------------');
	
});

