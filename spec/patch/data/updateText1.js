var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    node = createNode('span').children('text');

module.exports = {
    'name' : 'updateText1',
    'trees' : [
        node,
        createNode('span').children('new text')
    ],
    'patch' : [
        { op : patchOps.updateText, args : [node, 'new text'] }
    ]
};
