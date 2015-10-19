import createNode from './createNode';

function normalizeChildren(children) {
    const typeOfChildren = typeof children;
    if(typeOfChildren !== 'object') {
        return children;
    }

    if(!Array.isArray(children)) {
        children = [children];
    }

    let res = [],
        i = 0,
        len = children.length,
        child;

    while(i < len) {
        child = children[i];
        if(Array.isArray(child)) {
            res = res.concat(normalizeChildren(child));
        }
        else if(child != null) {
            const typeOfChild = typeof child;
            res.push(typeOfChild === 'object'?
                child :
                createNode('span').children(typeOfChild === 'string'? child : child.toString()));
        }
        ++i;
    }

    return res;
}

export default normalizeChildren;
