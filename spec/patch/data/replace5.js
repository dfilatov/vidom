import createNode from '../../../src/createNode';
import createComponent from '../../../src/createComponent';
import patchOps from '../../../src/client/patchOps';

const C1 = createComponent(),
    C2 = createComponent(),
    oldNode = createNode(C1),
    newNode = createNode(C2);

export default {
    'name' : 'replace5',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : [
        { op : patchOps.replace, args : [null, oldNode, newNode] }
    ]
}
