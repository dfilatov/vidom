(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function calcPatch(treeA, treeB, res) {
    res || (res = []);
    treeA.calcPatch(treeB, res);
    return res;
}

module.exports = calcPatch;

},{}],2:[function(require,module,exports){
function setAttr(node, name, val) {
    node.setAttribute(name, '' + val);
}

function setProp(node, name, val) {
    node[name] = val;
}

function setObjProp(node, name, val) {
    var prop = node[name];
    for(var i in val) {
        prop[i] = val[i] == null? '' : val[i];
    }
}

function setPropWithCheck(node, name, val) {
    node[name] !== val && (node[name] = val);
}

function removeAttr(node, name) {
    node.removeAttribute(name);
}

function removeProp(node, name) {
    node[name] = getDefaultPropVal(node.tagName, name);
}

var defaultPropVals = {};
function getDefaultPropVal(tag, attrName) {
    var tagAttrs = defaultPropVals[tag] || (defaultPropVals[tag] = {});
    return attrName in tagAttrs?
        tagAttrs[attrName] :
        tagAttrs[attrName] = document.createElement(tag)[attrName];
}

function checkBitmask(value, bitmask) {
    return (value & bitmask) === bitmask;
}

var IS_ATTR = 1,
    IS_OBJ = 2,
    CHECK_VAL_BEFORE_SET = 4,

    DEFAULT_ATTR = '__default__',

    attrsCfg = {
        allowFullScreen : IS_ATTR,
        allowTransparency : IS_ATTR,
        charSet : IS_ATTR,
        classID : IS_ATTR,
        clipPath : IS_ATTR,
        contextMenu : IS_ATTR,
        cols : IS_ATTR,
        cx : IS_ATTR,
        cy : IS_ATTR,
        d : IS_ATTR,
        disabled : IS_ATTR,
        dx : IS_ATTR,
        dy : IS_ATTR,
        fill : IS_ATTR,
        'fill-rule' : IS_ATTR,
        fillOpacity : IS_ATTR,
        fontFamily : IS_ATTR,
        fontSize : IS_ATTR,
        form : IS_ATTR,
        formAction : IS_ATTR,
        formEncType : IS_ATTR,
        formMethod : IS_ATTR,
        formNoValidate : IS_ATTR,
        formTarget : IS_ATTR,
        fx : IS_ATTR,
        fy : IS_ATTR,
        gradientTransform : IS_ATTR,
        gradientUnits : IS_ATTR,
        height : IS_ATTR,
        hidden : IS_ATTR,
        list : IS_ATTR,
        manifest : IS_ATTR,
        markerEnd : IS_ATTR,
        markerMid : IS_ATTR,
        markerStart : IS_ATTR,
        maxLength : IS_ATTR,
        media : IS_ATTR,
        minLength : IS_ATTR,
        offset : IS_ATTR,
        opacity : IS_ATTR,
        patternContentUnits : IS_ATTR,
        patternUnits : IS_ATTR,
        points : IS_ATTR,
        preserveAspectRatio : IS_ATTR,
        r : IS_ATTR,
        role : IS_ATTR,
        rows : IS_ATTR,
        rx : IS_ATTR,
        ry : IS_ATTR,
        size : IS_ATTR,
        sizes : IS_ATTR,
        spreadMethod : IS_ATTR,
        srcSet : IS_ATTR,
        stopColor : IS_ATTR,
        stopOpacity : IS_ATTR,
        stroke : IS_ATTR,
        strokeDasharray : IS_ATTR,
        strokeLinecap : IS_ATTR,
        strokeOpacity : IS_ATTR,
        strokeWidth : IS_ATTR,
        style : IS_OBJ,
        textAnchor : IS_ATTR,
        transform : IS_ATTR,
        version : IS_ATTR,
        viewBox : IS_ATTR,
        value : CHECK_VAL_BEFORE_SET,
        width : IS_ATTR,
        wmode : IS_ATTR,
        x1 : IS_ATTR,
        x2 : IS_ATTR,
        x : IS_ATTR,
        y1 : IS_ATTR,
        y2 : IS_ATTR,
        y : IS_ATTR
    },
    attrsMutators = {};

attrsCfg[DEFAULT_ATTR] = 0;

for(var attrName in attrsCfg) {
    var attrCfg = attrsCfg[attrName],
        isAttr = checkBitmask(attrCfg, IS_ATTR);

    attrsMutators[attrName] = {
        set : isAttr?
            setAttr :
            checkBitmask(attrCfg, CHECK_VAL_BEFORE_SET)?
                setPropWithCheck :
                checkBitmask(attrCfg, IS_OBJ)?
                    setObjProp :
                    setProp,
        remove : isAttr? removeAttr : removeProp
    };
}

module.exports = function(attrName) {
    return attrsMutators[attrName] || attrsMutators[DEFAULT_ATTR];
};

},{}],3:[function(require,module,exports){
var ID_PROP = '__vidom__id__',
    counter = 1;

function getDomNodeId(node) {
    return node[ID_PROP] || (node[ID_PROP] = counter++);
}

module.exports = getDomNodeId;

},{}],4:[function(require,module,exports){
var calcPatch = require('../calcPatch'),
    patchDom = require('./patchDom'),
    getDomNodeId = require('./getDomNodeId'),
    rafBatch = require('./rafBatch'),
    mountedNodes = {},
    counter = 0;

function mountToDom(domNode, tree, cb, cbCtx) {
    var domNodeId = getDomNodeId(domNode),
        prevMounted = mountedNodes[domNodeId],
        mountId;

    if(prevMounted) {
        var patch = calcPatch(prevMounted.tree, tree);
        if(patch.length) {
            prevMounted.tree = tree;
            mountId = prevMounted.id;
            rafBatch(function() {
                if(mountedNodes[domNodeId] && mountedNodes[domNodeId].id === mountId) {
                    patchDom(domNode.childNodes[0], patch);
                    cb && cb.call(cbCtx || this);
                }
            });
        }
    }
    else {
        mountedNodes[domNodeId] = { tree : tree, id : mountId = counter++ };
        rafBatch(function() {
            if(mountedNodes[domNodeId] && mountedNodes[domNodeId].id === mountId) {
                domNode.appendChild(tree.renderToDom());
                tree.mount();
                cb && cb.call(cbCtx || this);
            }
        });
    }
}

function unmountFromDom(domNode) {
    var domNodeId = getDomNodeId(domNode);

    if(mountedNodes[domNodeId]) {
        mountedNodes[domNodeId].tree.unmount();
        domNode.innerHTML = '';
        delete mountedNodes[domNodeId];
    }
}

module.exports = {
    mountToDom : mountToDom,
    unmountFromDom : unmountFromDom
};

},{"../calcPatch":1,"./getDomNodeId":3,"./patchDom":5,"./rafBatch":17}],5:[function(require,module,exports){
function patchDom(domNode, patch) {
    var i = 0,
        len = patch.length,
        res;

    while(i < len) {
        if(res = patch[i++].applyTo(domNode)) {
            return res;
        }
    }
}

module.exports = patchDom;

},{}],6:[function(require,module,exports){
function AppendChild(childNode) {
    this._childNode = childNode;
}

AppendChild.prototype = {
    applyTo : function(domNode) {
        domNode.appendChild(this._childNode.renderToDom());
        this._childNode.mount();
    }
};

module.exports = AppendChild;

},{}],7:[function(require,module,exports){
function InsertChild(childNode, idx) {
    this._childNode = childNode;
    this._idx = idx;
}

InsertChild.prototype = {
    applyTo : function(domNode) {
        insertAt(domNode, this._childNode.renderToDom(), this._idx);
        this._childNode.mount();
    }
};

function insertAt(parentNode, node, idx) {
    idx < parentNode.childNodes.length?
        parentNode.insertBefore(node, parentNode.childNodes[idx]) :
        parentNode.appendChild(node);
}

module.exports = InsertChild;

},{}],8:[function(require,module,exports){
function MoveChild(idxFrom, idxTo) {
    this._idxFrom = idxFrom;
    this._idxTo = idxTo;
}

MoveChild.prototype = {
    applyTo : function(domNode) {
        insertAt(domNode, domNode.childNodes[this._idxFrom], this._idxTo);
    }
};

function insertAt(parentNode, node, idx) {
    idx < parentNode.childNodes.length?
        parentNode.insertBefore(node, parentNode.childNodes[idx]) :
        parentNode.appendChild(node);
}

module.exports = MoveChild;

},{}],9:[function(require,module,exports){
var domAttrsMutators = require('../domAttrsMutators');

function RemoveAttr(attrName) {
    this._attrName = attrName;
}

RemoveAttr.prototype = {
    applyTo : function(domNode) {
        domAttrsMutators(this._attrName).remove(domNode, this._attrName);
    }
};

module.exports = RemoveAttr;

},{"../domAttrsMutators":2}],10:[function(require,module,exports){
function RemoveChild(childNode, idx) {
    this._childNode = childNode;
    this._idx = idx;
}

RemoveChild.prototype = {
    applyTo : function(domNode) {
        this._childNode.unmount();
        domNode.removeChild(domNode.childNodes[this._idx]);
    }
};

module.exports = RemoveChild;

},{}],11:[function(require,module,exports){
function RemoveChildren(childNodes) {
    this._childNodes = childNodes;
}

RemoveChildren.prototype = {
    applyTo : function(domNode) {
        var j = 0,
            childNodes = this._childNodes,
            len = childNodes.length;

        while(j < len) {
            childNodes[j++].unmount();
        }

        domNode.innerHTML = '';
    }
};

module.exports = RemoveChildren;

},{}],12:[function(require,module,exports){
function AppendChild(oldNode, newNode) {
    this._oldNode = oldNode;
    this._newNode = newNode;
}

AppendChild.prototype = {
    applyTo : function(domNode) {
        this._oldNode.unmount();
        var newDomNode = this._newNode.renderToDom();
        domNode.parentNode.appendChild(newDomNode, domNode);
        this._newNode.mount();
        return newDomNode;
    }
};

module.exports = AppendChild;

},{}],13:[function(require,module,exports){
var domAttrsMutators = require('../domAttrsMutators');

function UpdateAttr(attrName, attrVal) {
    this._attrName = attrName;
    this._attrVal = attrVal;
}

UpdateAttr.prototype = {
    applyTo : function(domNode) {
        domAttrsMutators(this._attrName).set(domNode, this._attrName, this._attrVal);
    }
};

module.exports = UpdateAttr;

},{"../domAttrsMutators":2}],14:[function(require,module,exports){
var patchDom = require('../patchDom');

function UpdateChildren(children) {
    this._children = children;
}

UpdateChildren.prototype = {
    applyTo : function(domNode) {
        var j = 0,
            children = this._children,
            len = children.length,
            childDomNodes = domNode.childNodes,
            childPatch;

        while(j < len) {
            childPatch = children[j++];
            patchDom(childDomNodes[childPatch.idx], childPatch.patch);
        }
    }
};

module.exports = UpdateChildren;

},{"../patchDom":5}],15:[function(require,module,exports){
function UpdateComponent(instance, patch) {
    this._instance = instance;
    this._patch = patch;
}

UpdateComponent.prototype = {
    applyTo : function(domNode) {
        this._instance.patchDom(this._patch);
    }
};

module.exports = UpdateComponent;

},{}],16:[function(require,module,exports){
function UpdateText(text) {
    this._text = text;
}

UpdateText.prototype = {
    applyTo : function(domNode) {
        domNode.textContent = this._text;
    }
};

module.exports = UpdateText;

},{}],17:[function(require,module,exports){
var raf = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            return setTimeout(callback, 1000 / 60);
        },
    batch = [];

function applyBatch() {
    var i = 0,
        item;

    while(i < batch.length) {
        item = batch[i++];
        item.fn.call(item.fnCtx || this);
    }

    batch = [];
}

function rafBatch(fn, fnCtx) {
    batch.push({ fn : fn, fnCtx : fnCtx }) === 1 && raf(applyBatch);
}

module.exports = rafBatch;

},{}],18:[function(require,module,exports){
var noOp = require('./noOp'),
    rafBatch = require('./client/rafBatch'),
    patchDom = require('./client/patchDom'),
    calcPatch = require('./calcPatch'),
    UpdateComponentOp = require('./client/patchOps/UpdateComponent');

function mountComponent() {
    this._isMounted = true;
    this._rootNode.mount();
    this.onMount();
}

function unmountComponent() {
    this._isMounted = false;
    this._rootNode.unmount();
    this.onUnmount();
}

function calcComponentPatch(attrs, children) {
    var prevRootNode = this._rootNode;

    this._attrs = attrs;
    this._children = children;
    this._rootNode = this.render(attrs, children);

    if(!this.isMounted()) {
        return null;
    }

    var patch = calcPatch(prevRootNode, this._rootNode);

    return patch.length?
        new UpdateComponentOp(this, patch) :
        null;
}

function renderComponentToDom() {
    return this._domNode = this._rootNode.renderToDom();
}

function patchComponentDom(patch) {
    var newDomNode = patchDom(this._domNode, patch);
    newDomNode && (this._domNode = newDomNode);
    this.onUpdate();
}

function renderComponent() {
    throw Error('render() should be specified');
}

function updateComponent() {
    var patchOp = this.calcPatch(this._attrs, this._children);
    patchOp && rafBatch(function() {
        this.isMounted() && this.patchDom(patchOp);
    }, this);
}

function isComponentMounted() {
    return this._isMounted;
}

function createComponent(props, staticProps) {
    var res = function(attrs, children) {
            this._attrs = attrs;
            this._children = children;
            this._rootNode = this.render(attrs, children);
            this._domNode = null;
            this._isMounted = false;
        },
        ptp = {
            mount : mountComponent,
            unmount : unmountComponent,
            onMount : noOp,
            onUnmount : noOp,
            onUpdate : noOp,
            isMounted : isComponentMounted,
            renderToDom : renderComponentToDom,
            patchDom : patchComponentDom,
            render : renderComponent,
            update : updateComponent,
            calcPatch : calcComponentPatch
        },
        i;

    for(i in props) {
        ptp[i] = props[i];
    }

    res.prototype = ptp;

    for(i in staticProps) {
        res[i] = staticProps[i];
    }

    return res;
}

module.exports = createComponent;

},{"./calcPatch":1,"./client/patchDom":5,"./client/patchOps/UpdateComponent":15,"./client/rafBatch":17,"./noOp":20}],19:[function(require,module,exports){
var TextNode = require('./nodes/TextNode'),
    TagNode = require('./nodes/TagNode'),
    ComponentNode = require('./nodes/ComponentNode');

function createNode(type) {
    switch(typeof type) {
        case 'string':
            return new TagNode(type);

        case 'function':
            return new ComponentNode(type);

        default:
            return new TextNode();
    }
}

module.exports = createNode;

},{"./nodes/ComponentNode":21,"./nodes/TagNode":22,"./nodes/TextNode":23}],20:[function(require,module,exports){
module.exports = function noOp() {};

},{}],21:[function(require,module,exports){
var ReplaceOp = require('../client/patchOps/Replace');

function ComponentNode(component) {
    this.type = ComponentNode;
    this._component = component;
    this._key = null;
    this._attrs = null;
    this._instance = null;
    this._children = null;
}

ComponentNode.prototype = {
    key : function(key) {
        this._key = key;
        return this;
    },

    attrs : function(attrs) {
        this._attrs = attrs;
        return this;
    },

    children : function(children) {
        this._children = children;
        return this;
    },

    renderToDom : function() {
        return (this._instance || (this._instance = new this._component(this._attrs, this._children)))
            .renderToDom();
    },

    mount : function() {
        this._instance.mount();
    },

    unmount : function() {
        if(this._instance) {
            this._instance.unmount();
            this._instance = null;
        }
    },

    calcPatch : function(node, patch) {
        if(this.type !== node.type || this._component !== node._component) {
            patch.push(new ReplaceOp(this, node));
        }
        else {
            this._instance || (this._instance = new this._component(this._attrs, this._children));

            var componentPatchOp = this._instance.calcPatch(node._attrs, node._children);
            node._instance = this._instance;
            componentPatchOp && patch.push(componentPatchOp);
        }
    }
};

module.exports = ComponentNode;

},{"../client/patchOps/Replace":12}],22:[function(require,module,exports){
var ReplaceOp = require('../client/patchOps/Replace'),
    RemoveChildrenOp = require('../client/patchOps/RemoveChildren'),
    AppendChildOp = require('../client/patchOps/AppendChild'),
    InsertChildOp = require('../client/patchOps/InsertChild'),
    MoveChildOp = require('../client/patchOps/MoveChild'),
    RemoveChildOp = require('../client/patchOps/RemoveChild'),
    UpdateChildrenOp = require('../client/patchOps/UpdateChildren'),
    UpdateAttrOp = require('../client/patchOps/UpdateAttr'),
    RemoveAttrOp = require('../client/patchOps/RemoveAttr'),
    calcPatch = require('../calcPatch'),
    domAttrsMutators = require('../client/domAttrsMutators'),
    TextNode = require('./TextNode'),
    doc = document;

function TagNode(tag) {
    this.type = TagNode;
    this._tag = tag;
    this._key = null;
    this._ns = null;
    this._attrs = null;
    this._children = null;
}

TagNode.prototype = {
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

    renderToDom : function() {
        var domNode = this._ns?
                doc.createElementNS(this._ns, this._tag) :
                doc.createElement(this._tag),
            attrs = this._attrs,
            name, value;

        for(name in attrs) {
            (value = attrs[name]) != null && domAttrsMutators(name).set(domNode, name, value);
        }

        var children = this._children;

        if(children) {
            var i = 0,
                len = children.length;

            while(i < len) {
                domNode.appendChild(children[i++].renderToDom());
            }
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
    },

    calcPatch : function(node, patch) {
        if(this.type !== node.type || this._tag !== node._tag || this._ns !== node._ns) {
            patch.push(new ReplaceOp(this, node));
        }
        else {
            this._calcChildrenPatch(node, patch);
            this._calcAttrsPatch(node, patch);
        }
    },

    _calcChildrenPatch : function(node, patch) {
        var childrenA = this._children,
            childrenB = node._children,
            hasChildrenA = childrenA && childrenA.length,
            hasChildrenB = childrenB && childrenB.length;

        if(!hasChildrenB) {
            hasChildrenA && patch.push(new RemoveChildrenOp(childrenA));
            return;
        }

        if(!hasChildrenA) {
            var iB = 0;
            while(iB < childrenB.length) {
                patch.push(new AppendChildOp(childrenB[iB++]));
            }
            return;
        }

        var childrenALen = childrenA.length,
            childrenBLen = childrenB.length,
            childrenPatch = [];

        if(childrenALen === 1 && childrenBLen === 1) {
            addChildPatchToChildrenPatch(childrenA[0], childrenB[0], 0, childrenPatch);
        }
        else {
            var iA = 0,
                childA, childB,
                skippedAIndices = {},
                childrenBKeys = {},
                foundIdx, foundChildA, skippedCnt;

            iB = 0;
            while(iB < childrenBLen) {
                childB = childrenB[iB++];
                childB._key != null && (childrenBKeys[childB._key] = true);
            }

            iB = 0;
            while(iB < childrenBLen) {
                childB = childrenB[iB];

                while(skippedAIndices[iA]) {
                    ++iA;
                }

                if(iA >= childrenALen) {
                    patch.push(new AppendChildOp(childB));
                }
                else {
                    childA = childrenA[iA];
                    if(childB._key != null) {
                        if(childA._key === childB._key) {
                            addChildPatchToChildrenPatch(childA, childB, iB, childrenPatch);
                            ++iA;
                        }
                        else {
                            foundChildA = null;
                            skippedCnt = 0;
                            for(var j = iA + 1; j < childrenALen; j++) {
                                if(skippedAIndices[j]) {
                                    ++skippedCnt;
                                }
                                else if(childrenA[j]._key === childB._key) {
                                    foundIdx = j - skippedCnt + iB - iA;
                                    foundChildA = childrenA[j];
                                    skippedAIndices[j] = true;
                                    break;
                                }
                            }

                            if(foundChildA) {
                                foundIdx !== iB && patch.push(new MoveChildOp(foundIdx, iB));
                                addChildPatchToChildrenPatch(foundChildA, childB, iB, childrenPatch);
                            }
                            else if(childA._key != null && !(childrenBKeys[childA._key])) {
                                addChildPatchToChildrenPatch(childA, childB, iB, childrenPatch);
                                ++iA;
                            }
                            else {
                                patch.push(new InsertChildOp(childB, iB));
                            }
                        }
                    }
                    else if(childA._key != null) {
                        patch.push(new InsertChildOp(childB, iB));
                    }
                    else {
                        addChildPatchToChildrenPatch(childA, childB, iB, childrenPatch);
                        ++iA;
                    }
                }

                ++iB;
            }

            while(iA < childrenALen) {
                skippedAIndices[iA] || patch.push(new RemoveChildOp(childrenA[iA], iB));
                ++iA;
            }
        }

        childrenPatch.length && patch.push(new UpdateChildrenOp(childrenPatch));
    },

    _calcAttrsPatch : function(node, patch) {
        var attrsA = this._attrs,
            attrsB = node._attrs,
            attrName;

        if(attrsB) {
            for(attrName in attrsB) {
                if(!attrsA || !(attrName in attrsA) || attrsA[attrName] !== attrsB[attrName]) {
                    if(attrsB[attrName] == null) {
                        patch.push(new RemoveAttrOp(attrName));
                    }
                    else if(typeof attrsB[attrName] === 'object' && typeof attrsA[attrName] === 'object') {
                        calcAttrObjPatch(attrName, attrsA[attrName], attrsB[attrName], patch);
                    }
                    else {
                        patch.push(new UpdateAttrOp(attrName, attrsB[attrName]));
                    }
                }
            }
        }

        if(attrsA) {
            for(attrName in attrsA) {
                if((!attrsB || !(attrName in attrsB)) && attrsA[attrName] != null) {
                    patch.push(new RemoveAttrOp(attrName));
                }
            }
        }
    }
};

function calcAttrObjPatch(attrName, objA, objB, patch) {
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

    hasDiff && patch.push(new UpdateAttrOp(attrName, diffObj));
}

function addChildPatchToChildrenPatch(childA, childB, idx, childrenPatch) {
    var childPatch = [];
    calcPatch(childA, childB, childPatch);
    childPatch.length && childrenPatch.push({ idx : idx, patch : childPatch });
}

function processChildren(children) {
    return typeof children === 'string'?
        [new TextNode().text(children)] :
        children && (Array.isArray(children)? children : [children]);
}

module.exports = TagNode;

},{"../calcPatch":1,"../client/domAttrsMutators":2,"../client/patchOps/AppendChild":6,"../client/patchOps/InsertChild":7,"../client/patchOps/MoveChild":8,"../client/patchOps/RemoveAttr":9,"../client/patchOps/RemoveChild":10,"../client/patchOps/RemoveChildren":11,"../client/patchOps/Replace":12,"../client/patchOps/UpdateAttr":13,"../client/patchOps/UpdateChildren":14,"./TextNode":23}],23:[function(require,module,exports){
var ReplaceOp = require('../client/patchOps/Replace'),
    UpdateTextOp = require('../client/patchOps/UpdateText'),
    noOp = require('../noOp'),
    doc = document;

function TextNode() {
    this.type = TextNode;
    this._text = '';
    this._key = null;
}

TextNode.prototype = {
    text : function(text) {
        this._text = text;
        return this;
    },

    key : function(key) {
        this._key = key;
        return this;
    },

    renderToDom : function() {
        return doc.createTextNode(this._text);
    },

    mount : noOp,

    unmount : noOp,

    calcPatch : function(node, patch) {
        if(this.type !== node.type) {
            patch.push(new ReplaceOp(this, node));
        }
        else if(this._text !== node._text) {
            patch.push(new UpdateTextOp(node._text));
        }
    }
};

module.exports = TextNode;

},{"../client/patchOps/Replace":12,"../client/patchOps/UpdateText":16,"../noOp":20}],24:[function(require,module,exports){
var mounter = require('./client/mounter');

module.exports = {
    createComponent : require('./createComponent'),
    createNode : require('./createNode'),
    mountToDom : mounter.mountToDom,
    unmountFromDom : mounter.unmountFromDom
};

},{"./client/mounter":4,"./createComponent":18,"./createNode":19}],25:[function(require,module,exports){

},{}],26:[function(require,module,exports){
var createElement = require("./vdom/create-element.js")

module.exports = createElement

},{"./vdom/create-element.js":38}],27:[function(require,module,exports){
var diff = require("./vtree/diff.js")

module.exports = diff

},{"./vtree/diff.js":58}],28:[function(require,module,exports){
var h = require("./virtual-hyperscript/index.js")

module.exports = h

},{"./virtual-hyperscript/index.js":45}],29:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],30:[function(require,module,exports){
'use strict';

var OneVersionConstraint = require('individual/one-version');

var MY_VERSION = '7';
OneVersionConstraint('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

module.exports = EvStore;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}

},{"individual/one-version":32}],31:[function(require,module,exports){
(function (global){
'use strict';

/*global window, global*/

var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],32:[function(require,module,exports){
'use strict';

var Individual = require('./index.js');

module.exports = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}

},{"./index.js":31}],33:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":25}],34:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],35:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],36:[function(require,module,exports){
var patch = require("./vdom/patch.js")

module.exports = patch

},{"./vdom/patch.js":41}],37:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook.js")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"../vnode/is-vhook.js":49,"is-object":34}],38:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vnode/is-vnode.js")
var isVText = require("../vnode/is-vtext.js")
var isWidget = require("../vnode/is-widget.js")
var handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"../vnode/handle-thunk.js":47,"../vnode/is-vnode.js":50,"../vnode/is-vtext.js":51,"../vnode/is-widget.js":52,"./apply-properties":37,"global/document":33}],39:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],40:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("../vnode/is-widget.js")
var VPatch = require("../vnode/vpatch.js")

