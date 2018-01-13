import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const oldNode = createElement('div'),
    newNode = createElement('svg'),
    replaceOp = patchOps.replace;

export default {
    'name' : 'replace4',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : [
        { op : replaceOp, args : [oldNode, newNode] }
    ]
};
