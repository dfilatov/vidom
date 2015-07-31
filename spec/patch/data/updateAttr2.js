var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    node = createNode('input').attrs({ value : 'text' });

module.exports = {
    'name' : 'updateAttr2',
    'trees' : [
        node,
        createNode('input').attrs({ value : 'text', disabled : true })
    ],
    'patch' : [
        { op : patchOps.updateAttr, args : [node, 'disabled', true] }
    ]
};
