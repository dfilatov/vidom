import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const nodeA = createElement('a').setKey('a'),
    nodeB = createElement('a').setKey('b'),
    nodeC = createElement('a').setKey('c'),
    nodeD = createElement('a').setKey('d');

export default {
    'name' : 'complex1',
    'trees' : [
        createElement('div').setChildren([
            nodeC,
            nodeA.setChildren(createElement('div')),
            nodeD
        ]),
        createElement('div').setChildren([
            nodeB,
            createElement('a').setKey('a').setChildren('new text')
        ])
    ],
    'patch' : [
        { op : patchOps.insertChild, args : [nodeB, nodeC] },
        { op : patchOps.moveChild, args : [nodeA, nodeC, false] },
        { op : patchOps.removeChildren, args : [nodeA] },
        { op : patchOps.updateText, args : [nodeA, 'new text', true] },
        { op : patchOps.removeChild, args : [nodeC] },
        { op : patchOps.removeChild, args : [nodeD] }
    ]
};
