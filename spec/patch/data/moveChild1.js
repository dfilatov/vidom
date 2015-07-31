var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    parentNode = createNode('div'),
    nodeA = createNode('input').key('a'),
    nodeB = createNode('input').key('b');

module.exports = {
    'name' : 'moveChild1',
    'trees' : [
        parentNode.children([
            nodeA,
            nodeB
        ]),
        createNode('div').children([
            createNode('input').key('b'),
            createNode('input').key('a')
        ])
    ],
    'patch' : [
        { op : patchOps.moveChild, args : [parentNode, nodeA, nodeB, true] }
    ]
};
