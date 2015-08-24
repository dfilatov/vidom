import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const oldNode = createNode('div'),
    newNode = createNode('span'),
    parentNode = createNode('div');

export default {
    'name' : 'replace2',
    'trees' : [
        createNode('div').children([
            createNode('div'),
            oldNode
        ]),
        parentNode.children([
            createNode('div'),
            newNode
        ])
    ],
    'patch' : [
        { op : patchOps.replace, args : [parentNode, oldNode, newNode] }
    ]
}
