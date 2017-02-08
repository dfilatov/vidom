import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const oldNode = createNode('div').setKey('a'),
    newNode = createNode('span').setKey('a');

export default {
    'name' : 'replace3',
    'trees' : [
        createNode('div').setChildren([
            createNode('div'),
            oldNode
        ]),
        createNode('div').setChildren([
            createNode('div'),
            newNode
        ])
    ],
    'patch' : [
        { op : patchOps.replace, args : [oldNode, newNode] }
    ]
};
