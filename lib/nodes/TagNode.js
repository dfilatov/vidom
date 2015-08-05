var patchOps = require('../client/patchOps'),
    domAttrsMutators = require('../client/domAttrsMutators'),
    domEventManager = require('../client/events/domEventManager'),
    ATTRS_TO_EVENTS = require('../client/events/attrsToEvents'),
    TextNode = require('./TextNode'),
    doc = typeof document !== 'undefined'? document : null;

function TagNode(tag) {
    this.type = TagNode;
    this._tag = tag;
    this._domNode = null;
    this._key = null;
    this._ns = null;
    this._attrs = null;
    this._children = null;
    this._parentNode = null;
}

TagNode.prototype = {
    getDomNode : function() {
        return this._domNode;
    },

    key : function(key) {
        this._key = key;
        return this;
    },

    ns : function(ns) {
        this._ns = ns;
        return this;
    },

    attrs : function(attrs) {
        this._attrs = attrs;
        return this;
    },

    children : function(children) {
        this._children = processChildren(children);
        return this;
    },

    renderToDom : function(parentNode) {
        if(parentNode) {
            this._parentNode = parentNode;
            this._ns || (this._ns = parentNode._ns);
        }

        var domNode = this._ns?
                doc.createElementNS(this._ns, this._tag) :
                doc.createElement(this._tag),
            children = this._children,
            attrs = this._attrs,
            name, value;

        if(children) {
            var i = 0,
                len = children.length;

            while(i < len) {
                domNode.appendChild(children[i++].renderToDom(this));
            }
        }

        if(attrs) {
            for(name in attrs) {
                (value = attrs[name]) != null &&
                    (ATTRS_TO_EVENTS[name]?
                        domEventManager.addListener(domNode, ATTRS_TO_EVENTS[name], value) :
                        domAttrsMutators(name).set(domNode, name, value));
            }
        }

        this._domNode = domNode;

        return domNode;
    },

    mount : function() {
        var children = this._children;

        if(children) {
            var i = 0,
                len = children.length;

            while(i < len) {
                children[i++].mount();
            }
        }
    },

    unmount : function() {
        var children = this._children;

        if(children) {
            var i = 0,
                len = children.length;

            while(i < len) {
                children[i++].unmount();
            }
        }

        domEventManager.removeListeners(this._domNode);

        this._domNode = null;
        this._parentNode = null;
    },

    patch : function(node) {
        if(this.type !== node.type || this._tag !== node._tag || this._ns !== node._ns) {
            return patchOps.replace(this._parentNode, this, node);
        }

        this._patchChildren(node);
        this._patchAttrs(node);

        this._domNode && (node._domNode = this._domNode);
    },

    _patchChildren : function(node) {
        var childrenA = this._children,
            childrenB = node._children,
            hasChildrenA = childrenA && childrenA.length,
            hasChildrenB = childrenB && childrenB.length;

        if(!hasChildrenB) {
            hasChildrenA && patchOps.removeChildren(this);
            return;
        }

        if(!hasChildrenA) {
            var iB = 0;
            while(iB < childrenB.length) {
                patchOps.appendChild(this, childrenB[iB++]);
            }
            return;
        }

        var childrenALen = childrenA.length,
            childrenBLen = childrenB.length;

        if(childrenALen === 1 && childrenBLen === 1) {
            childrenA[0].patch(childrenB[0]);
            return;
        }

        var leftIdxA = 0,
            rightIdxA = childrenALen - 1,
            leftChildA = childrenA[leftIdxA],
            leftChildAKey = leftChildA._key,
            rightChildA = childrenA[rightIdxA],
            rightChildAKey = rightChildA._key,
            leftIdxB = 0,
            rightIdxB = childrenBLen - 1,
            leftChildB = childrenB[leftIdxB],
            leftChildBKey = leftChildB._key,
            rightChildB = childrenB[rightIdxB],
            rightChildBKey = rightChildB._key,
            updateLeftIdxA = false,
            updateRightIdxA = false,
            updateLeftIdxB = false,
            updateRightIdxB = false,
            childrenAIndicesToSkip = {},
            childrenAKeys, foundAChildIdx, foundAChild;

        while(leftIdxA <= rightIdxA && leftIdxB <= rightIdxB) {
            if(childrenAIndicesToSkip[leftIdxA]) {
                updateLeftIdxA = true;
            }
            else if(childrenAIndicesToSkip[rightIdxA]) {
                updateRightIdxA = true;
            }
            else if(leftChildAKey === leftChildBKey) {
                leftChildA.patch(leftChildB);
                updateLeftIdxA = true;
                updateLeftIdxB = true;
            }
            else if(rightChildAKey === rightChildBKey) {
                rightChildA.patch(rightChildB);
                updateRightIdxA = true;
                updateRightIdxB = true;
            }
            else if(leftChildAKey != null && leftChildAKey === rightChildBKey) {
                moveChild(this, leftChildA, rightChildA, true);
                leftChildA.patch(rightChildB);
                updateLeftIdxA = true;
                updateRightIdxB = true;
            }
            else if(rightChildAKey != null && rightChildAKey === leftChildBKey) {
                moveChild(this, rightChildA, leftChildA, false);
                rightChildA.patch(leftChildB);
                updateRightIdxA = true;
                updateLeftIdxB = true;
            }
            else if(leftChildAKey != null && leftChildBKey == null) {
                patchOps.insertChild(this, leftChildB, leftChildA);
                updateLeftIdxB = true;
            }
            else if(leftChildAKey == null && leftChildBKey != null) {
                patchOps.removeChild(this, leftChildA);
                updateLeftIdxA = true;
            }
            else {
                childrenAKeys || (childrenAKeys = buildKeys(childrenA, leftIdxA, rightIdxA));
                if((foundAChildIdx = childrenAKeys[leftChildBKey]) != null) {
                    foundAChild = childrenA[foundAChildIdx];
                    childrenAIndicesToSkip[foundAChildIdx] = true;
                    moveChild(this, foundAChild, leftChildA, false);
                    foundAChild.patch(leftChildB);
                }
                else {
                    patchOps.insertChild(this, leftChildB, leftChildA);
                }
                updateLeftIdxB = true;
            }

            if(updateLeftIdxA) {
                updateLeftIdxA = false;
                if(++leftIdxA <= rightIdxA) {
                    leftChildA = childrenA[leftIdxA];
                    leftChildAKey = leftChildA._key;
                }
            }

            if(updateRightIdxA) {
                updateRightIdxA = false;
                if(--rightIdxA >= leftIdxA) {
                    rightChildA = childrenA[rightIdxA];
                    rightChildAKey = rightChildA._key;
                }
            }

            if(updateLeftIdxB) {
                updateLeftIdxB = false;
                if(++leftIdxB <= rightIdxB) {
                    leftChildB = childrenB[leftIdxB];
                    leftChildBKey = leftChildB._key;
                }
            }

            if(updateRightIdxB) {
                updateRightIdxB = false;
                if(--rightIdxB >= leftIdxB) {
                    rightChildB = childrenB[rightIdxB];
                    rightChildBKey = rightChildB._key;
                }
            }
        }

        while(leftIdxA <= rightIdxA) {
            if(!childrenAIndicesToSkip[leftIdxA]) {
                patchOps.removeChild(this, childrenA[leftIdxA]);
            }
            ++leftIdxA;
        }

        while(leftIdxB <= rightIdxB) {
            rightIdxB < childrenBLen - 1?
                patchOps.insertChild(this, childrenB[leftIdxB], childrenB[rightIdxB + 1]) :
                patchOps.appendChild(this, childrenB[leftIdxB]);
            ++leftIdxB;
        }
    },

    _patchAttrs : function(node) {
        var attrsA = this._attrs,
            attrsB = node._attrs,
            attrName, attrAVal, attrBVal,
            isAttrAValArray, isAttrBValArray;

        if(attrsB) {
            for(attrName in attrsB) {
                attrBVal = attrsB[attrName];
                if(!attrsA || ((attrAVal = attrsA[attrName]) == null)) {
                    if(attrBVal != null) {
                        patchOps.updateAttr(this, attrName, attrBVal);
                    }
                }
                else if(attrBVal == null) {
                    patchOps.removeAttr(this, attrName);
                }
                else if(typeof attrBVal === 'object' && typeof attrAVal === 'object') {
                    isAttrBValArray = Array.isArray(attrBVal);
                    isAttrAValArray = Array.isArray(attrAVal);
                    if(isAttrBValArray || isAttrAValArray) {
                        if(isAttrBValArray && isAttrAValArray) {
                            this._patchAttrArr(attrName, attrAVal, attrBVal);
                        }
                        else {
                            patchOps.updateAttr(this, attrName, attrBVal);
                        }
                    }
                    else {
                        this._patchAttrObj(attrName, attrAVal, attrBVal);
                    }
                }
                else if(attrAVal !== attrBVal) {
                    patchOps.updateAttr(this, attrName, attrBVal);
                }
            }
        }

        if(attrsA) {
            for(attrName in attrsA) {
                if((!attrsB || !(attrName in attrsB)) && ((attrAVal = attrsA[attrName]) != null)) {
                    patchOps.removeAttr(this, attrName);
                }
            }
        }
    },

    _patchAttrArr : function(attrName, arrA, arrB) {
        var lenA = arrA.length,
            hasDiff = false;

        if(lenA !== arrB.length) {
            hasDiff = true;
        }
        else {
            var i = 0;
            while(!hasDiff && i < lenA) {
                if(arrA[i] != arrB[i]) {
                    hasDiff = true;
                }
                ++i;
            }
        }

        hasDiff && patchOps.updateAttr(this, attrName, arrB);
    },

    _patchAttrObj : function(attrName, objA, objB) {
        var hasDiff = false,
            diffObj = {},
            i;

        for(i in objB) {
            if(objA[i] != objB[i]) {
                hasDiff = true;
                diffObj[i] = objB[i];
            }
        }

        for(i in objA) {
            if(objA[i] != null && !(i in objB)) {
                hasDiff = true;
                diffObj[i] = null;
            }
        }

        hasDiff && patchOps.updateAttr(this, attrName, diffObj);
    }
};

function moveChild(parentNode, childNode, toChildNode, after) {
    var activeElement = doc.activeElement;
    patchOps.moveChild(parentNode, childNode, toChildNode, after);
    if(doc.activeElement !== activeElement) {
        activeElement.focus();
    }
}

function processChildren(children) {
    return children == null?
        null :
        typeof children === 'object'?
            Array.isArray(children)? children : [children] :
            [new TextNode().text(children)];
}

function buildKeys(children, idxFrom, idxTo) {
    var res = {},
        child;

    while(idxFrom < idxTo) {
        child = children[idxFrom];
        child._key != null && (res[child._key] = idxFrom);
        ++idxFrom;
    }

    return res;
}

module.exports = TagNode;
