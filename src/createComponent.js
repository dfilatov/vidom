import noOp from './utils/noOp';
import rafBatch from './client/rafBatch';
import createNode from './createNode';
import merge from './utils/merge';
import console from './utils/console';
import emptyObj from './utils/emptyObj';
import restrictObjProp from './utils/restrictObjProp';
import { IS_DEBUG } from './utils/debug';
import isNode from './nodes/utils/isNode';
import globalHook from './globalHook';

function mountComponent() {
    this.__isMounted = true;
    this.onMount();
}

function unmountComponent() {
    this.__isMounted = false;
    this.onUnmount();
}

function patchComponent(nextAttrs, nextChildren, nextContext, callReceivers) {
    if(!this.isMounted()) {
        return;
    }

    if(callReceivers) {
        this.__prevAttrs = this.attrs;
        this.__prevChildren = this.children;
        this.__prevContext = this.context;

        const isUpdating = this.__isUpdating;

        this.__isUpdating = true;

        if(IS_DEBUG) {
            this.__isFrozen = false;
        }

        this.attrs = this.__buildAttrs(nextAttrs);

        if(IS_DEBUG) {
            this.__isFrozen = true;
        }

        this.onAttrsReceive(this.__prevAttrs);

        if(IS_DEBUG) {
            this.__isFrozen = false;
        }

        this.children = nextChildren;

        if(IS_DEBUG) {
            this.__isFrozen = true;
        }

        this.onChildrenReceive(this.__prevChildren);

        if(IS_DEBUG) {
            this.__isFrozen = false;
        }

        this.context = nextContext;

        if(IS_DEBUG) {
            Object.freeze(this.context);
            this.__isFrozen = true;
        }

        this.onContextReceive(this.__prevContext);

        this.__isUpdating = isUpdating;
    }

    if(this.__isUpdating) {
        return;
    }

    const shouldRerender = this.shouldRerender(
        this.__prevAttrs,
        this.__prevChildren,
        this.__prevState,
        this.__prevContext);

    if(IS_DEBUG) {
        const shouldRerenderResType = typeof shouldRerender;

        if(shouldRerenderResType !== 'boolean') {
            const name = this.constructor.name || 'Component';

            console.warn(`${name}#shouldRerender() should return boolean instead of ${shouldRerenderResType}`);
        }
    }

    if(shouldRerender) {
        const prevRootNode = this.getRootNode();

        this.__rootNode = this.render();
        prevRootNode.patch(this.__rootNode);
        this.onUpdate(
            this.__prevAttrs,
            this.__prevChildren,
            this.__prevState,
            this.__prevContext);
    }

    this.__prevAttrs = this.attrs;
    this.__prevChildren = this.children;
    this.__prevState = this.state;
    this.__prevContext = this.context;
}

function shouldComponentRerender() {
    return true;
}

function onComponentRender() {
    return null;
}

function renderComponentToDom(parentNs) {
    return this.getRootNode().renderToDom(parentNs);
}

function renderComponentToString() {
    return this.getRootNode().renderToString();
}

function adoptComponentDom(domNode, domIdx) {
    return this.getRootNode().adoptDom(domNode, domIdx);
}

function getComponentDomNode() {
    return this.getRootNode().getDomNode();
}

function requestChildContext() {
    return emptyObj;
}

function setComponentState(state) {
    let nextState;

    if(this.__rootNode === null) { // wasn't inited
        nextState = state === emptyObj? state : merge(this.state, state);
    }
    else {
        this.update();
        nextState = merge(this.state, state);
    }

    if(IS_DEBUG) {
        this.__isFrozen = false;
    }

    this.state = nextState;

    if(IS_DEBUG) {
        Object.freeze(this.state);
        this.__isFrozen = true;
    }
}

