var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    node = createNode().text('text');

module.exports = {
    'name' : 'updateText1',
    'trees' : [
        node,
        createNode().text('new text')
    ],
    'patch' : [
        { op : patchOps.updateText, args : [node, 'new text'] }
    ]
};
