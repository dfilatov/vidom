var createNode = require('../../../lib/createNode'),
    RemoveAttrOp = require('../../../lib/client/patchOps/RemoveAttr');

module.exports = {
    'name' : 'removeAttr3',
    'trees' : [
        createNode('input').attrs({ className : 'input' }),
        createNode('input').attrs({ className : null })
    ],
    'patch' : [
        new RemoveAttrOp('className')
    ]
};
