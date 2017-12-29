import isNode from './isNode';

export default function checkChildren(children) {
    const keys = Object.create(null),
        len = children.length;

    let i = 0,
        child;

    while(i < len) {
        child = children[i++];

        if(!isNode(child)) {
            throw TypeError(`vidom: Unexpected type of child. Only a node is expected to be here.`);
        }

        if(child.key != null) {
            if(child.key in keys) {
                throw Error(
                    'vidom: Childrens\' keys must be unique across the children. ' +
                    `Found duplicate of "${child.key}" key.`);
            }
            else {
                keys[child.key] = true;
            }
        }
    }
}
