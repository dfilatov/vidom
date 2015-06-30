var createNode = require('../../../lib/createNode'),
    InsertChildOp = require('../../../lib/client/patchOps/InsertChild'),
    newNode = createNode('input').key('b');

module.exports = {
    'name' : 'insertChild1',
    'trees' : [
        createNode('div').children([
            createNode('input').key('a'),
            createNode('input').key('c')
        ]),
        createNode('div').children([
            createNode('input').key('a'),
            newNode,
            createNode('input').key('c')
        ])
    ],
    'patch' : [
        new InsertChildOp(newNode, 1)
    ]
};
