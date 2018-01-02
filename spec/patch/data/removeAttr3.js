import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const node = createElement('button');

export default {
    'name' : 'removeAttr3',
    'trees' : [
        node.setAttrs({ className : 'button' }),
        createElement('button').setAttrs({ className : null })
    ],
    'patch' : [
        { op : patchOps.removeAttr, args : [node, 'className'] }
    ]
};
