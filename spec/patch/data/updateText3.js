import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const node = createElement('span').setChildren('text');

export default {
    'name' : 'updateText3',
    'trees' : [
        node,
        createElement('span').setHtml('<span></span>')
    ],
    'patch' : [
        { op : patchOps.updateText, args : [node, '<span></span>', false] }
    ]
};
