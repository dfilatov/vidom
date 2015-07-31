var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    node = createNode('input');

module.exports = {
    'name' : 'removeAttr2',
    'trees' : [
        node.attrs({ value : 'text', className : 'input' }),
        createNode('input')
    ],
    'patch' : [
        { op : patchOps.removeAttr, args : [node, 'value'] },
        { op : patchOps.removeAttr, args : [node, 'className'] }
    ]
};
