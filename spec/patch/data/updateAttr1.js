import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const node = createElement('div').setAttrs({ id : 'id1' });

export default {
    'name' : 'updateAttr1',
    'trees' : [
        node,
        createElement('div').setAttrs({ id : 'id2' })
    ],
    'patch' : [
        { op : patchOps.updateAttr, args : [node, 'id', 'id2'] }
    ]
};
