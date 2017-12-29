import getDomNodeId from './getDomNodeId';
import rafBatch from './rafBatch';
import globalHook from '../globalHook';
import domOps from './domOps';
import { getNs } from './utils/ns';
import TopNode from '../nodes/TopNode';
import isNode from '../nodes/utils/isNode';
import { IS_DEBUG } from '../utils/debug';

const mountedNodes = Object.create(null);
let counter = 0;

function mountToDomNode(domNode, node, ctx, cb, syncMode) {
    if(IS_DEBUG) {
        if(!isNode(node)) {
            throw TypeError(`vidom: Unexpected type of node is passed to mount.`);
        }
    }

    const domNodeId = getDomNodeId(domNode);
    let mounted = mountedNodes[domNodeId],
        mountId;

    if(mounted && mounted.tree !== null) {
        mountId = ++mounted.id;
        const patchFn = () => {
            mounted = mountedNodes[domNodeId];
            if(mounted && mounted.id === mountId) {
                const prevTree = mounted.tree,
                    newTree = new TopNode(node);

                newTree
                    .setNs(prevTree._ns)
                    .setCtx(ctx);

                prevTree.patch(newTree);
                mounted.tree = newTree;

                callCb(cb);
                if(IS_DEBUG) {
                    globalHook.emit('replace', prevTree, newTree);
                }
            }
        };

        syncMode? patchFn() : rafBatch(patchFn);
    }
    else {
        mounted = mountedNodes[domNodeId] = { tree : null, id : mountId = ++counter };

        if(domNode.childNodes.length > 0) {
            const topDomChildNodes = collectTopDomChildNodes(domNode);

            if(topDomChildNodes === null) {
                domNode.textContent = '';
            }
            else {
                const tree = mounted.tree = new TopNode(node);

                tree
                    .setNs(getNs(domNode))
                    .setCtx(ctx);

                tree.adoptDom(topDomChildNodes);
                tree.mount();
                callCb(cb);

                if(IS_DEBUG) {
                    globalHook.emit('mount', tree);
                }

                return;
            }
        }

        const renderFn = () => {
            const mounted = mountedNodes[domNodeId];

            if(mounted && mounted.id === mountId) {
                const tree = mounted.tree = new TopNode(node);

                tree
                    .setNs(getNs(domNode))
                    .setCtx(ctx);

                domOps.append(domNode, tree.renderToDom());
                tree.mount();
                callCb(cb);
                if(IS_DEBUG) {
                    globalHook.emit('mount', tree);
                }
            }
        };

        syncMode? renderFn() : rafBatch(renderFn);
    }
}

function unmountFromDomNode(domNode, cb, syncMode) {
    const domNodeId = getDomNodeId(domNode);
    let mounted = mountedNodes[domNodeId];

    if(mounted) {
        const mountId = ++mounted.id,
            unmountFn = () => {
                mounted = mountedNodes[domNodeId];
                if(mounted && mounted.id === mountId) {
                    delete mountedNodes[domNodeId];
                    const tree = mounted.tree;

                    if(tree !== null) {
                        const treeDomNode = tree.getDomNode();

                        tree.unmount();
                        domOps.remove(treeDomNode);
                    }

                    callCb(cb);
                    if(IS_DEBUG) {
                        tree && globalHook.emit('unmount', tree);
                    }
                }
            };

        mounted.tree?
            syncMode? unmountFn() : rafBatch(unmountFn) :
            syncMode || callCb(cb);
    }
    else if(!syncMode) {
        callCb(cb);
    }
}

function callCb(cb) {
    cb && cb();
}

function collectTopDomChildNodes(node) {
    const childNodes = node.childNodes,
        len = childNodes.length;
    let i = 0,
        res = null,
        childNode;

    while(i < len) {
        childNode = childNodes[i++];

        if(res) {
            res.push(childNode);
        }
        else if(childNode.nodeType === Node.COMMENT_NODE && childNode.textContent === 'vidom') {
            res = [];
        }
    }

    return res;
}

export function mount(domNode, tree, ctx, cb) {
    if(typeof ctx === 'function') {
        cb = ctx;
        ctx = this;
    }

    mountToDomNode(domNode, tree, ctx, cb, false);
}

export function mountSync(domNode, tree, ctx) {
    mountToDomNode(domNode, tree, ctx, null, true);
}

export function unmount(domNode, cb) {
    unmountFromDomNode(domNode, cb, false);
}

export function unmountSync(domNode) {
    unmountFromDomNode(domNode, null, true);
}

export function getMountedRootNodes() {
    const res = [];

    for(const domNodeId in mountedNodes) {
        const { tree } = mountedNodes[domNodeId];

        if(tree) {
            res.push(tree);
        }
    }

    return res;
}
