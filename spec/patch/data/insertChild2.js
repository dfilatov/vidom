var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    newNode = createNode('input').key('a'),
    beforeNode = createNode('input'),
    parentNode = createNode('div');

module.exports = {
    'name' : 'insertChild2',
    'trees' : [
        parentNode.children([
            createNode('span'),
            beforeNode
        ]),
        createNode('div').children([
            createNode('span'),
            newNode,
            createNode('input')
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [parentNode, newNode, beforeNode] }
    ]
};
