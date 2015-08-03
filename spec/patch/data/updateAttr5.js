var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    node = createNode('select');

module.exports = {
    'name' : 'updateAttr5',
    'trees' : [
        node
            .attrs({
                multiple : true,
                value : [1, 2, 3]
            }),
        createNode('select')
            .attrs({
                multiple : true,
                value : [1, 2, 4]
            })
    ],
    'patch' : [
        { op : patchOps.updateAttr, args : [node, 'value', [1, 2, 4]] }
    ]
};
