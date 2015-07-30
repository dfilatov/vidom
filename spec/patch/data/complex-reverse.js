var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    parentNode = createNode('div'),
    nodeA = createNode('a').key('a'),
    nodeB = createNode('a').key('b'),
    nodeC = createNode('a').key('c'),
    nodeD = createNode('a').key('d');

module.exports = {
    'name' : 'complex-reverse',
    'trees' : [
        parentNode.children([
            nodeA,
            nodeB,
            nodeC,
            nodeD
        ]),
        createNode('div').children([
            createNode('a').key('d'),
            createNode('a').key('c'),
            createNode('a').key('b'),
            createNode('a').key('a')
        ])
    ],
    'patch' : [
        { op : patchOps.moveChild, args : [parentNode, nodeA, nodeD, true] },
        { op : patchOps.moveChild, args : [parentNode, nodeB, nodeD, true] },
        { op : patchOps.moveChild, args : [parentNode, nodeC, nodeD, true] }
    ]
};
