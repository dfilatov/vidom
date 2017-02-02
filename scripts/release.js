var vow = require('vow'),
    vowNode = require('vow-node'),
    childProcess = require('child_process'),
    fs = require('fs'),
    exec = vowNode.promisify(childProcess.exec),
    readFile = vowNode.promisify(fs.readFile),
    writeFile = vowNode.promisify(fs.writeFile);
    version = process.argv.slice(2)[0] || 'patch';

exec('git pull')
    .then(() => exec('npm i'))
    .then(() => exec('npm run build'))
    .then(() => exec('npm version ' + version))
    .then(() => vow.all([
        readFile('package.json', 'utf8'),
        readFile(__dirname + '/distHeaderTmpl.txt', 'utf8'),
        readFile('dist/vidom.js'),
        readFile('dist/vidom.min.js')
    ]))
    .spread((packageContent, distHeaderTmpl, distContent, distMinContent) => {
        version = JSON.parse(packageContent).version;

        var distHeader = distHeaderTmpl.replace('${VERSION}', version);

        return vow.all([
            writeFile('dist/vidom.js', distHeader + distContent),
            writeFile('dist/vidom.min.js', distHeader + distMinContent)
        ]);
    })
    .then(() => exec('git push --follow-tags'))
    .then(() => exec('npm publish'))
    .then(() => {
        console.log(`version ${version} has just been released`);
    })
    .done();
