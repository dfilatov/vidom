import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const node = createElement('a');

export default {
    'name' : 'removeText1',
    'trees' : [
        node.setChildren('text'),
        createElement('a')
    ],
    'patch' : [
        { op : patchOps.removeText, args : [node] }
    ]
};
