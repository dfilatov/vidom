var calcPatch = require('../../lib/calcPatch'),
    data = [
        require('./data/appendChild1'),
        require('./data/appendChild2'),
        require('./data/complex1'),
        require('./data/complex2'),
        require('./data/complex3'),
        require('./data/complex4'),
        require('./data/insertChild1'),
        require('./data/insertChild2'),
        require('./data/moveChild1'),
        require('./data/moveChild2'),
        require('./data/removeAttr1'),
        require('./data/removeAttr2'),
        require('./data/removeAttr3'),
        require('./data/removeAttr4'),
        require('./data/removeChild1'),
        require('./data/removeChildren1'),
        require('./data/replace1'),
        require('./data/replace2'),
        require('./data/replace3'),
        require('./data/updateAttr1'),
        require('./data/updateAttr2'),
        require('./data/updateAttr3'),
        require('./data/updateAttr4'),
        require('./data/updateText1'),
        require('./data/updateText2')
    ];

describe('calcPatch', function() {
    data.forEach(function(specData) {
        it('for ' + specData.name + ' should be right', function() {
            expect(calcPatch(specData.trees[0], specData.trees[1])).to.eql(specData.patch);
        });
    });
});
