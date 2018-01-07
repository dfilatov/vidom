import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const node = createElement('button');

export default {
    'name' : 'removeAttr1',
    'trees' : [
        node.setAttrs({ value : 'text', className : 'input' }),
        createElement('button').setAttrs({ value : 'text' })
    ],
    'patch' : [
        { op : patchOps.removeAttr, args : [node, 'className'] }
    ]
};
