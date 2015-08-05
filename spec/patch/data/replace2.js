var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
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
        { op : patchOps.replace, args : [null, oldNode, newNode] }
    ]
};
