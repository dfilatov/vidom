import getDomNodeId from './getDomNodeId';
import rafBatch from './rafBatch';
import globalHook from '../globalHook';
import domOps from './domOps';
import { getNs } from './utils/ns';
import TopNode from '../nodes/TopNode';
import isNode from '../nodes/utils/isNode';
import { IS_DEBUG } from '../utils/debug';
import SimpleMap from '../utils/SimpleMap';

const mountedNodes = new SimpleMap();
let counter = 0;

function mountToDomNode(domNode, node, ctx, cb, syncMode) {
    if(IS_DEBUG) {
        if(!isNode(node)) {
            throw TypeError(`Unexpected type of node is passed to mount. Only a virtual node is expected to be here.`);
        }
    }

    const domNodeId = getDomNodeId(domNode);
    let mounted = mountedNodes.get(domNodeId),
        mountId;

    if(mounted && mounted.tree) {
        mountId = ++mounted.id;
        const patchFn = () => {
            mounted = mountedNodes.get(domNodeId);
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
        mountedNodes.set(domNodeId, mounted = { tree : null, id : mountId = ++counter });

        if(domNode.childNodes.length) {
            const topDomChildNodes = collectTopDomChildNodes(domNode);

            if(topDomChildNodes) {
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
            else {
                domNode.textContent = '';
            }
        }

        const renderFn = () => {
            const mounted = mountedNodes.get(domNodeId);

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
    let mounted = mountedNodes.get(domNodeId);

    if(mounted) {
        const mountId = ++mounted.id,
            unmountFn = () => {
                mounted = mountedNodes.get(domNodeId);
                if(mounted && mounted.id === mountId) {
                    mountedNodes.delete(domNodeId);
                    const tree = mounted.tree;

                    if(tree) {
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
        res,
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

    mountedNodes.forEach(({ tree }) => {
        if(tree) {
            res.push(tree);
        }
    });

    return res;
}
