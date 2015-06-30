var createNode = require('../../../lib/createNode'),
    RemoveChildOp = require('../../../lib/client/patchOps/RemoveChild'),
    UpdateChildrenOp = require('../../../lib/client/patchOps/UpdateChildren'),
    UpdateTextOp = require('../../../lib/client/patchOps/UpdateText'),
    node1 = createNode('a').key('d');

module.exports = {
    'name' : 'complex2',
    'trees' : [
        createNode('div').children([
            createNode('a').key('c').children('text'),
            createNode('a').key('a'),
            node1
        ]),
        createNode('div').children([
            createNode('a').key('b').children('new text'),
            createNode('a').key('a')
        ])
    ],
    'patch' : [
        new RemoveChildOp(node1, 2),
        new UpdateChildrenOp([
            {
                idx : 0,
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
