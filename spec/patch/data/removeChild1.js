import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const oldNode = createNode('div'),
    parentNode = createNode('div');

export default {
    'name' : 'removeChild1',
    'trees' : [
        createNode('div').children([
            createNode('div'),
            createNode('div'),
            oldNode
        ]),
        parentNode.children([
            createNode('div'),
            createNode('div')
        ])
    ],
    'patch' : [
        { op : patchOps.removeChild, args : [parentNode, oldNode] }
    ]
}
