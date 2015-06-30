var createNode = require('../../../lib/createNode'),
    RemoveChildrenOp = require('../../../lib/client/patchOps/RemoveChildren'),
    oldNodes = [
        createNode('div'),
        createNode('div'),
        createNode('div')
    ];

module.exports = {
    'name' : 'removeChildren1',
    'trees' : [
        createNode('div').children(oldNodes),
        createNode('div')
    ],
    'patch' : [
        new RemoveChildrenOp(oldNodes)
    ]
};
