var createNode = require('../../../lib/createNode'),
    RemoveChildOp = require('../../../lib/client/patchOps/RemoveChild'),
    nodeC = createNode('a').key('c'),
    nodeD = createNode('a').key('d');

module.exports = {
    'name' : 'complex-remove-from-ending-with-key',
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
