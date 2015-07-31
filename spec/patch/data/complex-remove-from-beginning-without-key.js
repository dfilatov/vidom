var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    parentNode = createNode('div'),
    nodeA = createNode('a'),
    nodeB = createNode('a');

module.exports = {
    'name' : 'complex-remove-from-beginning-without-key',
    'trees' : [
        parentNode.children([
            nodeA,
            nodeB,
            createNode('a').key('c'),
            createNode('a').key('d')
        ]),
        createNode('div').children([
            createNode('a').key('c'),
            createNode('a').key('d')
        ])
    ],
    'patch' : [
        { op : patchOps.removeChild, args : [parentNode, nodeA] },
        { op : patchOps.removeChild, args : [parentNode, nodeB] }
    ]
};
