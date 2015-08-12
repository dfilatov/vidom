import createNode from '../../../lib/createNode';
import patchOps from '../../../lib/client/patchOps';

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
}
