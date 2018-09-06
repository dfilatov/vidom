import noOp from './utils/noOp';
import rafBatch from './client/rafBatch';
import merge from './utils/merge';
import console from './utils/console';
import emptyObj from './utils/emptyObj';
import restrictObjProp from './utils/restrictObjProp';
import { IS_DEBUG } from './utils/debug';
import nodeToElement from './nodes/utils/nodeToElement';
import globalHook from './globalHook';

let componentId = 1;

function initComponent() {
    this.onInit();
}

function mountComponent() {
    this.__isMounted = true;
    this.__prevState = this.state;

    this.getRootElement().mount();
    this.onMount();
}

function unmountComponent() {
    this.__isMounted = false;
    this.getRootElement().unmount();
    this.onUnmount();
}

function patchComponent(nextAttrs, nextChildren, nextContext, byParent) {
    if(byParent) {
        this.__prevAttrs = this.attrs;
        this.__prevChildren = this.children;
        this.__prevContext = this.context;

        if(IS_DEBUG) {
            this.__isFrozen = false;
        }

        this.attrs = this.__buildAttrs(nextAttrs);
        this.children = nextChildren;
        this.context = nextContext;

        if(IS_DEBUG) {
            this.__isFrozen = true;
        }
    }

    this.__isUpdating = true;

    this.onChange(
        this.__prevAttrs,
        this.__prevChildren,
        this.__prevState,
        this.__prevContext);

    this.__isUpdating = false;

    const shouldRerender = this.shouldRerender(
        this.__prevAttrs,
        this.__prevChildren,
        this.__prevState,
        this.__prevContext);

    if(IS_DEBUG) {
        const shouldRerenderResType = typeof shouldRerender;

        if(shouldRerenderResType !== 'boolean') {
            const name = getComponentName(this);

            console.warn(`${name}#shouldRerender() should return boolean instead of ${shouldRerenderResType}`);
        }
    }

    if(shouldRerender) {
        const prevRootElem = this.getRootElement();

        this.__rootElement = this.render();
        prevRootElem.patch(this.__rootElement);
    }

    this.onUpdate(
        this.__prevAttrs,
        this.__prevChildren,
        this.__prevState,
        this.__prevContext);

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
    return this.getRootElement().renderToDom(parentNs);
}

function renderComponentToString() {
    return this.getRootElement().renderToString();
}

function adoptComponentDom(domNode, domIdx) {
    return this.getRootElement().adoptDom(domNode, domIdx);
}

function getComponentDomNode() {
    return this.getRootElement().getDomNode();
}

function requestChildContext() {
    return emptyObj;
}

function setComponentState(state) {
    if(IS_DEBUG) {
        if(this.__disallowSetState) {
            const name = getComponentName(this);

            console.warn(`${name}#setState() should not be called during rendering`);
        }

        this.__isFrozen = false;
    }

    this.state = this.state === emptyObj?
        state :
        merge(this.state, state, true);

    if(IS_DEBUG) {
        Object.freeze(this.state);
        this.__isFrozen = true;
    }

    this.update();
}

function renderComponent() {
    if(IS_DEBUG) {
        this.__disallowSetState = true;
    }

    const rootElem = nodeToElement(this.onRender());

    if(IS_DEBUG) {
        this.__disallowSetState = false;
    }

    const childCtx = this.onChildContextRequest(),
        rootElemCtx = childCtx === emptyObj?
            this.context :
            this.context === emptyObj?
                childCtx :
                merge(this.context, childCtx);

    if(IS_DEBUG) {
        Object.freeze(rootElemCtx);
    }

    rootElem.setCtx(rootElemCtx);

    return rootElem;
}

function updateComponent() {
    if(this.__isUpdating || !this.isMounted()) {
        return;
    }

    this.__isUpdating = true;
    rafBatch({
        priority : this.__id,
        fn : applyUpdate,
        ctx : this
    });
}

function applyUpdate() {
    if(this.__isUpdating && this.isMounted()) {
        if(IS_DEBUG) {
            const prevRootElem = this.__rootElement;

            this.patch(this.attrs, this.children, this.context, false);

            globalHook.emit('replace', prevRootElem, this.__rootElement);
        }
        else {
            this.patch(this.attrs, this.children, this.context, false);
        }
    }
}

function getComponentRootElem() {
    return this.__rootElement === null?
        this.__rootElement = this.render() :
        this.__rootElement;
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

function getComponentName(component) {
    return component.constructor.name || 'Component';
}

function createComponent(props, staticProps) {
    const res = function(attrs, children, ctx) {
            if(IS_DEBUG) {
                restrictObjProp(this, 'attrs');
                restrictObjProp(this, 'children');
                restrictObjProp(this, 'state');
                restrictObjProp(this, 'context');

                this.__isFrozen = false;
                this.__disallowSetState = false;
            }

            this.attrs = this.__buildAttrs(attrs);
            this.children = children;
            this.state = emptyObj;
            this.context = ctx;

            if(IS_DEBUG) {
                this.__isFrozen = true;
            }

            this.__id = componentId++;
            this.__isMounted = false;
            this.__isUpdating = false;

            this.__rootElement = null;

            this.__prevAttrs = this.attrs;
            this.__prevChildren = this.children;
            this.__prevState = emptyObj;
            this.__prevContext = this.context;
        },
        ptp = {
            constructor : res,
            init : initComponent,
            onInit : noOp,
            mount : mountComponent,
            unmount : unmountComponent,
            onMount : noOp,
            onUnmount : noOp,
            onChange : noOp,
            shouldRerender : shouldComponentRerender,
            onRender : onComponentRender,
            onUpdate : noOp,
            isMounted : isComponentMounted,
            setState : setComponentState,
            renderToDom : renderComponentToDom,
            renderToString : renderComponentToString,
            adoptDom : adoptComponentDom,
            getDomNode : getComponentDomNode,
            getRootElement : getComponentRootElem,
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
