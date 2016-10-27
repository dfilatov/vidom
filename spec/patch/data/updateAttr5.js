import createNode from '../../../src/createNode';
import patchOps from '../../../src/client/patchOps';

const node = createNode('select').attrs({
        multiple : true,
        value : [1, 2, 3]
    }),
    rootNode = node._getInstance().getRootNode();

export default {
    'name' : 'updateAttr5',
    'trees' : [
        node,
        createNode('select')
            .attrs({
                multiple : true,
                value : [1, 2, 4]
            })
    ],
    'patch' : [
        { op : patchOps.updateAttr, args : [rootNode, 'value', [1, 2, 4]] }
    ]
}
