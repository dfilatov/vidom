var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    node = createNode('input').attrs({ value : 'text' });

module.exports = {
    'name' : 'updateAttr1',
    'trees' : [
        node,
        createNode('input').attrs({ value : 'new text' })
    ],
    'patch' : [
        { op : patchOps.updateAttr, args : [node, 'value', 'new text'] }
    ]
};
