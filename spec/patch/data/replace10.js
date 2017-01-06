import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const oldNode = createNode('div'),
    newNode = createNode(() => createNode('div')),
    replaceOp = patchOps.replace;

export default {
    'name' : 'replace10',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : [
        { op : replaceOp, args : [oldNode, newNode] }
    ]
};
