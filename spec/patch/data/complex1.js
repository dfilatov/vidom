var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    nodeA = createNode('a').key('a'),
    nodeB = createNode('a').key('b'),
    nodeC = createNode('a').key('c'),
    nodeD = createNode('a').key('d'),
    parentNode = createNode('div');

module.exports = {
    'name' : 'complex1',
    'trees' : [
        parentNode.children([
            nodeC,
            nodeA.children(createNode('div')),
            nodeD
        ]),
        createNode('div').children([
            nodeB,
            createNode('a').key('a').children('new text')
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [parentNode, nodeB, nodeC] },
        { op : patchOps.moveChild, args : [parentNode, nodeA, nodeC, false] },
        { op : patchOps.removeChildren, args : [nodeA] },
        { op : patchOps.updateText, args : [nodeA, 'new text'] },
        { op : patchOps.removeChild, args : [parentNode, nodeC] },
        { op : patchOps.removeChild, args : [parentNode, nodeD] }
    ]
};
