var npm = require('npm'),
    vow = require('vow'),
    vowNode = require('vow-node'),
    childProcess = require('child_process'),
    version = process.argv.slice(2)[0] || 'patch';

vowNode.invoke(childProcess.exec, 'git pull')
    .then(function() {
        return vowNode.invoke(npm.load);
    })
    .then(function(npm) {
        return vow.all([
            vowNode.invoke(npm.commands.runScript, ['build-lib']),
            vowNode.invoke(npm.commands.runScript, ['build-dist'])
        ]).then(function() {
            return vowNode.invoke(npm.commands.version, [version]);
        }).then(function() {
            return vowNode.invoke(childProcess.exec, 'git push --follow-tags');
        }).then(function() {
            return vowNode.invoke(npm.commands.publish);
        });
    })
    .done();
