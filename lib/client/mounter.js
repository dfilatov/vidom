var calcPatch = require('../calcPatch'),
    patchDom = require('./patchDom'),
    getDomNodeId = require('./getDomNodeId'),
    rafBatch = require('./rafBatch'),
    mountedNodes = {},
    counter = 0;

function mountToDom(domNode, tree, cb, cbCtx, syncMode) {
    var domNodeId = getDomNodeId(domNode),
        prevMounted = mountedNodes[domNodeId],
        mountId;

    if(prevMounted && prevMounted.tree) {
        var patch = calcPatch(prevMounted.tree, tree);
        if(patch.length) {
            mountId = ++prevMounted.id;
            var patchFn = function() {
                    if(mountedNodes[domNodeId] && mountedNodes[domNodeId].id === mountId) {
                        prevMounted.tree = tree;
                        patchDom(domNode.childNodes[0], patch);
                        callCb(cb, cbCtx);
                    }
                };
            syncMode? patchFn() : rafBatch(patchFn);
        }
        else if(!syncMode) {
            callCb(cb, cbCtx);
        }
    }
    else {
        mountedNodes[domNodeId] = { tree : null, id : mountId = ++counter };
        var renderFn = function() {
                if(mountedNodes[domNodeId] && mountedNodes[domNodeId].id === mountId) {
                    mountedNodes[domNodeId].tree = tree;
                    domNode.appendChild(tree.renderToDom());
                    tree.mount();
                    callCb(cb, cbCtx);
                }
            };
        syncMode? renderFn() : rafBatch(renderFn);
    }
}

function unmountFromDom(domNode, cb, cbCtx, syncMode) {
    var domNodeId = getDomNodeId(domNode),
        prevMounted = mountedNodes[domNodeId];

    if(prevMounted) {
        var mountId = ++prevMounted.id,
            unmountFn = function() {
                var mounted = mountedNodes[domNodeId];
                if(mounted && mounted.id === mountId) {
                    mounted.tree && mounted.tree.unmount();
                    delete mountedNodes[domNodeId];
                    domNode.innerHTML = '';
                    callCb(cb, cbCtx);
                }
            };

        prevMounted.tree?
            syncMode? unmountFn() : rafBatch(unmountFn) :
            syncMode || callCb(cb, cbCtx);
    }
    else if(!syncMode) {
        callCb(cb, cbCtx);
    }
}

function callCb(cb, cbCtx) {
    cb && cb.call(cbCtx || this);
}

module.exports = {
    mountToDom : function(domNode, tree, cb, cbCtx) {
        mountToDom(domNode, tree, cb, cbCtx, false);
    },

    mountToDomSync : function(domNode, tree) {
        mountToDom(domNode, tree, null, null, true);
    },

    unmountFromDom : function(domNode, cb, cbCtx) {
        unmountFromDom(domNode, cb, cbCtx, false);
    },

    unmountFromDomSync : function(domNode) {
        mountToDom(domNode, null, null, true);
    }
};
