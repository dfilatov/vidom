var createNode = require('../../../lib/createNode'),
    InsertChildOp = require('../../../lib/client/patchOps/InsertChild'),
    AppendChildOp = require('../../../lib/client/patchOps/AppendChild'),
    MoveChildOp = require('../../../lib/client/patchOps/MoveChild'),
    node1 = createNode('a').key('a'),
    node2 = createNode('a').key('c'),
    node3 = createNode('a').key('e');

module.exports = {
    'name' : 'complex4',
    'trees' : [
        createNode('div').children([
            createNode('a').key('d'),
            createNode('a').key('b')
        ]),
        createNode('div').children([
            node1,
            createNode('a').key('b'),
            node2,
            createNode('a').key('d'),
            node3
        ])
    ],
    'patch' : [
        new InsertChildOp(node1, 0),
        new MoveChildOp(2, 1),
        new InsertChildOp(node2, 2),
        new AppendChildOp(node3)
    ]
};
