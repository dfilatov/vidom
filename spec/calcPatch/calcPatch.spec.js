var glob = require('glob'),
    path = require('path'),
    fs = require('fs'),
    calcPatch = require('../../lib/calcPatch');

describe('calcPatch', function() {
    glob.sync(path.join(__dirname, 'data/*.json')).forEach(function(treesFile) {
        it(path.basename(treesFile, '.json'), function() {
            var data = JSON.parse(fs.readFileSync(treesFile, 'utf-8'));
            expect(calcPatch(data.trees[0], data.trees[1])).toEqual(data.patch);
        });
    });
});
