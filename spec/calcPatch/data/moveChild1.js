var createNode = require('../../../lib/createNode'),
    MoveChildOp = require('../../../lib/client/patchOps/MoveChild');

module.exports = {
    'name' : 'moveChild1',
    'trees' : [
        createNode('div').children([
            createNode('input').key('a'),
            createNode('input').key('b')
        ]),
        createNode('div').children([
            createNode('input').key('b'),
            createNode('input').key('a')
        ])
    ],
    'patch' : [
        new MoveChildOp(1, 0)
    ]
};
