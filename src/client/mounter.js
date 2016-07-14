import getDomNodeId from './getDomNodeId';
import rafBatch from './rafBatch';
import globalHook from '../globalHook';
import domOps from './domOps';
import { getNs } from './utils/ns';
import TopNode from '../nodes/TopNode';
import { IS_DEBUG } from '../utils/debug';
import SimpleMap from '../utils/SimpleMap';

const mountedNodes = new SimpleMap();
let counter = 0;

function mount(domNode, node, cb, cbCtx, syncMode) {
    let domNodeId = getDomNodeId(domNode),
        mounted = mountedNodes.get(domNodeId),
        mountId;

    if(mounted && mounted.tree) {
        mountId = ++mounted.id;
        const patchFn = () => {
            mounted = mountedNodes.get(domNodeId);
            if(mounted && mounted.id === mountId) {
                const prevTree = mounted.tree,
                    newTree = new TopNode(node, prevTree._ns);

                prevTree.patch(newTree);
                mounted.tree = newTree;

                callCb(cb, cbCtx);
                if(IS_DEBUG) {
                    globalHook.emit('replace', prevTree, newTree);
                }
            }
        };

        syncMode? patchFn() : rafBatch(patchFn);
    }
    else {
        mountedNodes.set(domNodeId, mounted = { tree : null, id : mountId = ++counter });

        if(domNode.children.length) {
            const tree = mounted.tree = new TopNode(node, getNs(domNode));

            tree.adoptDom(collectTopDomChildren(domNode));
            tree.mount();
            callCb(cb, cbCtx);
            if(IS_DEBUG) {
                globalHook.emit('mount', tree);
            }
        }
        else {
            const renderFn = () => {
                const mounted = mountedNodes.get(domNodeId);

                if(mounted && mounted.id === mountId) {
                    const tree = mounted.tree = new TopNode(node, getNs(domNode));

                    domOps.append(domNode, tree.renderToDom());
                    tree.mount();
                    callCb(cb, cbCtx);
                    if(IS_DEBUG) {
                        globalHook.emit('mount', tree);
                    }
                }
            };

            syncMode? renderFn() : rafBatch(renderFn);
        }
    }
}

function unmount(domNode, cb, cbCtx, syncMode) {
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

                    callCb(cb, cbCtx);
                    if(IS_DEBUG) {
                        tree && globalHook.emit('unmount', tree);
                    }
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

function collectTopDomChildren(node) {
    const children = node.childNodes,
        len = children.length,
        res = [];
    let i = 0,
        nodeType;

    while(i < len) {
        nodeType = children[i].nodeType;

        if(nodeType === Node.ELEMENT_NODE || nodeType === Node.COMMENT_NODE) {
            res.push(children[i]);
        }

        i++;
    }

    return res;
}

export function mountToDom(domNode, tree, cb, cbCtx) {
    mount(domNode, tree, cb, cbCtx, false);
}

export function mountToDomSync(domNode, tree) {
    mount(domNode, tree, null, null, true);
}

export function unmountFromDom(domNode, cb, cbCtx) {
    unmount(domNode, cb, cbCtx, false);
}

export function unmountFromDomSync(domNode) {
    unmount(domNode, null, null, true);
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
