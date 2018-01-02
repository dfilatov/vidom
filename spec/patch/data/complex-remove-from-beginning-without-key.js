import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const nodeA = createElement('a'),
    nodeB = createElement('a');

export default {
    'name' : 'complex-remove-from-beginning-without-key',
    'trees' : [
        createElement('div').setChildren([
            nodeA,
            nodeB,
            createElement('a').setKey('c'),
            createElement('a').setKey('d')
        ]),
        createElement('div').setChildren([
            createElement('a').setKey('c'),
            createElement('a').setKey('d')
        ])
    ],
    'patch' : [
        { op : patchOps.removeChild, args : [nodeA] },
        { op : patchOps.removeChild, args : [nodeB] }
    ]
};
