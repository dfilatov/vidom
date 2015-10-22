var vow = require('vow'),
    vowNode = require('vow-node'),
    childProcess = require('child_process'),
    fs = require('fs'),
    version = process.argv.slice(2)[0] || 'patch';

function execCommand(command) {
    return vowNode.invoke(childProcess.exec, command);
}

execCommand('git pull')
    .then(function() {
        return execCommand('npm i');
    })
    .then(function() {
        return vow.all([
            execCommand('npm run-script build-lib'),
            execCommand('npm run-script build-dist')
        ]);
    })
    .then(function() {
        return execCommand('npm version ' + version);
    })
    .then(function() {
        return execCommand('git push --follow-tags');
    })
    .then(function() {
        return execCommand('npm publish');
    })
    .then(function() {
        return vowNode.invoke(fs.readFile, 'package.json', 'utf8');
    })
    .then(function(content) {
        console.log('version ' + JSON.parse(content).version + ' has just been released');
    })
    .done();
