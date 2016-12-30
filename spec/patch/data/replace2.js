import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

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
        { op : patchOps.replace, args : [oldNode, newNode] }
    ]
};
