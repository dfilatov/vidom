var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    nodeA = createNode('a').key('a'),
    nodeB = createNode('a').key('b'),
    nodeC = createNode('a').key('c'),
    nodeD = createNode('a').key('d'),
    textNode = createNode(),
    parentNode = createNode('div');

module.exports = {
    'name' : 'complex1',
    'trees' : [
        parentNode.children([
            nodeC,
            nodeA.children(textNode.text('text')),
            nodeD
        ]),
        createNode('div').children([
            nodeB,
            createNode('a').key('a').children('new text')
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [parentNode, nodeB, nodeC] },
        { op : patchOps.updateText, args : [textNode, 'new text'] },
        { op : patchOps.moveChild, args : [parentNode, nodeA, nodeC] },
        { op : patchOps.removeChild, args : [parentNode, nodeC] },
        { op : patchOps.removeChild, args : [parentNode, nodeD] }
    ]
};
