import { h } from '../../helpers';
import patchOps from '../../../src/client/patchOps';

const node = h('button', { className : 'button' });

export default {
    'name' : 'removeAttr3',
    'trees' : [
        node,
        h('button', { className : null })
    ],
    'patch' : [
        { op : patchOps.removeAttr, args : [node, 'className'] }
    ]
};
