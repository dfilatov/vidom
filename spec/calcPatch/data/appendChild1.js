var createNode = require('../../../lib/createNode'),
    AppendChildOp = require('../../../lib/client/patchOps/AppendChild'),
    node1 = createNode('div'),
    node2 = createNode('span');

module.exports = {
    'name' : 'appendChild1',
    'trees' : [
        createNode('div').children(createNode('div')),
        createNode('div').children([
            createNode('div'),
            node1,
            node2
        ])
    ],
    'patch' : [
        new AppendChildOp(node1),
        new AppendChildOp(node2)
    ]
};
