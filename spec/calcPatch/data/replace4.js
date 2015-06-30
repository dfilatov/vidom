var createNode = require('../../../lib/createNode'),
    ReplaceOp = require('../../../lib/client/patchOps/Replace'),
    oldNode = createNode('div').ns('ns1'),
    newNode = createNode('div').ns('ns2');

module.exports = {
    'name' : 'replace4',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : [
        new ReplaceOp(oldNode, newNode)
    ]
};
