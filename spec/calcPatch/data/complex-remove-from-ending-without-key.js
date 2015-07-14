var createNode = require('../../../lib/createNode'),
    RemoveChildOp = require('../../../lib/client/patchOps/RemoveChild'),
    nodeC = createNode('a'),
    nodeD = createNode('a');

module.exports = {
    'name' : 'complex-remove-from-ending-without-key',
    'trees' : [
        createNode('div').children([
            createNode('a').key('a'),
            createNode('a').key('b'),
            nodeC,
            nodeD
        ]),
        createNode('div').children([
            createNode('a').key('a'),
            createNode('a').key('b')
        ])
    ],
    'patch' : [
        new RemoveChildOp(nodeC, 2),
        new RemoveChildOp(nodeD, 2)
    ]
};
