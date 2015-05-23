var glob = require('glob'),
    path = require('path'),
    fs = require('fs'),
    calcPatch = require('../../lib/calcPatch');

describe('calcPatch', function() {
    glob.sync(path.join(__dirname, 'data/*.trees.json')).forEach(function(treesFile) {
        it(path.basename(treesFile, '.json'), function() {
            var trees = JSON.parse(fs.readFileSync(treesFile, 'utf-8')),
                ops = JSON.parse(fs.readFileSync(path.join(
                    path.dirname(treesFile),
                    path.basename(treesFile, '.trees.json') + '.patch.json')));

            expect(calcPatch(trees[0], trees[1])).toEqual(ops);
        });
    });
});
