var createNode = require('../../../lib/createNode'),
    AppendChildOp = require('../../../lib/client/patchOps/AppendChild'),
    nodeC = createNode('a'),
    nodeD = createNode('a');

module.exports = {
    'name' : 'complex-insert-to-ending-without-key',
    'trees' : [
        createNode('div').children([
            createNode('a').key('a'),
            createNode('a').key('b')
        ]),
        createNode('div').children([
            createNode('a').key('a'),
            createNode('a').key('b'),
            nodeC,
            nodeD
        ])
    ],
    'patch' : [
        new AppendChildOp(nodeC),
        new AppendChildOp(nodeD)
    ]
};
