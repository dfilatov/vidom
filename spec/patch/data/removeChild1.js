var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    oldNode = createNode('div'),
    parentNode = createNode('div');

module.exports = {
    'name' : 'removeChild1',
    'trees' : [
        parentNode.children([
            createNode('div'),
            createNode('div'),
            oldNode
        ]),
        createNode('div').children([
            createNode('div'),
            createNode('div')
        ])
    ],
    'patch' : [
        { op : patchOps.removeChild, args : [parentNode, oldNode] }
    ]
};
