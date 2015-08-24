import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const newNode = createNode('input').key('a'),
    beforeNode = createNode('input'),
    parentNode = createNode('div');

export default {
    'name' : 'insertChild2',
    'trees' : [
        createNode('div').children([
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
