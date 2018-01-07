import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const nodeB = createElement('fragment').setKey('b'),
    nodeC = createElement('a').setKey('c'),
    nodeBA = createElement('fragment').setKey('ba'),
    nodeBAA = createElement('b').setKey('baa'),
    nodeBAB = createElement('b').setKey('bab'),
    nodeBB = createElement('a').setKey('bb'),
    nodeD = createElement('a').setKey('d'),
    parentNode = createElement('fragment');

export default {
    'name' : 'complex4',
    'trees' : [
        createElement('fragment').setChildren([
            createElement('a').setKey('a'),
            nodeB.setChildren([
                nodeBA.setChildren([
                    nodeBAA,
                    nodeBAB
                ]),
                nodeBB
            ]),
            nodeC,
            nodeD
        ]),
        parentNode.setChildren([
            createElement('a').setKey('a'),
            createElement('a').setKey('c'),
            createElement('fragment').setKey('b').setChildren([
                createElement('a').setKey('bb'),
                createElement('fragment').setKey('ba').setChildren([
                    createElement('b').setKey('bab'),
                    createElement('b').setKey('baa')
                ])
            ])
        ])
    ],
    'patch' : [
        { op : patchOps.moveChild, args : [nodeB, nodeD, true] },
        { op : patchOps.moveChild, args : [nodeBA, nodeBB, true] },
        { op : patchOps.moveChild, args : [nodeBAA, nodeBAB, true] },
        { op : patchOps.removeChild, args : [nodeD] }
    ]
};
