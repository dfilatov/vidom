import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const node1 = createNode('div'),
    node2 = createNode('span'),
    parentNode = createNode('div');

export default {
    'name' : 'appendChild2',
    'trees' : [
        createNode('div'),
        parentNode.setChildren([
            node1,
            node2
        ])
    ],
    'patch' : [
        { op : patchOps.appendChild, args : [parentNode, node1] },
        { op : patchOps.appendChild, args : [parentNode, node2] }
    ]
};
