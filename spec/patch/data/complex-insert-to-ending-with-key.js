var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    nodeC = createNode('a').key('c'),
    nodeD = createNode('a').key('d'),
    parentNode = createNode('div');

module.exports = {
    'name' : 'complex-insert-to-ending-with-key',
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
