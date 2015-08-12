import createNode from '../../../lib/createNode';
import patchOps from '../../../lib/client/patchOps';

const node1 = createNode('div'),
    node2 = createNode('span'),
    parentNode = createNode('div');

export default {
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
}
