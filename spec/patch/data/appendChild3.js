import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const node1 = createElement('div'),
    node2 = createElement('span'),
    parentNode = createElement('fragment');

export default {
    'name' : 'appendChild3',
    'trees' : [
        createElement('fragment'),
        parentNode.setChildren([
            node1,
            node2
        ])
    ],
    'patch' : [
        { op : patchOps.appendChild, args : [parentNode, node1] },
        { op : patchOps.appendChild, args : [parentNode, node2] }
    ]
};
