var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    node1 = createNode('div'),
    node2 = createNode('span'),
    parentNode = createNode('div');

module.exports = {
    'name' : 'appendChild2',
    'trees' : [
        parentNode,
        createNode('div').children([
            node1,
            node2
        ])
    ],
    'patch' : [
        { op : patchOps.appendChild, args : [parentNode, node1] },
        { op : patchOps.appendChild, args : [parentNode, node2] }
    ]
};
