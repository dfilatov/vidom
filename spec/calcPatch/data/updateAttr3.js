var createNode = require('../../../lib/createNode'),
    UpdateChildrenOp = require('../../../lib/client/patchOps/UpdateChildren');
    UpdateAttrOp = require('../../../lib/client/patchOps/UpdateAttr');

module.exports = {
    'name' : 'updateAttr3',
    'trees' : [
        createNode('div').children([
            createNode('input').attrs({ value : 'text' }),
            createNode('input').attrs({ value : 'text' })
        ]),
        createNode('div').children([
            createNode('input').attrs({ value : 'text' }),
            createNode('input').attrs({ value : 'new text' })
        ])
    ],
    'patch' : [
        new UpdateChildrenOp([
            {
                idx : 1,
                patch : [
                    new UpdateAttrOp('value', 'new text')
                ]
            }
        ])
    ]
};
