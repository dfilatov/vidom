var createNode = require('../../../lib/createNode'),
    InsertChildOp = require('../../../lib/client/patchOps/InsertChild'),
    nodeA = createNode('a'),
    nodeB = createNode('a');

module.exports = {
    'name' : 'complex-insert-to-beginning-without-key',
    'trees' : [
        createNode('div').children([
            createNode('a').key('c'),
            createNode('a').key('d')
        ]),
        createNode('div').children([
            nodeA,
            nodeB,
            createNode('a').key('c'),
            createNode('a').key('d')
        ])
    ],
    'patch' : [
        new InsertChildOp(nodeA, 0),
        new InsertChildOp(nodeB, 1)
    ]
};
