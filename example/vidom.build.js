(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function diff(nodeA, nodeB, options, patch) {
    patch || (patch = []);

    var isNodeAText = 'text' in nodeA,
        isNodeBText = 'text' in nodeB;

    if(isNodeAText || isNodeBText) {
        if(isNodeAText && isNodeBText) {
            diffText(nodeA, nodeB, patch);
        }
        else {
            diffMixed(nodeA, nodeB, patch);
        }
    }
    else if(nodeA.tag !== nodeB.tag) {
        diffMixed(nodeA, nodeB, patch);
    }
    else {
        diffChildren(nodeA, nodeB, options, patch);
        diffAttrs(nodeA, nodeB, patch);
    }

    options && options.after && options.after(nodeA, nodeB);

    return patch;
}

function diffText(nodeA, nodeB, patch) {
    nodeA.text !== nodeB.text && patch.push({
        type : 'updateText',
        node : nodeA,
        text : nodeB.text
    });
}

function diffMixed(nodeA, nodeB, patch) {
    patch.push({
        type : 'replaceNode',
        oldNode : nodeA,
        newNode : nodeB
    });
}

function diffChildren(nodeA, nodeB, options, patch) {
    var childrenA = nodeA.children,
        childrenB = nodeB.children,
        hasChildrenA = childrenA && childrenA.length,
        hasChildrenB = childrenB && childrenB.length;

    if(!hasChildrenB) {
        hasChildrenA && patch.push({
            type : 'removeChildren',
            parentNode : nodeA
        });

        return;
    }

    var onlyAppend = !hasChildrenA,
        childrenAByKeys = {},
        areKeysACollected = false,
        skippedAIdxs = {},
        iA = 0, iB = 0,
        childA, childB;

    while(childB = childrenB[iB]) {
        if(onlyAppend) {
            patch.push({
                type : 'appendChild',
                parentNode : nodeA,
                childNode : childB
            });
        }
        else {
            if(childB.key) {
                if(!areKeysACollected) {
                    var j = 0;
                    while(childA = childrenA[j]) {
                        childA.key && (childrenAByKeys[childA.key] = { node : childA, idx : j });
                        ++j;
                    }
                    areKeysACollected = true;
                }

                if(childB.key === childrenA[iA].key) {
                    diff(childrenA[iA], childB, options, patch);
                    do {
                        iA++;
                    } while(skippedAIdxs[iA]);
                }
                else if(childA = childrenAByKeys[childB.key]) {
                    skippedAIdxs[childA.idx] = true;
                    patch.push({
                        type : 'moveChild',
                        parentNode : nodeA,
                        childNode : childA.node,
                        idx : iB
                    });
                    diff(childA.node, childB, options, patch);
                }
                else {
                    patch.push({
                        type : 'insertChild',
                        parentNode : nodeA,
                        childNode : childB,
                        idx : iB
                    });
                }
            }
            else if(childrenA[iA].key) {
                patch.push({
                    type : 'insertChild',
                    parentNode : nodeA,
                    childNode : childB,
                    idx : iB
                });
            }
            else {
                diff(childrenA[iA], childB, options, patch);
                do {
                    iA++;
                } while(skippedAIdxs[iA]);
            }

            iA >= childrenA.length && (onlyAppend = true);
        }

        ++iB;
    }

    if(hasChildrenA) {
        while(childA = childrenA[iA]) {
            skippedAIdxs[iA++] || patch.push({
                type : 'removeChild',
                parentNode : nodeA,
                childNode : childA
            });
        }
    }
}

function diffAttrs(nodeA, nodeB, patch) {
    var attrsA = nodeA.attrs,
        attrsB = nodeB.attrs,
        attrName;

    if(attrsA) {
        for(attrName in attrsA) {
            if(!attrsB || !(attrName in attrsB)) {
                patch.push({
                    type : 'removeAttr',
                    node : nodeA,
                    attrName : attrName
                });
            }
            else if(attrsA[attrName] !== attrsB[attrName]) {
                patch.push({
                    type : 'updateAttr',
                    node : nodeA,
                    attrName : attrName,
                    attrVal : attrsB[attrName]
                });
            }
        }
    }

    if(attrsB) {
        for(attrName in nodeB.attrs) {
            if(!attrsA || !(attrName in attrsA)) {
                patch.push({
                    type : 'updateAttr',
                    node : nodeA,
                    attrName : attrName,
                    attrVal : attrsB[attrName]
                });
            }
        }
    }
}

module.exports = diff;

},{}],2:[function(require,module,exports){
var renderToDom = require('./renderToDom');

function insertAt(parentNode, node, idx) {
    idx < parentNode.childNodes.length - 1?
        parentNode.insertBefore(node, parentNode.childNodes[idx + 1]) :
        parentNode.appendChild(node);
}

function applyPatch(patch) {
    var i = 0, op;
    while(op = patch[i++]) {
        //console.log(op);
        switch(op.type) {
            case 'updateText':
                getDomNode(op.node).nodeValue = op.text;
            break;

            case 'replaceNode':
                var oldNode = op.oldNode,
                    oldDomNode = getDomNode(oldNode),
                    newDomNode = renderToDom(op.newNode);

                oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
            break;

            case 'updateAttr':
                getDomNode(op.node)[op.attrName] = op.attrVal;
            break;

            case 'removeAttr':
                getDomNode(op.node).removeAttribute(op.attrName);
            break;

            case 'appendChild':
                getDomNode(op.parentNode).appendChild(renderToDom(op.childNode));
            break;

            case 'removeChild':
                getDomNode(op.parentNode).removeChild(getDomNode(op.childNode));
            break;

            case 'insertChild':
                insertAt(getDomNode(op.parentNode), renderToDom(op.childNode), op.idx);
            break;

            case 'moveChild':
                insertAt(getDomNode(op.parentNode), getDomNode(op.childNode), op.idx);
            break;

            case 'removeChildren':
                getDomNode(op.parentNode).innerHTML = '';
            break;

            default:
                throw Error('unsupported operation: ' + op.type);
        }
    }
}

function getDomNode(node) {
    var res;

    if(node.domNode) {
        res = node.domNode;
    }
    else {
        var prevNode = node;
        while(prevNode = prevNode.prev) {
            if(prevNode.domNode) {
                res = node.domNode = prevNode.domNode;
                break;
            }
        }

        if(!node.domNode) {
            res = renderToDom(node);
        }
    }

    node.prev && (node.prev = null);

    return res;
}

module.exports = applyPatch;

},{"./renderToDom":3}],3:[function(require,module,exports){
function render(node) {
    var res;

    if('text' in node) {
        res = document.createTextNode(node.text);
    }
    else {
        res = document.createElement(node.tag);
        for(var name in node.attrs) {
            res[name] = node.attrs[name];
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

    return node.domNode = res;
}

module.exports = render;

},{}],4:[function(require,module,exports){
module.exports = {
    renderToDom : require('./renderToDom'),
    calcPatch : require('./calcPatch'),
    patchDom : require('./patchDom')
};

},{"./calcPatch":1,"./patchDom":2,"./renderToDom":3}],5:[function(require,module,exports){
var vidom = require('../lib/vidom'),
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
//    vidom.patchDom(batch);
//    batch = [];
//}
//
//var tree = {
//        tag : 'a',
//        children : [
//            { tag : 'i', key : 1 },
//            { tag : 'i', key : 2 },
//            { tag : 'i', key : 3 }
//        ]
//    };
//
//document.body.appendChild(vidom.renderToDom(tree));
//
//[{
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
//        { tag : 'input', attrs : { type : 'radio', checked : false }, children : [] },
//        { tag : 'b', children : [] }
//    ]
//}
//].reduce(
//    function(treeA, treeB) {
//        scheduleUpdate(
//            vidom.calcPatch(
//                treeA,
//                treeB,
//                {
//                    after : function(nodeA, nodeB) {
//                        nodeB.prev = nodeA;
//                    }
//                }));
//        return treeB;
//    },
//    tree);


function generateTable(rowsCount, cellsCount, content) {
    var res = { tag : 'table', children : [] };
    for(var i = 0; i < rowsCount; i++) {
        for(var j = 0, tr = { tag : 'tr', key : i, children : [] }; j < cellsCount; j++) {
            tr.children.push({ tag : 'td', key : j, children : [{ text : content }] });
        }
        res.children.push(tr);
    }
    return res;
}

var tree = generateTable(100, 10, 0),
    counter = 1;

document.body.appendChild(vidom.renderToDom(tree));

function draw() {
    var prevTree = tree;
    tree = generateTable(100, 10, counter++);
    vidom.patchDom(vidom.calcPatch(prevTree, tree, { after : function(nodeA, nodeB) { nodeB.prev = nodeA; } }));
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);


},{"../lib/vidom":4}]},{},[5]);
