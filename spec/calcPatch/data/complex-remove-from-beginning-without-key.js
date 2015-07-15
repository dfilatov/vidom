var createNode = require('../../../lib/createNode'),
    RemoveChildOp = require('../../../lib/client/patchOps/RemoveChild'),
    nodeA = createNode('a'),
    nodeB = createNode('a');

module.exports = {
    'name' : 'complex-remove-from-beginning-without-key',
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
