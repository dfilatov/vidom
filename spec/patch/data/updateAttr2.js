import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const node = createElement('button').setAttrs({ value : 'text' });

export default {
    'name' : 'updateAttr2',
    'trees' : [
        node,
        createElement('button').setAttrs({ value : 'text', disabled : true })
    ],
    'patch' : [
        { op : patchOps.updateAttr, args : [node, 'disabled', true] }
    ]
};
