var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    oldNode = createNode('div'),
    newNode = createNode('span');

module.exports = {
    'name' : 'replace1',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : [
        { op : patchOps.replace, args : [oldNode, newNode] }
    ]
};
