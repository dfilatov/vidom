import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const node = createElement('button');

export default {
    'name' : 'removeAttr2',
    'trees' : [
        node.setAttrs({ value : 'text', className : 'button' }),
        createElement('button')
    ],
    'patch' : [
        { op : patchOps.removeAttr, args : [node, 'value'] },
        { op : patchOps.removeAttr, args : [node, 'className'] }
    ]
};
