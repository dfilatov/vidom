function append(parent, child) {
    if(Array.isArray(parent)) {
        insertBefore(child, parent[parent.length - 1]);
    }
    else if(Array.isArray(child)) {
        const len = child.length;
        let i = 0;

        while(i < len) {
            append(parent, child[i++]);
        }
    }
    else {
        parent.appendChild(child);
    }
}

function remove(child) {
    if(Array.isArray(child)) {
        const len = child.length;
        let i = 0;

        while(i < len) {
            remove(child[i++]);
        }
    }
    else {
        child.parentNode.removeChild(child);
    }
}

function insertBefore(child, beforeChild) {
    Array.isArray(beforeChild) && (beforeChild = beforeChild[0]);

    if(Array.isArray(child)) {
        const len = child.length;
        let i = 0;

        while(i < len) {
            insertBefore(child[i++], beforeChild);
        }
    }
    else {
        beforeChild.parentNode.insertBefore(child, beforeChild);
    }
}

function move(child, toChild, after) {
    Array.isArray(toChild) && (toChild = toChild[toChild.length - 1]);

    if(after) {
        const nextSibling = toChild.nextSibling;

        nextSibling?
            insertBefore(child, nextSibling) :
            append(toChild.parentNode, child);
    }
    else {
        insertBefore(child, toChild);
    }
}

function replace(old, replacement) {
    if(Array.isArray(old) || Array.isArray(replacement)) {
        insertBefore(replacement, old);
        remove(old);
    }
    else {
        old.parentNode.replaceChild(replacement, old);
    }
}

function removeChildren(parent) {
    if(Array.isArray(parent)) {
        const len = parent.length - 1;
        let i = 0;

        while(i < len) {
            remove(parent[i++]);
        }
    }
    else {
        parent.innerHTML = '';
    }
}

export default {
    append,
    remove,
    insertBefore,
    move,
    replace,
    removeChildren
}