function renderComponent() {
    const onRenderRes = this.onRender(),
        rootNode = onRenderRes === null? createNode('!') : onRenderRes;

    if(IS_DEBUG) {
        if(!isNode(rootNode)) {
            const name = this.constructor.name || 'Component';

            throw TypeError(`vidom: ${name}#onRender must return a single node or null on the top level.`);
        }
    }

    const childCtx = this.onChildContextRequest(),
        rootNodeCtx = childCtx === emptyObj?
            this.context :
            this.context === emptyObj?
                childCtx :
                merge(this.context, childCtx);

    if(IS_DEBUG) {
        Object.freeze(rootNodeCtx);
    }

    rootNode.setCtx(rootNodeCtx);

    return rootNode;
}

function updateComponent(cb) {
    if(!this.isMounted()) {
        return;
    }

    if(this.__isUpdating) {
        if(cb) {
            rafBatch(() => cb.call(this));
        }
    }
    else {
        this.__isUpdating = true;
        rafBatch(() => {
            if(this.isMounted()) {
                this.__isUpdating = false;
                const prevRootNode = this.__rootNode;

                this.patch(this.attrs, this.children, this.context, false);

                if(cb) {
                    cb.call(this);
                }

                if(IS_DEBUG) {
                    globalHook.emit('replace', prevRootNode, this.__rootNode);
                }
            }
        });
    }
}

function getComponentRootNode() {
    return this.__rootNode === null?
        this.__rootNode = this.render() :
        this.__rootNode;
}

function isComponentMounted() {
    return this.__isMounted;
}

function onComponentRefRequest() {
    return this;
}

function buildComponentAttrs(attrs) {
    if(attrs === this.attrs) {
        return attrs;
    }

    const { defaultAttrs } = this.constructor,
        hasDefaultAttrs = defaultAttrs != null,
        res = attrs === emptyObj?
            hasDefaultAttrs? defaultAttrs : attrs :
            hasDefaultAttrs? merge(defaultAttrs, attrs) : attrs;

    if(IS_DEBUG) {
        Object.freeze(res);
    }

    return res;
}

function createComponent(props, staticProps) {
    const res = function(attrs, children, ctx) {
            if(IS_DEBUG) {
                restrictObjProp(this, 'attrs');
                restrictObjProp(this, 'children');
                restrictObjProp(this, 'state');
                restrictObjProp(this, 'context');

                this.__isFrozen = false;
            }

            this.attrs = this.__buildAttrs(attrs);
            this.children = children;
            this.state = emptyObj;
            this.context = ctx;

            if(IS_DEBUG) {
                this.__isFrozen = true;
            }

            this.__isMounted = false;
            this.__isUpdating = false;

            this.__rootNode = null;

            this.onInit();

            this.__prevAttrs = this.attrs;
            this.__prevChildren = this.children;
            this.__prevState = this.state;
            this.__prevContext = this.context;
        },
        ptp = {
            constructor : res,
            onInit : noOp,
            mount : mountComponent,
            unmount : unmountComponent,
            onMount : noOp,
            onUnmount : noOp,
            onAttrsReceive : noOp,
            onChildrenReceive : noOp,
            onContextReceive : noOp,
            shouldRerender : shouldComponentRerender,
            onRender : onComponentRender,
            onUpdate : noOp,
            isMounted : isComponentMounted,
            setState : setComponentState,
            renderToDom : renderComponentToDom,
            renderToString : renderComponentToString,
            adoptDom : adoptComponentDom,
            getDomNode : getComponentDomNode,
            getRootNode : getComponentRootNode,
            render : renderComponent,
            update : updateComponent,
            patch : patchComponent,
            onChildContextRequest : requestChildContext,
            onRefRequest : onComponentRefRequest,
            __buildAttrs : buildComponentAttrs
        };

    for(const i in props) {
        ptp[i] = props[i];
    }

    res.prototype = ptp;

    for(const i in staticProps) {
        res[i] = staticProps[i];
    }

    res['__vidom__component__'] = true;

    return res;
}

export default createComponent;
