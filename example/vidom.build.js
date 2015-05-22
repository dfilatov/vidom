(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function diff(nodeA, nodeB, path, patch) {
    var isNodeAText = 'text' in nodeA,
        isNodeBText = 'text' in nodeB;

    if(isNodeAText || isNodeBText) {
        if(isNodeAText && isNodeBText) {
            diffText(nodeA, nodeB, path, patch);
        }
        else {
            diffMixed(nodeA, nodeB, path, patch);
        }
    }
    else if(nodeA.tag !== nodeB.tag) {
        diffMixed(nodeA, nodeB, path, patch);
    }
    else {
        diffChildren(nodeA, nodeB, path, patch);
        diffAttrs(nodeA, nodeB, path, patch);
    }

    return patch;
}

function diffText(nodeA, nodeB, path, patch) {
    nodeA.text !== nodeB.text && patch.push({
        type : 'updateText',
        path : path,
        text : nodeB.text
    });
}

function diffMixed(nodeA, nodeB, path, patch) {
    patch.push({
        type : 'replaceNode',
        path : path,
        newNode : nodeB
    });
}

function increaseIndices(children, from, to) {
    for(var key in children) {
        if(children[key].idx >= from && (!to || children[key].idx <= to)) {
            ++children[key].idx;
        }
    }
}

function diffChildren(nodeA, nodeB, path, patch) {
    var childrenA = nodeA.children,
        childrenB = nodeB.children,
        hasChildrenA = childrenA && childrenA.length,
        hasChildrenB = childrenB && childrenB.length;

    if(!hasChildrenB) {
        hasChildrenA && patch.push({
            type : 'removeChildren',
            path : path
        });

        return;
    }

    var children = hasChildrenA? childrenA.slice() : null,
        onlyAppend = !hasChildrenA,
        iA = 0, iB = 0,
        childB;

    while(childB = childrenB[iB]) {
        if(onlyAppend) {
            patch.push({
                type : 'appendChild',
                path : path,
                childNode : childB
            });
        }
        else {
            if(childB.key) {
                if(childB.key === children[iB].key) {
                    diff(children[iB], childB, appendToPath(path, iB), patch);
                }
                else {
                    var foundIdx = null;
                    for(var i = iB + 1; i < children.length; i++) {
                        if(children[i].key === childB.key) {
                            foundIdx = i;
                            break;
                        }
                    }

                    if(foundIdx !== null) {
                        patch.push({
                            type : 'moveChild',
                            path : path,
                            idxFrom : foundIdx,
                            idxTo : iB
                        });
                        children.splice(iB, 0, children[foundIdx]);
                        children.splice(foundIdx + 1, 1);
                        diff(children[iB], childB, appendToPath(path, iB), patch);
                    }
                    else {
                        patch.push({
                            type : 'insertChild',
                            path : path,
                            idx : iB,
                            childNode : childB
                        });
                        children.splice(iB, 0, childB);
                    }
                }
            }
            else if(children[iB].key) {
                patch.push({
                    type : 'insertChild',
                    path : path,
                    idx : iB,
                    childNode : childB
                });
                children.splice(iB, 0, childB);
            }
            else {
                diff(childrenA[iA], childB, appendToPath(path, iB), patch);
            }

            iB >= children.length && (onlyAppend = true);
        }

        ++iB;
    }

    if(hasChildrenA) {
        var idx = iB;
        while(iB++ < children.length) {
            patch.push({
                type : 'removeChild',
                path : path,
                idx : idx
            });
        }
    }
}

function diffAttrs(nodeA, nodeB, path, patch) {
    var attrsA = nodeA.attrs,
        attrsB = nodeB.attrs,
        attrName;

    if(attrsA) {
        for(attrName in attrsA) {
            if(!attrsB || !(attrName in attrsB)) {
                patch.push({
                    type : 'removeAttr',
                    path : path,
                    attrName : attrName
                });
            }
            else if(attrsA[attrName] !== attrsB[attrName]) {
                patch.push({
                    type : 'updateAttr',
                    path : path,
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
                    path : path,
                    attrName : attrName,
                    attrVal : attrsB[attrName]
                });
            }
        }
    }
}

function appendToPath(path, idx) {
    return path + '.' + idx;
}

module.exports = function(treeA, treeB) {
    return diff(treeA, treeB, '', []);
};

},{}],2:[function(require,module,exports){
var renderToDom = require('./renderToDom');

function insertAt(parentNode, node, idx) {
    console.log(parentNode, node, idx);
    idx < parentNode.childNodes.length - 1?
        parentNode.insertBefore(node, parentNode.childNodes[idx]) :
        parentNode.appendChild(node);
}

function applyPatch(node, patch) {
    var i = 0, op;
    while(op = patch[i++]) {
        //console.log(op);
        var domNode = getDomNode(node, op.path);
        switch(op.type) {
            case 'updateText':
                domNode.nodeValue = op.text;
            break;

            case 'replaceNode':
                domNode.parentNode.replaceChild(renderToDom(op.newNode), domNode);
            break;

            case 'updateAttr':
                domNode[op.attrName] = op.attrVal;
            break;

            case 'removeAttr':
                domNode.removeAttribute(op.attrName);
            break;

            case 'appendChild':
                domNode.appendChild(renderToDom(op.childNode));
            break;

            case 'removeChild':
                domNode.removeChild(domNode.childNodes[op.idx]);
            break;

            case 'insertChild':
                insertAt(domNode, renderToDom(op.childNode), op.idx);
            break;

            case 'moveChild':
                insertAt(domNode, domNode.childNodes[op.idxFrom], op.idxTo);
            break;

            case 'removeChildren':
                domNode.innerHTML = '';
            break;

            default:
                throw Error('unsupported operation: ' + op.type);
        }
    }
}

function getDomNode(tree, idx) {
    var path = idx.split('.'),
        i = 1,
        res = tree;

    while(i < path.length) {
        res = res.childNodes[path[i++]];
    }

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

    return res;
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

var rootNode = document.body.appendChild(vidom.renderToDom(tree));

function draw() {
    var prevTree = tree;
    tree = generateTable(100, 10, counter++);
    vidom.patchDom(rootNode, vidom.calcPatch(prevTree, tree, { after : function(nodeA, nodeB) { nodeB.prev = nodeA; } }));
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);

},{"../lib/vidom":4}]},{},[5]);
