var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    nodeC = createNode('a'),
    nodeD = createNode('a'),
    parentNode = createNode('div');

module.exports = {
    'name' : 'complex-insert-to-ending-without-key',
    'trees' : [
        parentNode.children([
            createNode('a').key('a'),
            createNode('a').key('b')
        ]),
        createNode('div').children([
            createNode('a').key('a'),
            createNode('a').key('b'),
            nodeC,
            nodeD
        ])
    ],
    'patch' : [
        { op : patchOps.appendChild, args : [parentNode, nodeC] },
        { op : patchOps.appendChild, args : [parentNode, nodeD] }
    ]
};
