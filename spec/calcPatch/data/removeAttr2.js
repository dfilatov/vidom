var createNode = require('../../../lib/createNode'),
    RemoveAttrOp = require('../../../lib/client/patchOps/RemoveAttr');

module.exports = {
    'name' : 'removeAttr2',
    'trees' : [
        createNode('input').attrs({ value : 'text', className : 'input' }),
        createNode('input')
    ],
    'patch' : [
        new RemoveAttrOp('value'),
        new RemoveAttrOp('className')
    ]
};
