import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const parentNode = createNode('fragment');

export default {
    'name' : 'removeChildren2',
    'trees' : [
        parentNode.children([createNode('div'), createNode('div')]),
        createNode('fragment')
    ],
    'patch' : [
        { op : patchOps.removeChildren, args : [parentNode] }
    ]
};
