import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const node1 = createNode('div'),
    node2 = createNode('span'),
    parentNode = createNode('fragment');

export default {
    'name' : 'appendChild3',
    'trees' : [
        createNode('fragment'),
        parentNode.children([
            node1,
            node2
        ])
    ],
    'patch' : [
        { op : patchOps.appendChild, args : [parentNode, node1] },
        { op : patchOps.appendChild, args : [parentNode, node2] }
    ]
};
