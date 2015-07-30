var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    nodeC = createNode('a'),
    nodeD = createNode('a'),
    parentNode = createNode('div');

module.exports = {
    'name' : 'complex-remove-from-ending-without-key',
    'trees' : [
        parentNode.children([
            createNode('a').key('a'),
            createNode('a').key('b'),
            nodeC,
            nodeD
        ]),
        createNode('div').children([
            createNode('a').key('a'),
            createNode('a').key('b')
        ])
    ],
    'patch' : [
        { op : patchOps.removeChild, args : [parentNode, nodeC] },
        { op : patchOps.removeChild, args : [parentNode, nodeD] }
    ]
};
