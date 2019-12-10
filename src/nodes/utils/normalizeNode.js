import createElement from '../../createElement';

export default function normalizeNode(obj) {
    if(obj == null) {
        return null;
    }

    const typeOfObj = typeof obj;

    if(typeOfObj !== 'object') {
        return typeOfObj === 'string'?
            obj || null :
            typeOfObj === 'boolean'?
                null :
                '' + obj;
    }

    if(!Array.isArray(obj)) {
        return obj;
    }

    if(obj.length === 0) {
        return null;
    }

    let res = obj,
        i = 0,
        hasContentBefore = false,
        child;
    const len = obj.length,
        alreadyNormalizeChildren = Object.create(null);

    while(i < len) {
        child = i in alreadyNormalizeChildren?
            alreadyNormalizeChildren[i] :
            normalizeNode(obj[i]);

        if(child === null) {
            if(res !== null) {
                if(!hasContentBefore) {
                    res = null;
                }
                else if(res === obj) {
                    res = obj.slice(0, i);
                }
            }
        }
        else if(typeof child === 'object') {
            if(Array.isArray(child)) {
                res = hasContentBefore?
                    (res === obj?
                        res.slice(0, i) :
                        Array.isArray(res)? res : [nodeToElement(res)]).concat(child) :
                    child.slice();
            }
            else if(res !== obj) {
                if(!hasContentBefore) {
                    res = child;
                }
                else if(Array.isArray(res)) {
                    res.push(child);
                }
                else {
                    res = [nodeToElement(res), child];
                }
            }
            else if(child !== obj[i]) {
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
                nextChild = alreadyNormalizeChildren[j] = normalizeNode(obj[j]);

                if(typeof nextChild === 'string') {
                    child += nextChild;
                }
                else if(nextChild !== null) {
                    break;
                }
            }

            if(hasContentBefore) {
                if(Array.isArray(res)) {
                    if(res === obj) {
                        res = res.slice(0, i);
                    }

                    res.push(nodeToElement(child));
                }
                else {
                    res = [res, nodeToElement(child)];
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

function nodeToElement(obj) {
    return typeof obj === 'object'? obj : createElement('plaintext', null, null, obj);
}
