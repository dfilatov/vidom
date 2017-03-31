import noOp from './utils/noOp';
import rafBatch from './client/rafBatch';
import createNode from './createNode';
import merge from './utils/merge';
import console from './utils/console';
import emptyObj from './utils/emptyObj';
import restrictObjProp from './utils/restrictObjProp';
import { IS_DEBUG } from './utils/debug';
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

    nextAttrs = this.__buildAttrs(nextAttrs);

    const prevAttrs = this.attrs,
        prevChildren = this.children,
        prevContext = this.context;

    if(callReceivers) {
        const isUpdating = this.__isUpdating;

        this.__isUpdating = true;

        if(IS_DEBUG) {
            this.__isFrozen = false;
        }

        this.attrs = nextAttrs;

        if(IS_DEBUG) {
            this.__isFrozen = true;
        }

        this.onAttrsReceive(prevAttrs);

        if(IS_DEBUG) {
            this.__isFrozen = false;
        }

        this.children = nextChildren;

        if(IS_DEBUG) {
            this.__isFrozen = true;
        }

        this.onChildrenReceive(prevChildren);

        if(IS_DEBUG) {
            this.__isFrozen = false;
        }

        this.context = nextContext;

        if(IS_DEBUG) {
            Object.freeze(this.context);
            this.__isFrozen = true;
        }

        this.onContextReceive(prevContext);

        this.__isUpdating = isUpdating;
    }

    if(this.__isUpdating) {
        return;
    }

    const shouldUpdate = this.shouldUpdate(prevAttrs, prevChildren, this.__prevState, prevContext);

    if(IS_DEBUG) {
        const shouldUpdateResType = typeof shouldUpdate;

        if(shouldUpdateResType !== 'boolean') {
            console.warn(`Component#shouldUpdate() should return boolean instead of ${shouldUpdateResType}`);
        }
    }

    if(shouldUpdate) {
        const prevRootNode = this.__rootNode;

        this.__rootNode = this.render();
        prevRootNode.patch(this.__rootNode);
        this.onUpdate(prevAttrs, prevChildren, this.__prevState, prevContext);
    }
}

function shouldComponentUpdate() {
    return true;
}

function onComponentRender() {
    return null;
}

function renderComponentToDom(parentNs) {
    return this.__rootNode.renderToDom(parentNs);
}

function renderComponentToString() {
    return this.__rootNode.renderToString();
}

function adoptComponentDom(domNode, domIdx) {
    return this.__rootNode.adoptDom(domNode, domIdx);
}

function getComponentDomNode() {
    return this.__rootNode.getDomNode();
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
        this.update(this.state === this.__prevState? updateComponentPrevState : null);
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

function updateComponentPrevState() {
    this.__prevState = this.state;
}

function renderComponent() {
    const onRenderRes = this.onRender(),
        rootNode = onRenderRes === null? createNode('!') : onRenderRes;

    if(IS_DEBUG) {
        if(typeof rootNode !== 'object' || Array.isArray(rootNode)) {
            throw TypeError('vidom: Component#onRender must return a single node on the top level or null.');
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
    if(this.__isUpdating) {
        cb && rafBatch(() => cb.call(this));
    }
    else {
        this.__isUpdating = true;
        rafBatch(() => {
            if(this.isMounted()) {
                this.__isUpdating = false;
                const prevRootNode = this.__rootNode;

                this.patch(this.attrs, this.children, this.context, false);
                cb && cb.call(this);
                if(IS_DEBUG) {
                    globalHook.emit('replace', prevRootNode, this.__rootNode);
                }
            }
        });
    }
}

function getComponentRootNode() {
    return this.__rootNode;
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

            this.onInit();

            this.__prevState = this.state;
            this.__rootNode = this.render();
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
            shouldUpdate : shouldComponentUpdate,
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
