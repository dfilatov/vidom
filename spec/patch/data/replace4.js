import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const oldNode = createNode('div').ns('ns1'),
    newNode = createNode('div').ns('ns2');

export default {
    'name' : 'replace4',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : [
        { op : patchOps.replace, args : [null, oldNode, newNode] }
    ]
}
