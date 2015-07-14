var createNode = require('../../../lib/createNode'),
    ReplaceOp = require('../../../lib/client/patchOps/Replace'),
    UpdateChildrenOp = require('../../../lib/client/patchOps/UpdateChildren'),
    oldNode = createNode('div'),
    newNode = createNode('span');

module.exports = {
    'name' : 'replace2',
    'trees' : [
        createNode('div').children([
            createNode('div'),
            oldNode
        ]),
        createNode('div').children([
            createNode('div'),
            newNode
        ])
    ],
    'patch' : [
        new UpdateChildrenOp([
            {
                idx : 1,
                patch : [new ReplaceOp(oldNode, newNode)]
            }
        ])
    ]
};
