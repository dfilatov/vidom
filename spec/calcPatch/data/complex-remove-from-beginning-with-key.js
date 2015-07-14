var createNode = require('../../../lib/createNode'),
    RemoveChildOp = require('../../../lib/client/patchOps/RemoveChild'),
    nodeA = createNode('a').key('a'),
    nodeB = createNode('a').key('b');

module.exports = {
    'name' : 'complex-remove-from-beginning-with-key',
    'trees' : [
        createNode('div').children([
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
        new RemoveChildOp(nodeA, 0),
        new RemoveChildOp(nodeB, 0)
    ]
};
