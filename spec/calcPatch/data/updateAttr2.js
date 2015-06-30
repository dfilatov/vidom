var createNode = require('../../../lib/createNode'),
    UpdateAttrOp = require('../../../lib/client/patchOps/UpdateAttr');

module.exports = {
    'name' : 'updateAttr2',
    'trees' : [
        createNode('input').attrs({ value : 'text' }),
        createNode('input').attrs({ value : 'text', disabled : true })
    ],
    'patch' : [
        new UpdateAttrOp('disabled', true)
    ]
};
