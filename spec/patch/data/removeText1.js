var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    node = createNode('a');

module.exports = {
    'name' : 'removeText1',
    'trees' : [
        node.children('text'),
        createNode('a')
    ],
    'patch' : [
        { op : patchOps.removeText, args : [node] }
    ]
};
