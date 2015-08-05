var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    oldNode = createNode('div').key('a'),
    newNode = createNode('span').key('a');

module.exports = {
    'name' : 'replace3',
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
