import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const oldNode = createElement('div'),
    newNode = createElement('fragment'),
    replaceOp = patchOps.replace;

export default {
    'name' : 'replace11',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : [
        { op : replaceOp, args : [oldNode, newNode] }
    ]
};
