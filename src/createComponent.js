import noOp from './utils/noOp';
import rafBatch from './client/rafBatch';
import createNode from './createNode';
import merge from './utils/merge';
import console from './utils/console';
import emptyObj from './utils/emptyObj';
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

function patchComponent(nextAttrs, nextChildren, nextContext) {
    if(!this.isMounted()) {
        return;
    }

    nextAttrs = this.__buildAttrs(nextAttrs);

    const prevAttrs = this.attrs,
        prevChildren = this.children;

    if(prevAttrs !== nextAttrs || prevChildren !== nextChildren) {
        const isUpdating = this.__isUpdating;

        this.__isUpdating = true;

        if(prevAttrs !== nextAttrs) {
            this.attrs = nextAttrs;
            this.onAttrsChange(prevAttrs);
        }

        if(prevChildren !== nextChildren) {
            this.children = nextChildren;
            this.onChildrenChange(prevChildren);
        }

        this.__isUpdating = isUpdating;
    }

    if(this.context !== nextContext) {
        this.context = nextContext;
    }

    if(this.__isUpdating) {
        return;
    }

    const shouldUpdate = this.shouldUpdate(prevAttrs, prevChildren, this.__prevState);

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
        this.onUpdate(prevAttrs, prevChildren, this.__prevState);
    }
}

function shouldComponentUpdate() {
    return true;
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
    if(this.__rootNode) { // was inited
        this.update(this.state === this.__prevState? updateComponentPrevState : null);
        this.state = merge(this.state, state);
    }
    else {
        this.state = state === emptyObj? state : merge(this.state, state);
    }
}

function updateComponentPrevState() {
    this.__prevState = this.state;
}

function renderComponent() {
    const rootNode = this.onRender() || createNode('!');

    if(IS_DEBUG) {
        if(typeof rootNode !== 'object' || Array.isArray(rootNode)) {
            console.error('Component#onRender must return a single node object on the top level');
        }
    }

    const childCtx = this.onChildContextRequest();

    rootNode.ctx(childCtx === emptyObj?
        this.context :
        this.context === emptyObj?
            childCtx :
            merge(this.context, childCtx));

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

                this.patch(this.attrs, this.children, this.context);
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

function onComponentDefaultAttrsRequest() {
    return emptyObj;
}

function buildComponentAttrs(attrs) {
    if(this.attrs && attrs === this.attrs) {
        return attrs;
    }

    const cons = this.constructor,
        defaultAttrs = cons.__defaultAttrs || (cons.__defaultAttrs = cons.onDefaultAttrsRequest());

    return attrs?
        defaultAttrs === emptyObj?
            attrs :
            merge(defaultAttrs, attrs) :
        defaultAttrs;
}

function createComponent(props, staticProps) {
    const res = function(attrs, children, ctx) {
            this.attrs = this.__buildAttrs(attrs);
            this.children = children;
            this.state = emptyObj;
            this.context = ctx;

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
            onAttrsChange : noOp,
            onChildrenChange : noOp,
            shouldUpdate : shouldComponentUpdate,
            onUpdate : noOp,
            isMounted : isComponentMounted,
            setState : setComponentState,
            renderToDom : renderComponentToDom,
            renderToString : renderComponentToString,
            adoptDom : adoptComponentDom,
            getDomNode : getComponentDomNode,
            getRootNode : getComponentRootNode,
            render : renderComponent,
            onRender : noOp,
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

    res.onDefaultAttrsRequest = onComponentDefaultAttrsRequest;

    for(const i in staticProps) {
        res[i] = staticProps[i];
    }

    res['__vidom__component__'] = true;

    return res;
}

export default createComponent;
