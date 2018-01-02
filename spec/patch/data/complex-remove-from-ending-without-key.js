import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const nodeC = createElement('a'),
    nodeD = createElement('a');

export default {
    'name' : 'complex-remove-from-ending-without-key',
    'trees' : [
        createElement('div').setChildren([
            createElement('a').setKey('a'),
            createElement('a').setKey('b'),
            nodeC,
            nodeD
        ]),
        createElement('div').setChildren([
            createElement('a').setKey('a'),
            createElement('a').setKey('b')
        ])
    ],
    'patch' : [
        { op : patchOps.removeChild, args : [nodeC] },
        { op : patchOps.removeChild, args : [nodeD] }
    ]
};
