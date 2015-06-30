var createNode = require('../../../lib/createNode'),
    MoveChildOp = require('../../../lib/client/patchOps/MoveChild'),
    InsertChildOp = require('../../../lib/client/patchOps/InsertChild'),
    RemoveChildOp = require('../../../lib/client/patchOps/RemoveChild'),
    UpdateChildrenOp = require('../../../lib/client/patchOps/UpdateChildren'),
    UpdateTextOp = require('../../../lib/client/patchOps/UpdateText'),
    UpdateAttrOp = require('../../../lib/client/patchOps/UpdateAttr'),
    RemoveAttrOp = require('../../../lib/client/patchOps/RemoveAttr'),
    ReplaceOp = require('../../../lib/client/patchOps/Replace'),
    node1 = createNode('div').attrs({ id : 'id2' }),
    node2 = createNode('div').key('c'),
    node3 = createNode('div'),
    node4 = createNode('span'),
    node5 = createNode('a').key('a').attrs({ 'href' : 'http://ya.ru' }),
    node6 = createNode('span').key('a').children('new text');

module.exports = {
    'name' : 'complex1',
    'trees' : [
        createNode('div').children([
            createNode('input').key('a').attrs({ value : 'text', disabled : true }),
            createNode('label').attrs({ 'for' : 'text' }),
            createNode('div').key('b').children([
                createNode('span').children('good'),
                createNode('div').children([node4, node5])
            ]),
            createNode('div').key('c'),
            createNode('div')
        ]),
        createNode('div').children([
            createNode('input').key('a').attrs({ value : 'text2' }),
            createNode('div').key('b').children([
                createNode('span').attrs({ id : 'id1' }).children('bad'),
                createNode('div').children(node6)
            ]),
            createNode('label').attrs({ 'for' : 'text' }),
            node1
        ])
    ],
    'patch' : [
        new MoveChildOp(2, 1),
        new InsertChildOp(node1, 3),
        new RemoveChildOp(node2, 4),
        new RemoveChildOp(node3, 4),
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
                                new MoveChildOp(1, 0),
                                new RemoveChildOp(node4, 1),
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
            }
        ])
    ]
};
