var fs = require('fs');

function replaceInFile(relativeFileName, actions) {
    var fileName = __dirname + relativeFileName;
    actions.forEach(function (action) {
        var pattern = action.pattern;
        var replacement = action.replacement

        console.log('reading ' + relativeFileName);
        var fileContents = fs.readFileSync(fileName, { encoding: 'UTF8' });
        var modifiedFileContents = fileContents.replace(pattern, replacement);

        console.log('writing ' + relativeFileName);
        fs.writeFileSync(fileName, modifiedFileContents, { encoding: 'UTF8' });
    });
}

replaceInFile('/../dist/browser/just-animate-systemjs.js', [
    {
        pattern: /\"src\//g,
        replacement: '"just-animate/'
    }
]);

replaceInFile('/../dist/browser/just-animate-systemjs.d.ts', [
    {
        pattern: /\"src\//g,
        replacement: '"just-animate/'
    }
]);

console.log('finished fixing namespaces')