import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const oldNode = createNode('div').key('a'),
    newNode = createNode('span').key('a');

export default {
    'name' : 'replace3',
    'trees' : [
        createNode('div').children([
            createNode('div'),
            oldNode
        ]),
        createNode('div').children([
            createNode('div'),
            newNode
        ])
    ],
    'patch' : [
        { op : patchOps.replace, args : [oldNode, newNode] }
    ]
}
