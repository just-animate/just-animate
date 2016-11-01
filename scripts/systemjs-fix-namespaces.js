var fs = require('fs');

function replaceInFile(relativeFileName, actions) {
    var fileName = __dirname + relativeFileName;

    console.log('reading ' + relativeFileName);    
    var fileContents = fs.readFileSync(fileName, { encoding: 'UTF8' });

    for (var i = 0, len = actions.length; i < len; i++) {
        console.log('performing action ' + i + ' on ' + relativeFileName);
        var action = actions[i];
        fileContents = fileContents.replace(action.pattern, action.replacement);
    }

    console.log('writing ' + relativeFileName);
    fs.writeFileSync(fileName, fileContents, { encoding: 'UTF8' });
}

// replace "src/ with "just-animate/, replace just-animate/index with just-animate
replaceInFile('/../dist/just-animate-systemjs.js', [
    {
        pattern: /\"src\//g,
        replacement: '"just-animate/'
    },
    {
        pattern: /\"just-animate\/index\""/g,
        replace: '"just-animate"'
    }
]);

console.log('finished fixing namespaces')