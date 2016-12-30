import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const oldNode = createNode('div').ns('ns1'),
    newNode = createNode('div').ns('ns2'),
    replaceOp = patchOps.replace;

export default {
    'name' : 'replace4',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : [
        { op : replaceOp, args : [oldNode, newNode] }
    ]
};
