var createNode = require('../../../lib/createNode'),
    InsertChildOp = require('../../../lib/client/patchOps/InsertChild'),
    AppendChildOp = require('../../../lib/client/patchOps/AppendChild'),
    node1 = createNode('a').key('b'),
    node2 = createNode('a').key('d'),
    node3 = createNode('a').key('f');

module.exports = {
    'name' : 'complex3',
    'trees' : [
        createNode('div').children([
            createNode('a').key('a'),
            createNode('a').key('c'),
            createNode('a').key('e')
        ]),
        createNode('div').children([
            createNode('a').key('a'),
            node1,
            createNode('a').key('c'),
            node2,
            createNode('a').key('e'),
            node3
        ])
    ],
    'patch' : [
        new InsertChildOp(node1, 1),
        new InsertChildOp(node2, 3),
        new AppendChildOp(node3)
    ]
};
