var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    node = createNode('input').attrs({ value : 'text' });

module.exports = {
    'name' : 'updateAttr3',
    'trees' : [
        createNode('div').children([
            createNode('input').attrs({ value : 'text' }),
            createNode('input').attrs({ value : 'text' })
        ]),
        createNode('div').children([
            createNode('input').attrs({ value : 'text' }),
            createNode('input').attrs({ value : 'new text' })
        ])
    ],
    'patch' : [
        { op : patchOps.updateAttr, args : [node, 'value', 'new text'] }
    ]
};
