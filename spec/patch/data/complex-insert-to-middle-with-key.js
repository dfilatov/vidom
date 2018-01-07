import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const nodeC = createElement('a').setKey('c'),
    nodeD = createElement('a').setKey('d'),
    nodeE = createElement('a').setKey('e');

export default {
    'name' : 'complex-insert-to-middle-with-key',
    'trees' : [
        createElement('div').setChildren([
            createElement('a').setKey('a'),
            createElement('a').setKey('b'),
            createElement('a').setKey('e')
        ]),
        createElement('div').setChildren([
            createElement('a').setKey('a'),
            createElement('a').setKey('b'),
            nodeC,
            nodeD,
            nodeE
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [nodeC, nodeE] },
        { op : patchOps.insertChild, args : [nodeD, nodeE] }
    ]
};
