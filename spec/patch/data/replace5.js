var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    oldNode = createNode().text('node'),
    newNode = createNode('div');

module.exports = {
    'name' : 'replace5',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : [
        { op : patchOps.replace, args : [null, oldNode, newNode] }
    ]
};
