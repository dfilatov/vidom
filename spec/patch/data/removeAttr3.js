var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    node = createNode('input');

module.exports = {
    'name' : 'removeAttr3',
    'trees' : [
        node.attrs({ className : 'input' }),
        createNode('input').attrs({ className : null })
    ],
    'patch' : [
        { op : patchOps.removeAttr, args : [node, 'className'] }
    ]
};
