import createNode from '../../../lib/createNode';
import patchOps from '../../../lib/client/patchOps';

const oldNode = createNode('div'),
    newNode = createNode('span');

export default {
    'name' : 'replace1',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : [
        { op : patchOps.replace, args : [null, oldNode, newNode] }
    ]
}
