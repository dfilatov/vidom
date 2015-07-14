var createNode = require('../../../lib/createNode'),
    UpdateTextOp = require('../../../lib/client/patchOps/UpdateText');

module.exports = {
    'name' : 'updateText1',
    'trees' : [
        createNode().text('text'),
        createNode().text('new text')
    ],
    'patch' : [
        new UpdateTextOp('new text')
    ]
};
