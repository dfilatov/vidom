var getDomNodeId = require('./getDomNodeId'),
    rafBatch = require('./rafBatch'),
    mountedNodes = {},
    counter = 0;

function mountToDom(domNode, tree, cb, cbCtx, syncMode) {
    var domNodeId = getDomNodeId(domNode),
        mounted = mountedNodes[domNodeId],
        mountId;

    if(mounted && mounted.tree) {
        mountId = ++mounted.id;
        var patchFn = function() {
                if(mountedNodes[domNodeId] && mountedNodes[domNodeId].id === mountId) {
                    mounted.tree.patch(tree);
                    mounted.tree = tree;
                    callCb(cb, cbCtx);
                }
            };
        syncMode? patchFn() : rafBatch(patchFn);
    }
    else {
        mountedNodes[domNodeId] = { tree : null, id : mountId = ++counter };

        var existingDom = domNode.firstChild;
        if(existingDom) {
            mountedNodes[domNodeId].tree = tree;
            tree.adoptDom(existingDom);
            tree.mount();
            callCb(cb, cbCtx);
        }
        else {
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
}

function unmountFromDom(domNode, cb, cbCtx, syncMode) {
    var domNodeId = getDomNodeId(domNode),
        mounted = mountedNodes[domNodeId];

    if(mounted) {
        var mountId = ++mounted.id,
            unmountFn = function() {
                var mounted = mountedNodes[domNodeId];
                if(mounted && mounted.id === mountId) {
                    mounted.tree && mounted.tree.unmount();
                    delete mountedNodes[domNodeId];
                    domNode.innerHTML = '';
                    callCb(cb, cbCtx);
                }
            };

        mounted.tree?
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
        unmountFromDom(domNode, null, null, true);
    }
};
