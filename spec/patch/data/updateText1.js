import patchOps from '../../../src/client/patchOps';
import { h } from '../../../src/vidom';

const node = h('span', null, 'text');

export default {
    'name' : 'updateText1',
    'trees' : [
        node,
        h('span', null, 'new text')
    ],
    'patch' : [
        { op : patchOps.updateText, args : [node, 'new text', true] }
    ]
};
