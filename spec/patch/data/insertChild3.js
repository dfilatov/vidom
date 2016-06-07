import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const newNode = createNode('input').key('a'),
    beforeNode = createNode('input'),
    parentNode = createNode('fragment');

export default {
    'name' : 'insertChild3',
    'trees' : [
        createNode('fragment').children([
            createNode('span'),
            createNode('input')
        ]),
        parentNode.children([
            createNode('span'),
            newNode,
            beforeNode
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [parentNode, newNode, beforeNode] }
    ]
}
