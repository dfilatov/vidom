var createNode = require('../../../lib/createNode'),
    InsertChildOp = require('../../../lib/client/patchOps/InsertChild'),
    MoveChildOp = require('../../../lib/client/patchOps/MoveChild'),
    RemoveChildOp = require('../../../lib/client/patchOps/RemoveChild'),
    nodeD = createNode('a').key('d'),
    nodeE = createNode('a').key('e'),
    nodeF = createNode('a').key('f'),
    nodeG = createNode('a').key('g');

module.exports = {
    'name' : 'complex-shuffle-with-inserts-removes',
    'trees' : [
        createNode('div').children([
            createNode('a').key('a'),
            createNode('a').key('b'),
            createNode('a').key('c'),
            nodeD
        ]),
        createNode('div').children([
            nodeE,
            createNode('a').key('b'),
            nodeF,
            nodeG,
            createNode('a').key('c'),
            createNode('a').key('a')
        ])
    ],
    'patch' : [
        new InsertChildOp(nodeE, 0),
        new MoveChildOp(2, 1),
        new InsertChildOp(nodeF, 2),
        new InsertChildOp(nodeG, 3),
        new MoveChildOp(5, 4),
        new RemoveChildOp(nodeD, 6)
    ]
};
