import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const nodeC = createNode('a'),
    nodeD = createNode('a');

export default {
    'name' : 'complex-remove-from-ending-without-key',
    'trees' : [
        createNode('div').children([
            createNode('a').key('a'),
            createNode('a').key('b'),
            nodeC,
            nodeD
        ]),
        createNode('div').children([
            createNode('a').key('a'),
            createNode('a').key('b')
        ])
    ],
    'patch' : [
        { op : patchOps.removeChild, args : [nodeC] },
        { op : patchOps.removeChild, args : [nodeD] }
    ]
};
