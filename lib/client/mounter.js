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
        mountedNodes[domNodeId] = { tree : tree, id : mountId = ++counter };
        rafBatch(function() {
            if(mountedNodes[domNodeId] && mountedNodes[domNodeId].id === mountId) {
                domNode.appendChild(tree.renderToDom());
                tree.mount();
                cb && cb.call(cbCtx || this);
            }
        });
    }
}

function unmountFromDom(domNode, cb, cbCtx) {
    var domNodeId = getDomNodeId(domNode);

    if(mountedNodes[domNodeId]) {
        var tree = mountedNodes[domNodeId].tree;
        delete mountedNodes[domNodeId];
        rafBatch(function() {
            tree.unmount();
            domNode.innerHTML = '';
            cb && cb.call(cbCtx || this);
        });
    }
}

module.exports = {
    mountToDom : mountToDom,
    unmountFromDom : unmountFromDom
};
