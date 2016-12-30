import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const oldNode = createNode('fragment'),
    newNode = createNode('div'),
    replaceOp = patchOps.replace;

export default {
    'name' : 'replace12',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : [
        { op : replaceOp, args : [oldNode, newNode] }
    ]
};
