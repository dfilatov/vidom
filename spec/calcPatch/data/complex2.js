var createNode = require('../../../lib/createNode'),
    InsertChildOp = require('../../../lib/client/patchOps/InsertChild'),
    RemoveChildOp = require('../../../lib/client/patchOps/RemoveChild'),
    UpdateChildrenOp = require('../../../lib/client/patchOps/UpdateChildren'),
    UpdateTextOp = require('../../../lib/client/patchOps/UpdateText'),
    nodeC = createNode('a').key('c'),
    nodeD = createNode('a').key('d'),
    nodeB = createNode('a').key('b');

module.exports = {
    'name' : 'complex2',
    'trees' : [
        createNode('div').children([
            nodeC,
            createNode('a').key('a').children('text'),
            nodeD
        ]),
        createNode('div').children([
            nodeB,
            createNode('a').key('a').children('new text')
        ])
    ],
    'patch' : [
        new RemoveChildOp(nodeD, 2),
        new UpdateChildrenOp([
            {
                idx : 1,
                patch : [
                    new UpdateChildrenOp([
                        {
                            idx : 0,
                            patch : [new UpdateTextOp('new text')]
                        }
                    ])
                ]
            }
        ])
    ]
};
