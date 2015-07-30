var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    newNode = createNode('input').key('b'),
    nodeC = createNode('input').key('c'),
    parentNode = createNode('div');

module.exports = {
    'name' : 'insertChild1',
    'trees' : [
        parentNode.children([
            createNode('input').key('a'),
            nodeC
        ]),
        createNode('div').children([
            createNode('input').key('a'),
            newNode,
            createNode('input').key('c')
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [parentNode, newNode, nodeC] }
    ]
};
