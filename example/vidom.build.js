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
function Replace(oldNode, newNode) {
    this._oldNode = oldNode;
    this._newNode = newNode;
}

Replace.prototype = {
    applyTo : function(domNode) {
        this._oldNode.unmount();
        var newDomNode = this._newNode.renderToDom();
        domNode.parentNode.replaceChild(newDomNode, domNode);
        this._newNode.mount();
        return newDomNode;
    }
};

module.exports = Replace;

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
    calcPatch = require('./calcPatch');

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
        return [];
    }

    return calcPatch(prevRootNode, this._rootNode);
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
    var patch = this.calcPatch(this._attrs, this._children);
    patch.length && rafBatch(function() {
        this.isMounted() && this.patchDom(patch);
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

},{"./calcPatch":1,"./client/patchDom":5,"./client/rafBatch":17,"./noOp":20}],19:[function(require,module,exports){
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
var ReplaceOp = require('../client/patchOps/Replace'),
    UpdateComponentOp = require('../client/patchOps/UpdateComponent');

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

            var componentPatch = this._instance.calcPatch(node._attrs, node._children);
            node._instance = this._instance;

            componentPatch.length && patch.push(new UpdateComponentOp(this._instance, componentPatch));
        }
    }
};

module.exports = ComponentNode;

},{"../client/patchOps/Replace":12,"../client/patchOps/UpdateComponent":15}],22:[function(require,module,exports){
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
var vidom = require('../lib/vidom');

var f = true;

var C1 = vidom.createComponent({
        onMount : function() {
            console.log('onMount C1');
        },

        onUnmount : function() {
            console.log('onUnmount C1');
        },

        render : function(_, children) {
            //console.log('render C1');
            return vidom.createNode(C2)
                .children(children);
        }
    }),
    C2 = vidom.createComponent({
        onMount : function() {
            console.log('onMount C2');
            setTimeout(function() {
                this._className = 'c22';
                this.update();
            }.bind(this), 100);
        },

        onUnmount : function() {
            console.log('onUnmount C2');
        },

        render : function(_, children) {
            return vidom.createNode(f? 'div' : 'span')
                .attrs({ className : this._className || 'c2' })
                .children(children);
        }
    }),
    C3 = vidom.createComponent({
        onMount : function() {
            console.log('onMount C3');
        },

        onUnmount : function() {
            console.log('onUnmount C3');
        },

        render : function(attrs) {
            //console.log('render C3');
            return vidom.createNode('i').children(attrs.value);
        }
    }),
    C4 = vidom.createComponent({
        onMount : function() {
            console.log('onMount C4', this._domNode);
        },

        onUnmount : function() {
            console.log('onUnmount C4');
        },

        render : function(attrs) {
            return vidom.createNode('i', null, attrs.value);
        }
    });

var tree1 = vidom.createNode('div')
        .children(
            vidom.createNode(C1)
                .key(1)
                .attrs({ value : '1' })
                .children([
                    vidom.createNode(C3).key(1).attrs({ value : '1' }),
                    vidom.createNode(C3).key(2).attrs({ value : '2' }),
                    vidom.createNode(C3).key(3).attrs({ value : '3' })
                ])),
    tree2 = vidom.createNode('div')
        .children(
            vidom.createNode(C1)
                .key(1)
                .attrs({ value : '1' })
                .children([
                    vidom.createNode(C3).key(3).attrs({ value : '3' }),
                    vidom.createNode(C3).key(2).attrs({ value : '2' })
                ])),
    parentDomNode = document.body,
    root1DomNode = document.getElementById('root1');

vidom.mountToDom(root1DomNode, tree1, function() {
    f=false;
})
//vidom.mountToDom(root1DomNode, tree2);
//vidom.mountToDom(root1DomNode, tree1);
//vidom.mountToDom(root1DomNode, tree2);
//f=true;
//vidom.mountToDom(root1DomNode, tree2);
setTimeout(function() {
    //vidom.unmountFromDom(root1DomNode);
    vidom.mountToDom(root1DomNode, tree1);
}, 50);

//vidom.mountToDom(root1DomNode, tree1);
//vidom.mountToDom(root1DomNode, vidom.createNode(C4, { key : 3, attrs : { value : 'C4' } }));

},{"../lib/vidom":24}]},{},[25]);
