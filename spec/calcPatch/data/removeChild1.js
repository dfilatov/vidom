var createNode = require('../../../lib/createNode'),
    RemoveChildOp = require('../../../lib/client/patchOps/RemoveChild'),
    oldNode = createNode('div');

module.exports = {
    'name' : 'removeChild1',
    'trees' : [
        createNode('div').children([
            createNode('div'),
            createNode('div'),
            oldNode
        ]),
        createNode('div').children([
            createNode('div'),
            createNode('div')
        ])
    ],
    'patch' : [
        new RemoveChildOp(oldNode, 2)
    ]
};
