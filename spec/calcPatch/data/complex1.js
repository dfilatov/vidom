var createNode = require('../../../lib/createNode'),
    MoveChildOp = require('../../../lib/client/patchOps/MoveChild'),
    InsertChildOp = require('../../../lib/client/patchOps/InsertChild'),
    RemoveChildOp = require('../../../lib/client/patchOps/RemoveChild'),
    UpdateChildrenOp = require('../../../lib/client/patchOps/UpdateChildren'),
    UpdateTextOp = require('../../../lib/client/patchOps/UpdateText'),
    UpdateAttrOp = require('../../../lib/client/patchOps/UpdateAttr'),
    RemoveAttrOp = require('../../../lib/client/patchOps/RemoveAttr'),
    ReplaceOp = require('../../../lib/client/patchOps/Replace'),
    AppendChildOp = require('../../../lib/client/patchOps/AppendChild'),
    node1 = createNode('div').attrs({ id : 'id2' }),
    node2 = createNode('div').key('c'),
    node3 = createNode('div'),
    node4 = createNode('span'),
    node5 = createNode('a').key('a').attrs({ 'href' : 'http://ya.ru' }),
    node6 = createNode('span').key('a').children('new text'),
    node7 = createNode('label').attrs({ 'for' : 'text' }),
    node8 = createNode('label').attrs({ 'for' : 'text' }),
    node9 = createNode('div');

module.exports = {
    'name' : 'complex1',
    'trees' : [
        createNode('div').children([
            createNode('input').key('a').attrs({ value : 'text', disabled : true }),
            node7,
            createNode('div').key('b').children([
                createNode('span').children('good'),
                createNode('div').children([node4, node5])
            ]),
            createNode('div').key('c'),
            node9
        ]),
        createNode('div').children([
            createNode('input').key('a').attrs({ value : 'text2' }),
            createNode('div').key('b').children([
                createNode('span').attrs({ id : 'id1' }).children('bad'),
                createNode('div').children(node6)
            ]),
            node8,
            node1
        ])
    ],
    'patch' : [
        new RemoveChildOp(node7, 1),
        new RemoveChildOp(node2, 2),
        new AppendChildOp(node1),
        new UpdateChildrenOp([
            {
                idx : 0,
                patch : [
                    new UpdateAttrOp('value', 'text2'),
                    new RemoveAttrOp('disabled')
                ]
            },
            {
                idx : 1,
                patch : [
                    new UpdateChildrenOp([
                        {
                            idx : 0,
                            patch : [
                                new UpdateChildrenOp([
                                    {
                                        idx : 0,
                                        patch : [new UpdateTextOp('bad')]
                                    }
                                ]),
                                new UpdateAttrOp('id', 'id1')
                            ]
                        },
                        {
                            idx : 1,
                            patch : [
                                new RemoveChildOp(node4, 0),
                                new UpdateChildrenOp([
                                    {
                                        idx : 0,
                                        patch : [new ReplaceOp(node5, node6)]
                                    }
                                ])
                            ]
                        }
                    ])
                ]
            },
            {
                idx : 2,
                patch : [new ReplaceOp(node9, node8)]
            }
        ])
    ]
};
