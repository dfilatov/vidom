import patchOps from '../../lib/client/patchOps';

describe('patch', () => {
    const origPatchOps = {};
    let opsLog;

    Object.keys(patchOps).forEach(op => {
        origPatchOps[op] = patchOps[op];
    });

    const data = [
        require('./data/updateText1'),
        require('./data/updateText2'),
        require('./data/updateText3'),
        require('./data/removeText1'),
        require('./data/removeText2'),
        require('./data/updateAttr1'),
        require('./data/updateAttr2'),
        require('./data/updateAttr3'),
        require('./data/updateAttr4'),
        require('./data/updateAttr5'),
        require('./data/updateAttr6'),
        require('./data/removeAttr1'),
        require('./data/removeAttr2'),
        require('./data/removeAttr3'),
        require('./data/removeAttr4'),
        require('./data/removeAttr5'),
        require('./data/replace1'),
        require('./data/replace2'),
        require('./data/replace3'),
        require('./data/replace4'),
        require('./data/appendChild1'),
        require('./data/appendChild2'),
        require('./data/removeChild1'),
        require('./data/insertChild1'),
        require('./data/insertChild2'),
        require('./data/moveChild1'),
        require('./data/removeChildren1'),
        require('./data/complex1'),
        require('./data/complex2'),
        require('./data/complex3'),
        require('./data/complex-insert-to-beginning-with-key'),
        require('./data/complex-insert-to-beginning-without-key'),
        require('./data/complex-insert-to-middle-with-key'),
        require('./data/complex-insert-to-middle-without-key'),
        require('./data/complex-insert-to-ending-with-key'),
        require('./data/complex-insert-to-ending-without-key'),
        require('./data/complex-remove-from-beginning-with-key'),
        require('./data/complex-remove-from-beginning-without-key'),
        require('./data/complex-remove-from-ending-with-key'),
        require('./data/complex-remove-from-ending-without-key'),
        require('./data/complex-reverse'),
        require('./data/complex-shuffle-with-inserts-removes')
    ];

    data.forEach(specData => {
        beforeEach(() => {
            opsLog = [];
            Object.keys(patchOps).forEach(op => {
                patchOps[op] = function() {
                    opsLog.push({ op : origPatchOps[op], args : Array.prototype.slice.call(arguments) });
                };
            });
        });

        afterEach(() => {
            Object.keys(patchOps).forEach(op => {
                patchOps[op] = origPatchOps[op];
            });
        });

        it('for ' + specData.name + ' should be right', () => {
            specData.trees[0].patch(specData.trees[1]);
            expect(opsLog).to.eql(specData.patch);
        });
    });
});
