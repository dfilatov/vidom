import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const node = createNode('span').children('text');

export default {
    'name' : 'updateText3',
    'trees' : [
        node,
        createNode('span').html('<span></span>')
    ],
    'patch' : [
        { op : patchOps.updateText, args : [node, '<span></span>', false] }
    ]
};
