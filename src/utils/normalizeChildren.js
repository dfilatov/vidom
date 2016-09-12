import createNode from '../createNode';

function normalizeChildren(children) {
    if(children == null) {
        return null;
    }

    const typeOfChildren = typeof children;
    if(typeOfChildren !== 'object') {
        return typeOfChildren === 'string'? children || null : '' + children;
    }

    if(!Array.isArray(children)) {
        return children;
    }

    if(!children.length) {
        return null;
    }

    let res = children,
        i = 0,
        len = children.length,
        allSkipped = true,
        child,
        isChildObject;

    while(i < len) {
        child = normalizeChildren(children[i]);
        if(child === null) {
            if(res !== null) {
                if(allSkipped) {
                    res = null;
                }
                else if(res === children) {
                    res = children.slice(0, i);
                }
            }
        } else {
            if(res === null) {
                res = child;
            }
            else if(Array.isArray(child)) {
                res = allSkipped?
                    child :
                    (res === children?
                        res.slice(0, i) :
                        Array.isArray(res)? res : [res]).concat(child);
            }
            else {
                isChildObject = typeof child === 'object';

                if(isChildObject && children[i] === child) {
                    if(res !== children) {
                        res = join(res, child);
                    }
                }
                else {
                    if(res === children) {
                        if(allSkipped && isChildObject) {
                            res = child;
                            allSkipped = false;
                            ++i;
                            continue;
                        }

                        res = res.slice(0, i);
                    }

                    res = join(res, child);
                }
            }

            allSkipped = false;
        }

        ++i;
    }

    return res;
}

function toNode(obj) {
    return typeof obj === 'object'? obj : createNode('text').children(obj);
}

function join(objA, objB) {
    if(Array.isArray(objA)) {
        objA.push(toNode(objB));
        return objA;
    }

    return [
        toNode(objA),
        toNode(objB)
    ];
}

export default function(children) {
    let res = normalizeChildren(children);

    if(res !== null && typeof res === 'object' && !Array.isArray(res)) {
        res = [res];
    }

    return res;
}
