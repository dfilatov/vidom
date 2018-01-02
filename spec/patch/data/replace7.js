import createElement from '../../../src/createElement';
import createComponent from '../../../src/createComponent';
import patchOps from '../../../src/client/patchOps';

const C1 = () => createElement('div'),
    C2 = createComponent({
        onRender() {
            return createElement('div');
        }
    }),
    oldNode = createElement(C1),
    newNode = createElement(C2),
    replaceOp = patchOps.replace;

export default {
    'name' : 'replace7',
    'trees' : [
        oldNode,
        newNode
    ],
    'patch' : [
        { op : replaceOp, args : [oldNode, newNode] }
    ]
};
