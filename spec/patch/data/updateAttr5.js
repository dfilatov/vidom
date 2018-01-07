import createElement from '../../../src/createElement';
import patchOps from '../../../src/client/patchOps';

const node = createElement('select').setAttrs({
        multiple : true,
        value : [1, 2, 3]
    }),
    rootNode = node._getInstance().getRootElement();

export default {
    'name' : 'updateAttr5',
    'trees' : [
        node,
        createElement('select')
            .setAttrs({
                multiple : true,
                value : [1, 2, 4]
            })
    ],
    'patch' : [
        { op : patchOps.updateAttr, args : [rootNode, 'value', [1, 2, 4]] }
    ]
};
