var fs = require('fs');

var filesToCopy = {
    '../README.md': '../dist/README.md',
    '../package-npm.json': '../dist/package.json'
};

for (var inFile in filesToCopy) {
    var outFile = filesToCopy[inFile];
    fs.createReadStream(__dirname + '/' +  inFile)
        .pipe(fs.createWriteStream(__dirname + '/' + outFile));
}
