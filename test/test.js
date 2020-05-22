console.log('--------- start -----');


var parseString = require('xml2js').parseString;
var stripNS = require('xml2js').processors.stripPrefix;
var xpath = require("xml2js-xpath");

/*
parseString(xml_str, { tagNameProcessors: [stripNS] }, function (err, result) {

});

var xml = "<root>Hello xml2js!</root>"
parseString(xml, function (err, result) {
    console.dir(result);
});

*/

var fs = require('fs'),
xml2js = require('xml2js');

var parser = new xml2js.Parser();

test();

async function test() {
    let filePath = __dirname + '/../../processes/simple.svg';
    let data = fs.readFileSync(filePath);
    console.log("reading .." + filePath);

    let result= await parser.parseString(data);

    let json = await parser.parseString(data, { tagNameProcessors: [stripNS] });

    write(json, 'json.txt');
    var matches = xpath.find(json, "g[@data-element-id");
//    console.log('matches');
    write(matches, 'maches.txt');
//    console.log(matches);
    // $g = $svg -> xpath("//__nons:g[@data-element-id='$id']");



}

function write(text, file) {

    fs.writeFile(file, text, function (err) {
        if (err) throw err;
        console.log('Saved BPMN');
    });
}
/*
fs.readFile(filePath, function (err, data) {
    console.log(data);
    parser.parseString(data, function (err, result) {
        console.log(err);
        console.log("result");
        console.dir(result);
        console.log('Done');
    });
})*/