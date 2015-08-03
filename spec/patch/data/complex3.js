var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    nodeA = createNode('a').key('a'),
    nodeB = createNode('a').key('b'),
    nodeC = createNode('a').key('c'),
    nodeD = createNode('a').key('d'),
    nodeE = createNode('a').key('e'),
    parentNode = createNode('div');

module.exports = {
    'name' : 'complex3',
    'trees' : [
        parentNode.children([
            nodeD,
            createNode('a').key('b')
        ]),
        createNode('div').children([
            nodeA,
            nodeB,
            nodeC,
            createNode('a').key('d'),
            nodeE
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [parentNode, nodeA, nodeD] },
        { op : patchOps.moveChild, args : [parentNode, nodeB, nodeD, false] },
        { op : patchOps.insertChild, args : [parentNode, nodeC, nodeD] },
        { op : patchOps.appendChild, args : [parentNode, nodeE] }
    ]
};
