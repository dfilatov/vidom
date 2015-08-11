var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    node = createNode('span').children('text');

module.exports = {
    'name' : 'updateText3',
    'trees' : [
        node,
        createNode('span').html('<span></span>')
    ],
    'patch' : [
        { op : patchOps.updateText, args : [node, '<span></span>', false] }
    ]
};
