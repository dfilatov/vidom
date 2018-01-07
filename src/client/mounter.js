import getDomNodeId from './getDomNodeId';
import rafBatch from './rafBatch';
import globalHook from '../globalHook';
import domOps from './domOps';
import { getNs } from './utils/ns';
import TopElement from '../nodes/TopElement';
import nodeToElement from '../nodes/utils/nodeToElement';
import { IS_DEBUG } from '../utils/debug';

const mountedElements = Object.create(null);
let counter = 0;

function mountToDomNode(domNode, node, ctx, cb, syncMode) {
    const domNodeId = getDomNodeId(domNode);
    let mounted = mountedElements[domNodeId],
        mountId;

    if(mounted && mounted.tree !== null) {
        mountId = ++mounted.id;
        const patchFn = () => {
            mounted = mountedElements[domNodeId];
            if(mounted && mounted.id === mountId) {
                const prevTree = mounted.tree,
                    newTree = new TopElement(nodeToElement(node));

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
        mounted = mountedElements[domNodeId] = { tree : null, id : mountId = ++counter };

        if(domNode.childNodes.length > 0) {
            const topDomChildNodes = collectTopDomChildNodes(domNode);

            if(topDomChildNodes === null) {
                domNode.textContent = '';
            }
            else {
                const tree = mounted.tree = new TopElement(nodeToElement(node));

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
            const mounted = mountedElements[domNodeId];

            if(mounted && mounted.id === mountId) {
                const tree = mounted.tree = new TopElement(nodeToElement(node));

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
    let mounted = mountedElements[domNodeId];

    if(mounted) {
        const mountId = ++mounted.id,
            unmountFn = () => {
                mounted = mountedElements[domNodeId];
                if(mounted && mounted.id === mountId) {
                    delete mountedElements[domNodeId];
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
    if(cb) {
        cb();
    }
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

    for(const domNodeId in mountedElements) {
        const { tree } = mountedElements[domNodeId];

        if(tree) {
            res.push(tree);
        }
    }

    return res;
}
