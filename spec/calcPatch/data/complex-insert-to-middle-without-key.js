var createNode = require('../../../lib/createNode'),
    InsertChildOp = require('../../../lib/client/patchOps/InsertChild'),
    nodeC = createNode('a'),
    nodeD = createNode('a');

module.exports = {
    'name' : 'complex-insert-to-middle-with-key',
    'trees' : [
        createNode('div').children([
            createNode('a').key('a'),
            createNode('a').key('b'),
            createNode('a').key('e')
        ]),
        createNode('div').children([
            createNode('a').key('a'),
            createNode('a').key('b'),
            nodeC,
            nodeD,
            createNode('a').key('e')
        ])
    ],
    'patch' : [
        new InsertChildOp(nodeC, 2),
        new InsertChildOp(nodeD, 3)
    ]
};
