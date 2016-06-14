import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const oldNode = createNode('div'),
    newNode = createNode('fragment'),
    replaceOp = patchOps.replace;

export default {
    'name' : 'replace11',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : topNode => [
        { op : replaceOp, args : [topNode, oldNode, newNode] }
    ]
}
