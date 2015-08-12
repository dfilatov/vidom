import createNode from '../../../lib/createNode';
import patchOps from '../../../lib/client/patchOps';

const newNode = createNode('input').key('a'),
    beforeNode = createNode('input'),
    parentNode = createNode('div');

export default {
    'name' : 'insertChild2',
    'trees' : [
        parentNode.children([
            createNode('span'),
            beforeNode
        ]),
        createNode('div').children([
            createNode('span'),
            newNode,
            createNode('input')
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [parentNode, newNode, beforeNode] }
    ]
}
