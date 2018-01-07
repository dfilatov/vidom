import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const oldNode = createElement('fragment'),
    newNode = createElement('div'),
    replaceOp = patchOps.replace;

export default {
    'name' : 'replace12',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : [
        { op : replaceOp, args : [oldNode, newNode] }
    ]
};
