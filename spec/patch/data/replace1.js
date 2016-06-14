import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const oldNode = createNode('div'),
    newNode = createNode('span'),
    replaceOp = patchOps.replace;

export default {
    'name' : 'replace1',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : topNode => [
        { op : replaceOp, args : [topNode, oldNode, newNode] }
    ]
}
