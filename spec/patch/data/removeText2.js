import createNode from '../../../lib/createNode';
import patchOps from '../../../lib/client/patchOps';

const node = createNode('a');

export default {
    'name' : 'removeText2',
    'trees' : [
        node.children(''),
        createNode('a')
    ],
    'patch' : []
}
