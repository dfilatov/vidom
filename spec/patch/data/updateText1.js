import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const node = createElement('span').setChildren('text');

export default {
    'name' : 'updateText1',
    'trees' : [
        node,
        createElement('span').setChildren('new text')
    ],
    'patch' : [
        { op : patchOps.updateText, args : [node, 'new text', true] }
    ]
};
