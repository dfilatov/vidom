import patchOps from '../../../src/client/patchOps';
import { h } from '../../helpers';

const node = h('span', { children : 'text' });

export default {
    'name' : 'updateText1',
    'trees' : [
        node,
        h('span', { children : 'new text' })
    ],
    'patch' : [
        { op : patchOps.updateText, args : [node, 'new text', true] }
    ]
};
