import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const oldNode = createNode('div'),
    newNode = createNode('span');

export default {
    'name' : 'replace10',
    'trees' : [
        oldNode,
        createNode(() => newNode)
    ],
    'patch' : [
        { op : patchOps.replace, args : [null, oldNode, newNode] }
    ]
}
