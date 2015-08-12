import createNode from '../../../lib/createNode';
import patchOps from '../../../lib/client/patchOps';
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
}
