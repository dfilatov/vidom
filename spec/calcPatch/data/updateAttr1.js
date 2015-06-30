var createNode = require('../../../lib/createNode'),
    UpdateAttrOp = require('../../../lib/client/patchOps/UpdateAttr');

module.exports = {
    'name' : 'updateAttr1',
    'trees' : [
        createNode('input').attrs({ value : 'text' }),
        createNode('input').attrs({ value : 'new text' })
    ],
    'patch' : [
        new UpdateAttrOp('value', 'new text')
    ]
};
