import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const oldNode = createElement('div'),
    newNode = createElement(() => createElement('div')),
    replaceOp = patchOps.replace;

export default {
    'name' : 'replace10',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : [
        { op : replaceOp, args : [oldNode, newNode] }
    ]
};
