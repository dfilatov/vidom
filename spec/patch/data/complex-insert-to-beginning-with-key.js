var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    nodeA = createNode('a').key('a'),
    nodeB = createNode('a').key('b'),
    nodeC = createNode('a').key('c'),
    parentNode = createNode('div');

module.exports = {
    'name' : 'complex-insert-to-beginning-with-key',
    'trees' : [
        parentNode.children([
            createNode('a').key('c'),
            createNode('a').key('d')
        ]),
        createNode('div').children([
            nodeA,
            nodeB,
            nodeC,
            createNode('a').key('d')
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [parentNode, nodeA, nodeC] },
        { op : patchOps.insertChild, args : [parentNode, nodeB, nodeC] }
    ]
};
