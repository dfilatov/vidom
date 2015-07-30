var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    parentNode = createNode('div'),
    nodeC = createNode('a'),
    nodeD = createNode('a'),
    nodeE = createNode('a').key('e');

module.exports = {
    'name' : 'complex-insert-to-middle-without-key',
    'trees' : [
        parentNode.children([
            createNode('a').key('a'),
            createNode('a').key('b'),
            createNode('a').key('e')
        ]),
        createNode('div').children([
            createNode('a').key('a'),
            createNode('a').key('b'),
            nodeC,
            nodeD,
            nodeE
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [parentNode, nodeC, nodeE] },
        { op : patchOps.insertChild, args : [parentNode, nodeD, nodeE] }
    ]
};
