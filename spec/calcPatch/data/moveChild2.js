var createNode = require('../../../lib/createNode'),
    MoveChildOp = require('../../../lib/client/patchOps/MoveChild');

module.exports = {
    'name' : 'moveChild2',
    'trees' : [
        createNode('div').children([
            createNode('a').key('a'),
            createNode('a').key('b'),
            createNode('a').key('c'),
            createNode('a').key('d')
        ]),
        createNode('div').children([
            createNode('a').key('d'),
            createNode('a').key('c'),
            createNode('a').key('b'),
            createNode('a').key('a')
        ])
    ],
    'patch' : [
        new MoveChildOp(3, 0),
        new MoveChildOp(3, 1),
        new MoveChildOp(3, 2)
    ]
};
