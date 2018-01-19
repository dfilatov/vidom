import patchOps from '../../../src/client/patchOps';
import { h } from '../../helpers';

const node = h('a', { children : 'text' });

export default {
    'name' : 'removeText1',
    'trees' : [
        node,
        h('a')
    ],
    'patch' : [
        { op : patchOps.removeText, args : [node] }
    ]
};