var render = require("./create-element")
var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"../vnode/is-widget.js":52,"../vnode/vpatch.js":55,"./apply-properties":37,"./create-element":38,"./update-widget":42}],41:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches) {
    return patchRecursive(rootNode, patches)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions) {
        renderOptions = { patch: patchRecursive }
        if (ownerDocument !== document) {
            renderOptions.document = ownerDocument
        }
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./dom-index":39,"./patch-op":40,"global/document":33,"x-is-array":35}],42:[function(require,module,exports){
var isWidget = require("../vnode/is-widget.js")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"../vnode/is-widget.js":52}],43:[function(require,module,exports){
'use strict';

var EvStore = require('ev-store');

module.exports = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};

},{"ev-store":30}],44:[function(require,module,exports){
'use strict';

module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],45:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var VNode = require('../vnode/vnode.js');
var VText = require('../vnode/vtext.js');
var isVNode = require('../vnode/is-vnode');
var isVText = require('../vnode/is-vtext');
var isWidget = require('../vnode/is-widget');
var isHook = require('../vnode/is-vhook');
var isVThunk = require('../vnode/is-thunk');

var parseTag = require('./parse-tag.js');
var softSetHook = require('./hooks/soft-set-hook.js');
var evHook = require('./hooks/ev-hook.js');

module.exports = h;

function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isHook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }


    return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
        '\n' +
        'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}

},{"../vnode/is-thunk":48,"../vnode/is-vhook":49,"../vnode/is-vnode":50,"../vnode/is-vtext":51,"../vnode/is-widget":52,"../vnode/vnode.js":54,"../vnode/vtext.js":56,"./hooks/ev-hook.js":43,"./hooks/soft-set-hook.js":44,"./parse-tag.js":46,"x-is-array":35}],46:[function(require,module,exports){
'use strict';

var split = require('browser-split');

var classIdSplit = /([\.#]?[a-zA-Z0-9_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}

},{"browser-split":29}],47:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":48,"./is-vnode":50,"./is-vtext":51,"./is-widget":52}],48:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],49:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],50:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":53}],51:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":53}],52:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],53:[function(require,module,exports){
module.exports = "2"

},{}],54:[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-thunk":48,"./is-vhook":49,"./is-vnode":50,"./is-widget":52,"./version":53}],55:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":53}],56:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":53}],57:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook")

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

},{"../vnode/is-vhook":49,"is-object":34}],58:[function(require,module,exports){
var isArray = require("x-is-array")

var VPatch = require("../vnode/vpatch")
var isVNode = require("../vnode/is-vnode")
var isVText = require("../vnode/is-vtext")
var isWidget = require("../vnode/is-widget")
var isThunk = require("../vnode/is-thunk")
var handleThunk = require("../vnode/handle-thunk")

var diffProps = require("./diff-props")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free,     // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"../vnode/handle-thunk":47,"../vnode/is-thunk":48,"../vnode/is-vnode":50,"../vnode/is-vtext":51,"../vnode/is-widget":52,"../vnode/vpatch":55,"./diff-props":57,"x-is-array":35}],59:[function(require,module,exports){
var vidom = require('../lib/vidom'),
    virtualDomH = require('virtual-dom/h'),
    virtualDomDiff = require('virtual-dom/diff'),
    virtualDomPatch = require('virtual-dom/patch'),
    virtualDomCreateElement = require('virtual-dom/create-element'),
    //react = require('react'),
    batch = [];

//function scheduleUpdate(patch) {
//    if(!batch.length) {
//        window.requestAnimationFrame(performUpdate);
//    }
//
//    batch = batch.concat(patch);
//}
//
//function performUpdate() {
//    vidom.patchDom(rootNode, batch);
//    batch = [];
//}
//
//var tree = {
//        tag : 'a'
//    };
//
//var rootNode = vidom.renderToDom(tree);
//
//document.body.appendChild(rootNode);
//
//[
//{
//        tag : 'a',
//        attrs : { disabled : true, tabIndex : 10 },
//        children : [
//            {
//                tag : 'b',
//                attrs : { className : 'aa' }
//            },
//            { tag : 'i', key : 2 },
//            { tag : 'i', children : [{ text : 'text12' }], key : 3, attrs : { className : 'test test_a' } },
//            { tag : 'i', key : 1, children : [] }
//        ]
//},
//{
//    tag : 'a',
//    children : [
//        {
//            tag : 'b',
//            attrs : { className : 'aa' },
//            children : []
//        },
//        { tag : 'i', children : [], key : 1 },
//        { tag : 'i', children : [{ text : 'text' }], key : 2 },
//        { tag : 'i', children : [{ text : 'text123' }], key : 3, attrs : { className : 'test test_a' } }
//    ]
//},
//{
//    tag : 'a',
//    children : [
//        {
//            tag : 'b',
//            attrs : { className : 'aa' },
//            children : []
//        },
//        { tag : 'i', children : [], key : 1 },
//        { tag : 'i', children : [{ text : 'text' }], key : 2 },
//        { tag : 'i', children : [{ text : 'text1234' }], key : 3, attrs : { className : 'test test_a' } }
//    ]
//},
//{
//    tag : 'a',
//    children : [
//        {
//            tag : 'b',
//            attrs : { className : 'aa' },
//            children : []
//        },
//        { tag : 'i', children : [], key : 1 },
//        { tag : 'i', children : [{ text : 'text' }], key : 2 },
//        { tag : 'i', children : [{ text : 'text12345' }], key : 3, attrs : { className : 'test test_a' } }
//    ]
//},
//
//{
//    tag : 'a',
//    attrs : { disabled : 'disabled', tabIndex : 10 },
//    children : [
//        { tag : 'i', children : [] },
//        {
//            tag : 'b',
//            children : []
//        },
//        { tag : 'a', attrs : { href : '/' }, children : [{ text : 'link' }] },
//        { tag : 'input', attrs : { type : 'radio', checked : true }, children : [] },
//        { text : 'text1' }
//    ]
//},
//{
//    tag : 'a',
//    attrs : { disabled : 'disabled', tabIndex : 10 },
//    children : [
//        { tag : 'i', children : [] },
//        {
//            tag : 'b',
//            children : []
//        },
//        { tag : 'a', children : [{ text : 'link' }] },
//        { tag : 'input', attrs : { type : 'radio', checked : false }, children : [] },
//        { tag : 'b', children : [] }
//    ]
//},
//{
//    tag : 'a',
//    attrs : { disabled : 'disabled', tabIndex : 10 },
//    children : [
//        { tag : 'i', children : [] },
//        {
//            tag : 'b',
//            children : []
//        },
//        { tag : 'a', children : [{ text : 'link2' }] },
//        { tag : 'input', attrs : { type : 'radio', checked : true, disabled : true }, children : [] },
//        { tag : 'b', children : [] }
//    ]
//}
//].reduce(
//    function(treeA, treeB) {
//        scheduleUpdate(
//            vidom.calcPatch(
//                treeA,
//                treeB
//                ));
//        return treeB;
//    },
//    tree);

var SIZE = 100,
    ITERATIONS = 21,
    rootDomNode = document.getElementById('root');

function generateTable(rowsCount, cellsCount, content, invertKeys) {
    var tableChildren = [];
    for(var i = 0, trKey; i < rowsCount; i++) {
        trKey = invertKeys? rowsCount - i - 1 : i;
        for(var j = 0, trChildren = [], key; j < cellsCount; j++) {
            key = invertKeys? cellsCount - j - 1 : j;
            trChildren.push(vidom.createNode('td').key(key).children(trKey + ' ' + key + ' ' + content));
        }
        tableChildren.push(vidom.createNode('tr').key(trKey).children(trChildren));
    }
    return vidom.createNode('table').children(tableChildren);
}

var invertKeys = false,
    tree = generateTable(SIZE, SIZE, 0, invertKeys),
    counter = 1,
    t = +new Date,
    t0 = +new Date,
    tRender = 0,
    tGenerate = 0,
    tDiff = 0,
    tPatch = 0;

vidom.mountToDom(rootDomNode, tree, function() {
    tRender = +new Date - t;
    t = +new Date;

    tree = generateTable(SIZE, SIZE, counter++, invertKeys = !invertKeys);

    tGenerate = +new Date - t;
    t = +new Date;

    vidom.mountToDom(rootDomNode, tree, function() {
        tPatch = +new Date - t;
        document.title = 'r: ' + tRender + ', g: ' + tGenerate + ', d: ' + tDiff + ', p: ' + tPatch + ', a: ' + (+new Date - t0);
    });

    tDiff = +new Date - t;
    t = +new Date;

    //}
    //console.log(JSON.stringify(patch, null, 4));
    //var t3 = +new Date;
    //document.title = Math.ceil(tDiff / ITERATIONS) + ' ' + Math.ceil(tPatch / ITERATIONS) + ' ' + Math.ceil((t3 - t0) / ITERATIONS);


});

//function generateTable(rowsCount, cellsCount, content, invertKeys) {
//    var children = [];
//    for(var i = 0, trKey; i < rowsCount; i++) {
//        trKey = invertKeys? rowsCount - i - 1 : i;
//        for(var j = 0, trChildren = [], key; j < cellsCount; j++) {
//            key = invertKeys? cellsCount - j - 1 : j;
//            trChildren.push(virtualDomH('td', { key : key }, [trKey + ' ' + key + ' ' + content]));
//        }
//        children.push(virtualDomH('tr', { key : trKey }, trChildren));
//    }
//
//    return virtualDomH('table', {}, children);
//}
//
//var invertKeys = false,
//    t = +new Date,
//    tree = generateTable(SIZE, SIZE, 0, invertKeys),
//    counter = 1,
//    rootNode = document.body.appendChild(virtualDomCreateElement(tree));
//
//function draw() {
//    var t0 = +new Date,
//        tDiff = 0,
//        tPatch = 0;
//    for(var i = 0; i < ITERATIONS; i++) {
//        var prevTree = tree;
//        tree = generateTable(SIZE, SIZE, counter++, invertKeys = !invertKeys);
//        var t1 = +new Date;
//        var patch = virtualDomDiff(prevTree, tree);
//        tDiff += +new Date - t1;
//        var t1 = +new Date;
//        virtualDomPatch(rootNode, patch);
//        tPatch += +new Date - t1;
//    }
//    //console.log(JSON.stringify(patch, null, 4));
//    var t3 = +new Date;
//    document.title = Math.ceil(tDiff / ITERATIONS) + ' ' + Math.ceil(tPatch / ITERATIONS) + ' ' + Math.ceil((t3 - t0) / ITERATIONS);
//
//    //requestAnimationFrame(draw);
//}
//
//requestAnimationFrame(draw);

//function generateTable(rowsCount, cellsCount, content, invertKeys) {
//    var tableChildren = [];
//    for(var i = 0, trKey; i < rowsCount; i++) {
//        trKey = invertKeys? rowsCount - i - 1 : i;
//        for(var j = 0, trChildren = [], key; j < cellsCount; j++) {
//            key = invertKeys? cellsCount - j - 1 : j;
//            trChildren.push(React.createElement('td', { key : key }, trKey + ' ' + key + ' ' + content));
//        }
//        tableChildren.push(React.createElement('tr', { key : trKey }, trChildren));
//    }
//    return React.createElement('table', null, React.createElement('tbody', null, tableChildren));
//}
//
//var App = React.createClass({
//        getInitialState : function() {
//            return {
//                invertKeys : false,
//                counter : 0
//            };
//        },
//
//        render : function() {
//            var t = +new Date;
//            var res = generateTable(SIZE, SIZE, this.state.counter, this.state.invertKeys);
//            document.title += ' ' + (+new Date - t);
//            return res;
//        },
//
//        componentDidMount : function() {
//            var _this = this,
//                fn = function() {
//                    _this.state.counter++;
//                    _this.state.invertKeys = !_this.state.invertKeys;
//                    var t = +new Date;
//                    _this.forceUpdate(function() {
//                        document.title += ' ' + (+new Date - t);
//                    });
//                };
//            requestAnimationFrame(fn);
//        }
//    });
//
////react.addons.Perf.start();
//React.render(React.createElement(App), rootDomNode);
////react.addons.Perf.stop();
////react.addons.Perf.printInclusive();

},{"../lib/vidom":24,"virtual-dom/create-element":26,"virtual-dom/diff":27,"virtual-dom/h":28,"virtual-dom/patch":36}]},{},[59]);
