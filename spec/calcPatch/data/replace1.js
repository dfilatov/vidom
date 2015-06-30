var createNode = require('../../../lib/createNode'),
    ReplaceOp = require('../../../lib/client/patchOps/Replace'),
    oldNode = createNode('div'),
    newNode = createNode('span');

module.exports = {
    'name' : 'replace1',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : [
        new ReplaceOp(oldNode, newNode)
    ]
};
