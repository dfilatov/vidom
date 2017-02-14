import isNode from './isNode';
import console from '../../utils/console';

export default function checkChildren(children) {
    const keys = {},
        len = children.length;

    let i = 0,
        child;

    while(i < len) {
        child = children[i++];

        if(!isNode(child)) {
            throw TypeError(`Unexpected type of child. Only a virtual node is expected to be here.`);
        }

        if(child.key != null) {
            if(child.key in keys) {
                console.error(
                    `Childrens\' keys must be unique across the children. Found duplicate of "${child._key}" key.`);
            }
            else {
                keys[child.key] = true;
            }
        }
    }
}
