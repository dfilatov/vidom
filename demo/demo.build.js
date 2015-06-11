(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var patchOps = require('./patchOps');

function diff(nodeA, nodeB, patch) {
    var isNodeAText = 'text' in nodeA,
        isNodeBText = 'text' in nodeB;

    if(isNodeAText || isNodeBText) {
        patch.push(isNodeAText && isNodeBText && nodeA.text !== nodeB.text?
            {
                type : patchOps.UPDATE_TEXT,
                text : nodeB.text
            } :
            {
                type : patchOps.REPLACE,
                newNode : nodeB
            });
    }
    else if(nodeA.tag !== nodeB.tag || nodeA.ns !== nodeB.ns) {
        patch.push({
            type : patchOps.REPLACE,
            newNode : nodeB
        });
    }
    else {
        diffChildren(nodeA, nodeB, patch);
        diffAttrs(nodeA, nodeB, patch);
    }
}

function diffChildren(nodeA, nodeB, patch) {
    var childrenA = nodeA.children,
        childrenB = nodeB.children,
        hasChildrenA = childrenA && childrenA.length,
        hasChildrenB = childrenB && childrenB.length;

    if(!hasChildrenB) {
        hasChildrenA && patch.push({ type : patchOps.REMOVE_CHILDREN });
        return;
    }

    var iA = 0, iB = 0,
        childA, childB,
        skippedAIndices = {},
        childrenBKeys = {},
        childrenPatch = [];

    while(iB < childrenB.length) {
        childB = childrenB[iB++];
        'key' in childB && (childrenBKeys[childB.key] = true);
    }

    iB = 0;
    while(iB < childrenB.length) {
        childB = childrenB[iB];

        while(skippedAIndices[iA]) {
            ++iA;
        }

        if(!hasChildrenA || iA >= childrenA.length) {
            patch.push({
                type : patchOps.APPEND_CHILD,
                childNode : childB
            });
        }
        else {
            childA = childrenA[iA];
            if('key' in childB) {
                if(childA.key === childB.key) {
                    addChildPatchToChildrenPatch(childA, childB, iB, childrenPatch);
                    ++iA;
                }
                else {
                    var foundIdx, foundChildA,
                        skippedCnt = 0;
                    for(var j = iA + 1; j < childrenA.length; j++) {
                        if(skippedAIndices[j]) {
                            ++skippedCnt;
                        }
                        else if(childrenA[j].key === childB.key) {
                            foundIdx = j - skippedCnt + iB - iA;
                            foundChildA = childrenA[j];
                            skippedAIndices[j] = true;
                            break;
                        }
                    }

                    if(foundChildA) {
                        foundIdx !== iB && patch.push({
                            type : patchOps.MOVE_CHILD,
                            idxFrom : foundIdx,
                            idxTo : iB
                        });
                        addChildPatchToChildrenPatch(foundChildA, childB, iB, childrenPatch);
                    }
                    else if('key' in childA && !(childrenBKeys[childA.key])) {
                        addChildPatchToChildrenPatch(childA, childB, iB, childrenPatch);
                        ++iA;
                    }
                    else {
                        patch.push({
                            type : patchOps.INSERT_CHILD,
                            idx : iB,
                            childNode : childB
                        });
                    }
                }
            }
            else if('key' in childA) {
                patch.push({
                    type : patchOps.INSERT_CHILD,
                    idx : iB,
                    childNode : childB
                });
            }
            else {
                addChildPatchToChildrenPatch(childA, childB, iB, childrenPatch);
                ++iA;
            }
        }

        ++iB;
    }

    if(hasChildrenA) {
        var idx = iB;
        while(iA < childrenA.length) {
            skippedAIndices[iA++] || patch.push({
                type : patchOps.REMOVE_CHILD,
                idx : idx
            });
        }
    }

    childrenPatch.length && patch.push({
        type : patchOps.UPDATE_CHILDREN,
        children : childrenPatch
    });
}

function addChildPatchToChildrenPatch(childA, childB, idx, childrenPatch) {
    var childPatch = [];
    diff(childA, childB, childPatch);
    childPatch.length && childrenPatch.push({ idx : idx, patch : childPatch });
}

function diffAttrs(nodeA, nodeB, patch) {
    var attrsA = nodeA.attrs,
        attrsB = nodeB.attrs,
        attrName;

    if(attrsB) {
        for(attrName in attrsB) {
            if(!attrsA || !(attrName in attrsA) || attrsA[attrName] !== attrsB[attrName]) {
                if(attrsB[attrName] == null) {
                    patch.push({
                        type : patchOps.REMOVE_ATTR,
                        attrName : attrName
                    });
                }
                else if(typeof attrsB[attrName] === 'object' && typeof attrsA[attrName] === 'object') {
                    diffAttrObj(attrName, attrsA[attrName], attrsB[attrName], patch);
                }
                else {
                    patch.push({
                        type : patchOps.UPDATE_ATTR,
                        attrName : attrName,
                        attrVal : attrsB[attrName]
                    });
                }
            }
        }
    }

    if(attrsA) {
        for(attrName in attrsA) {
            if((!attrsB || !(attrName in attrsB)) && attrsA[attrName] != null) {
                patch.push({
                    type : patchOps.REMOVE_ATTR,
                    attrName : attrName
                });
            }
        }
    }
}

function diffAttrObj(attrName, objA, objB, patch) {
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

    hasDiff && patch.push({
        type : patchOps.UPDATE_ATTR,
        attrName : attrName,
        attrVal : diffObj
    });
}

module.exports = function(treeA, treeB) {
    var res = [];
    diff(treeA, treeB, res);
    return res;
};

},{"./patchOps":4}],2:[function(require,module,exports){
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
var renderToDom = require('./renderToDom'),
    patchOps = require('./patchOps'),
    domAttrsMutators = require('./domAttrsMutators');

function applyPatch(domNode, patch) {
    var i = 0, op;
    while(i < patch.length) {
        op = patch[i++];
        //console.log(op);
        switch(op.type) {
            case patchOps.UPDATE_TEXT:
                domNode.nodeValue = op.text;
            break;

            case patchOps.UPDATE_ATTR:
                domAttrsMutators(op.attrName).set(domNode, op.attrName, op.attrVal);
            break;

            case patchOps.REMOVE_ATTR:
                domAttrsMutators(op.attrName).remove(domNode, op.attrName);
            break;

            case patchOps.REPLACE:
                domNode.parentNode.replaceChild(renderToDom(op.newNode), domNode);
            break;

            case patchOps.APPEND_CHILD:
                domNode.appendChild(renderToDom(op.childNode));
            break;

            case patchOps.REMOVE_CHILD:
                domNode.removeChild(domNode.childNodes[op.idx]);
                break;

            case patchOps.INSERT_CHILD:
                insertAt(domNode, renderToDom(op.childNode), op.idx);
            break;

            case patchOps.MOVE_CHILD:
                insertAt(domNode, domNode.childNodes[op.idxFrom], op.idxTo);
            break;

            case patchOps.REMOVE_CHILDREN:
                domNode.innerHTML = '';
            break;

            case patchOps.UPDATE_CHILDREN:
                var j = 0, childPatch;
                while(j < op.children.length) {
                    childPatch = op.children[j++];
                    applyPatch(domNode.childNodes[childPatch.idx], childPatch.patch);
                }
            break;

            default:
                throw Error('unsupported operation: ' + op.type);
        }
    }
}

function insertAt(parentNode, node, idx) {
    idx < parentNode.childNodes.length?
        parentNode.insertBefore(node, parentNode.childNodes[idx]) :
        parentNode.appendChild(node);
}

module.exports = applyPatch;

},{"./domAttrsMutators":2,"./patchOps":4,"./renderToDom":5}],4:[function(require,module,exports){
module.exports = {
    UPDATE_TEXT : 1,
    UPDATE_ATTR : 2,
    REMOVE_ATTR : 3,
    REPLACE : 4,
    APPEND_CHILD : 5,
    REMOVE_CHILD : 6,
    INSERT_CHILD : 7,
    MOVE_CHILD : 8,
    REMOVE_CHILDREN : 9,
    UPDATE_CHILDREN : 10
};

},{}],5:[function(require,module,exports){
var domAttrSetter = require('./domAttrsMutators');

function render(node) {
    var res;

    if('text' in node) {
        res = document.createTextNode(node.text);
    }
    else {
        res = node.ns?
            document.createElementNS(node.ns, node.tag) :
            document.createElement(node.tag);

        var name, value;
        for(name in node.attrs) {
            (value = node.attrs[name]) != null && domAttrSetter(name).set(res, name, node.attrs[name]);
        }

        var children = node.children;
        if(children) {
            var i = 0,
                len = children.length;
            while(i < len) {
                res.appendChild(render(children[i++]));
            }
        }
    }

    return res;
}

module.exports = render;

},{"./domAttrsMutators":2}],6:[function(require,module,exports){
module.exports = {
    renderToDom : require('./renderToDom'),
    calcPatch : require('./calcPatch'),
    patchDom : require('./patchDom')
};

},{"./calcPatch":1,"./patchDom":3,"./renderToDom":5}],7:[function(require,module,exports){
var vidom = require('../lib/vidom'),
    users = [
        { login : 'dmitry', online : false },
        { login : 'vitaly', online : false },
        { login : 'alexey', online : false },
        { login : 'vadim', online : false },
        { login : 'olga', online : false },
        { login : 'petr', online : false },
        { login : 'marta', online : false },
        { login : 'olesya', online : false },
        { login : 'yuri', online : false },
        { login : 'sergey', online : false },
        { login : 'inna', online : false }
    ],
    tree = buildTree(sortUsers()),
    rootDomNode = document.body.appendChild(vidom.renderToDom(tree));

function updateUsersStates() {
    users.forEach(function(user) {
        user.online = Math.random() > .5;
    });
}

function sortUsers() {
    return users
        .slice()
        .sort(function(user1, user2) {
            return user1.online === user2.online?
                user1.login.localeCompare(user2.login) :
                user2.online - user1.online;
        })
        .map(function(user) {
            return user.login;
        });
}

function buildTree(sortOrder) {
    var onlineUsers = users.filter(function(user) {
            return user.online;
        }),
        offlineUsers = users.filter(function(user) {
            return !user.online;
        });

    return {
        tag : 'div',
        attrs : { className : 'users' },
        children : users.map(function(user) {
            return {
                tag : 'div',
                key : user.login,
                attrs : {
                    className : 'user' + (user.online? ' user_online' : ''),
                    style : {
                        transform : 'translateY(' + (sortOrder.indexOf(user.login) * 30) + 'px)'
                    }
                },
                children : [{ text : user.login }]
            };
        }).concat({
            tag : 'div',
            key : '__delimiter__',
            attrs : {
                className : 'delimiter' + (onlineUsers.length && offlineUsers.length?
                    ' delimiter_visible' :
                    ''),
                style : {
                    transform : 'translateY(' + (onlineUsers.length * 30) + 'px)'
                }
            }
        })
    };
}

function update() {
    requestAnimationFrame(function() {
        updateUsersStates();
        vidom.patchDom(rootDomNode, vidom.calcPatch(tree, tree = buildTree(sortUsers())));
        setTimeout(update, 3000);
    });
}

update();

},{"../lib/vidom":6}]},{},[7]);
