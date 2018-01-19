import patchOps from '../../../src/client/patchOps';
import { h } from '../../helpers';

const parentNode = h('div', { children : [h('div'), h('div')] });

export default {
    'name' : 'removeChildren1',
    'trees' : [
        parentNode,
        h('div')
    ],
    'patch' : [
        { op : patchOps.removeChildren, args : [parentNode] }
    ]
};
