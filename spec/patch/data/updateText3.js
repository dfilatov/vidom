import patchOps from '../../../src/client/patchOps';
import { h } from '../../helpers';

const node = h('span', { children : 'text' });

export default {
    'name' : 'updateText3',
    'trees' : [
        node,
        h('span', { html : '<span></span>' })
    ],
    'patch' : [
        { op : patchOps.updateText, args : [node, '<span></span>', false] }
    ]
};
