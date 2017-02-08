import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const node = createNode('text');

export default {
    'name' : 'removeText3',
    'trees' : [
        node.setChildren('text'),
        createNode('text')
    ],
    'patch' : [
        { op : patchOps.removeText, args : [node] }
    ]
};
