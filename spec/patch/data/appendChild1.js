var createNode = require('../../../lib/createNode'),
    patchOps = require('../../../lib/client/patchOps'),
    node1 = createNode('div'),
    node2 = createNode('span'),
    parentNode = createNode('div');

module.exports = {
    'name' : 'appendChild1',
    'trees' : [
        parentNode.children(createNode('div')),
        createNode('div').children([
            createNode('div'),
            node1,
            node2
        ])
    ],
    'patch' : [
        { op : patchOps.appendChild, args : [parentNode, node1] },
        { op : patchOps.appendChild, args : [parentNode, node2] }
    ]
};
