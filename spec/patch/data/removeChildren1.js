import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const parentNode = createNode('div');

export default {
    'name' : 'removeChildren1',
    'trees' : [
        parentNode.children([createNode('div'), createNode('div')]),
        createNode('div')
    ],
    'patch' : [
        { op : patchOps.removeChildren, args : [parentNode] }
    ]
};
