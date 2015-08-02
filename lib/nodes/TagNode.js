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
    this._ctx = null;
    this._ref = null;
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

    ref : function(ref) {
        this._ref = ref;
        return this;
    },

    renderToDom : function(ctx) {
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
                domNode.appendChild(children[i++].renderToDom(ctx));
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

        if(ctx) {
            this._ctx = ctx;
            this._ref && ctx.setRef(this._ref, domNode);
        }

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
    },

    patch : function(node) {
        if(this.type !== node.type || this._tag !== node._tag || this._ns !== node._ns) {
            return patchOps.replace(this, node);
        }

        this._patchChildren(node);
        this._patchAttrs(node);

        if(this._domNode) {
            node._domNode = this._domNode;
            node._ctx = this._ctx;

            if(node._ctx && node._ref) {
                node._ctx.setRef(node._ref, node._domNode);
            }
        }
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
                leftChildA.patch(rightChildB);
                patchOps.moveChild(this, leftChildA, rightChildA, true);
                updateLeftIdxA = true;
                updateRightIdxB = true;
            }
            else if(rightChildAKey != null && rightChildAKey === leftChildBKey) {
                rightChildA.patch(leftChildB);
                patchOps.moveChild(this, rightChildA, leftChildA);
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
                    foundAChild.patch(leftChildB);
                    patchOps.moveChild(this, foundAChild, leftChildA);
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
            attrName, attrAVal, attrBVal;

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
                    this._patchAttrObj(attrName, attrAVal, attrBVal);
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

function processChildren(children) {
    return typeof children === 'string'?
        [new TextNode().text(children)] :
        children && (Array.isArray(children)? children : [children]);
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
