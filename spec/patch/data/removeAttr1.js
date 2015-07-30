var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    node = createNode('input');

module.exports = {
    'name' : 'removeAttr1',
    'trees' : [
        node.attrs({ value : 'text', className : 'input' }),
        createNode('input').attrs({ value : 'text' })
    ],
    'patch' : [
        { op : patchOps.removeAttr, args : [node, 'className'] }
    ]
};
