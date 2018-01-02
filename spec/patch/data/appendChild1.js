import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const node1 = createElement('div'),
    node2 = createElement('span'),
    parentNode = createElement('div');

export default {
    'name' : 'appendChild1',
    'trees' : [
        createElement('div').setChildren(createElement('div')),
        parentNode.setChildren([
            createElement('div'),
            node1,
            node2
        ])
    ],
    'patch' : [
        { op : patchOps.appendChild, args : [parentNode, node1] },
        { op : patchOps.appendChild, args : [parentNode, node2] }
    ]
};
