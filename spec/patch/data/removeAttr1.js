import patchOps from '../../../src/client/patchOps';
import { h } from '../../helpers';

const node = h('button', {
    value : 'text',
    className : 'input'
});

export default {
    'name' : 'removeAttr1',
    'trees' : [
        node,
        h('button', { value : 'text' })
    ],
    'patch' : [
        { op : patchOps.removeAttr, args : [node, 'className'] }
    ]
};
