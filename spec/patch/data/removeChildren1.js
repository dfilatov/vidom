var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    parentNode = createNode('div');

module.exports = {
    'name' : 'removeChildren1',
    'trees' : [
        parentNode.children([createNode('div'), createNode('div')]),
        createNode('div')
    ],
    'patch' : [
        { op : patchOps.removeChildren, args : [parentNode] }
    ]
};
