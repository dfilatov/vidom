var createNode = require('../../../lib/createNode'),
    ReplaceOp = require('../../../lib/client/patchOps/Replace'),
    UpdateChildrenOp = require('../../../lib/client/patchOps/UpdateChildren'),
    oldNode = createNode('div').key('a'),
    newNode = createNode('span').key('a');

module.exports = {
    'name' : 'replace3',
    'trees' : [
        createNode('div').children([
            oldNode,
            createNode('div')
        ]),
        createNode('div').children([
            newNode,
            createNode('div')
        ])
    ],
    'patch' : [
        new UpdateChildrenOp([
            {
                idx : 0,
                patch : [new ReplaceOp(oldNode, newNode)]
            }
        ])
    ]
};
