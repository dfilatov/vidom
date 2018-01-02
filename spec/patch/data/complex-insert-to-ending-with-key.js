import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const nodeC = createElement('a').setKey('c'),
    nodeD = createElement('a').setKey('d'),
    parentNode = createElement('div');

export default {
    'name' : 'complex-insert-to-ending-with-key',
    'trees' : [
        createElement('div').setChildren([
            createElement('a').setKey('a'),
            createElement('a').setKey('b')
        ]),
        parentNode.setChildren([
            createElement('a').setKey('a'),
            createElement('a').setKey('b'),
            nodeC,
            nodeD
        ])
    ],
    'patch' : [
        { op : patchOps.appendChild, args : [parentNode, nodeC] },
        { op : patchOps.appendChild, args : [parentNode, nodeD] }
    ]
};
