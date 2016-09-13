import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const oldNode = createNode('text'),
    newNode = createNode('div'),
    replaceOp = patchOps.replace;

export default {
    'name' : 'replace13',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : [
        { op : replaceOp, args : [oldNode, newNode] }
    ]
}
