import console from '../../utils/console';

export default function checkChildren(children) {
    const keys = {},
        len = children.length;

    let i = 0,
        child;

    while(i < len) {
        child = children[i++];

        if(typeof child !== 'object') {
            console.error('You mustn\'t use simple child in case of multiple children.');
        }
        else if(child.key != null) {
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
