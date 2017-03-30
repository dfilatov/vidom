import createNode from '../createNode';

export default function normalizeChildren(children) {
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

    if(children.length === 0) {
        return null;
    }

    let res = children,
        i = 0,
        hasContentBefore = false,
        child;
    const len = children.length,
        alreadyNormalizeChildren = {};

    while(i < len) {
        child = i in alreadyNormalizeChildren?
            alreadyNormalizeChildren[i] :
            normalizeChildren(children[i]);

        if(child === null) {
            if(res !== null) {
                if(!hasContentBefore) {
                    res = null;
                }
                else if(res === children) {
                    res = children.slice(0, i);
                }
            }
        }
        else if(typeof child === 'object') {
            if(Array.isArray(child)) {
                res = hasContentBefore?
                    (res === children?
                        res.slice(0, i) :
                        Array.isArray(res)? res : [toNode(res)]).concat(child) :
                    child;
            }
            else if(res !== children) {
                if(!hasContentBefore) {
                    res = child;
                }
                else if(Array.isArray(res)) {
                    res.push(child);
                }
                else {
                    res = [toNode(res), child];
                }
            }
            else if(child !== children[i]) {
                if(hasContentBefore) {
                    res = res.slice(0, i);
                    res.push(child);
                }
                else {
                    res = child;
                }
            }

            hasContentBefore = true;
        }
        else {
            let nextChild,
                j = i;

            // join all next text nodes
            while(++j < len) {
                nextChild = alreadyNormalizeChildren[j] = normalizeChildren(children[j]);

                if(typeof nextChild === 'string') {
                    child += nextChild;
                }
                else if(nextChild !== null) {
                    break;
                }
            }

            if(hasContentBefore) {
                if(Array.isArray(res)) {
                    if(res === children) {
                        res = res.slice(0, i);
                    }

                    res.push(toNode(child));
                }
                else {
                    res = [res, toNode(child)];
                }
            }
            else {
                res = '' + child;
            }

            i = j - 1;

            hasContentBefore = true;
        }

        ++i;
    }

    return res;
}

function toNode(obj) {
    return typeof obj === 'object'? obj : createNode('text').setChildren(obj);
}
