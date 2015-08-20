var vow = require('vow'),
    vowNode = require('vow-node'),
    childProcess = require('child_process'),
    version = process.argv.slice(2)[0] || 'patch';

function execCommand(command) {
    return vowNode.invoke(childProcess.exec, command);
}

execCommand('git pull')
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
    .done();
