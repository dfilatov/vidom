import createNode from '../../../lib/createNode';
import patchOps from '../../../lib/client/patchOps';

const oldNode = createNode('div'),
    newNode = createNode('span');

export default {
    'name' : 'replace2',
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
        { op : patchOps.replace, args : [null, oldNode, newNode] }
    ]
}
