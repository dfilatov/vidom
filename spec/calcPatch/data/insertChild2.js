var createNode = require('../../../lib/createNode'),
    InsertChildOp = require('../../../lib/client/patchOps/InsertChild'),
    newNode = createNode('input').key('a');

module.exports = {
    'name' : 'insertChild2',
    'trees' : [
        createNode('div').children([
            createNode('span'),
            createNode('input')
        ]),
        createNode('div').children([
            createNode('span'),
            newNode,
            createNode('input')
        ])
    ],
    'patch' : [
        new InsertChildOp(newNode, 1)
    ]
};
