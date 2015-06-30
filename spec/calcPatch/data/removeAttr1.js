var createNode = require('../../../lib/createNode'),
    RemoveAttrOp = require('../../../lib/client/patchOps/RemoveAttr');

module.exports = {
    'name' : 'removeAttr1',
    'trees' : [
        createNode('input').attrs({ value : 'text', className : 'input' }),
        createNode('input').attrs({ value : 'text' })
    ],
    'patch' : [
        new RemoveAttrOp('className')
    ]
};
