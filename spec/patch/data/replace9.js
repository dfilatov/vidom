import createElement from '../../../src/createElement';
import createComponent from '../../../src/createComponent';
import patchOps from '../../../src/client/patchOps';

const oldNode = createElement('div'),
    newNode = createElement(createComponent({
        onRender() {
            return createElement('div');
        }
    })),
    replaceOp = patchOps.replace;

export default {
    'name' : 'replace9',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : [
        { op : replaceOp, args : [oldNode, newNode] }
    ]
};
