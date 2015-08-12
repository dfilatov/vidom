import createNode from '../../../lib/createNode';
import patchOps from '../../../lib/client/patchOps';

const node = createNode('a');

export default {
    'name' : 'removeText1',
    'trees' : [
        node.children('text'),
        createNode('a')
    ],
    'patch' : [
        { op : patchOps.removeText, args : [node] }
    ]
}
