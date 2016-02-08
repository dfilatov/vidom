import isEventSupported from './isEventSupported';
import SyntheticEvent from './SyntheticEvent';
import getDomNodeId from '../getDomNodeId';

const doc = global.document,
    BUBBLEABLE_NATIVE_EVENTS = [
        'mouseover', 'mousemove', 'mouseout', 'mousedown', 'mouseup',
        'click', 'dblclick', 'keydown', 'keypress', 'keyup',
        'change', 'input', 'submit', 'focus', 'blur',
        'dragstart', 'drag', 'dragenter', 'dragover', 'dragleave', 'dragend', 'drop',
        'contextmenu', 'wheel', 'copy', 'cut', 'paste'
    ],
    NON_BUBBLEABLE_NATIVE_EVENTS = [
        'scroll', 'load', 'error'
    ];

const listenersStorage = {},
    eventsCfg = {};

function globalEventListener(e, type) {
    type || (type = e.type);

    const cfg = eventsCfg[type];

    let target = e.target,
        listenersCount = cfg.listenersCounter,
        listeners,
        listener,
        listenersToInvoke,
        domNodeId;

    while(listenersCount > 0 && target && target !== doc) {
        if(domNodeId = getDomNodeId(target, true)) {
            listeners = listenersStorage[domNodeId];
            if(listeners && (listener = listeners[type])) {
                if(listenersToInvoke) {
                    listenersToInvoke.push(listener);
                }
                else {
                    listenersToInvoke = [listener];
                }
                --listenersCount;
            }
        }

        target = target.parentNode;
    }

    if(listenersToInvoke) {
        const event = new SyntheticEvent(type, e),
            len = listenersToInvoke.length;

        let i = 0;

        while(i < len) {
            listenersToInvoke[i++](event);
            if(event.isPropagationStopped()) {
                break;
            }
        }
    }

}

function eventListener(e) {
    listenersStorage[getDomNodeId(e.target)][e.type](new SyntheticEvent(e.type, e));
}

if(doc) {
    const focusEvents = {
        focus : 'focusin',
        blur : 'focusout'
    };

    let i = 0,
        type;

    while(i < BUBBLEABLE_NATIVE_EVENTS.length) {
        type = BUBBLEABLE_NATIVE_EVENTS[i++];
        eventsCfg[type] = {
            type : type,
            bubbles : true,
            listenersCounter : 0,
            set : false,
            setup : focusEvents[type]?
                isEventSupported(focusEvents[type])?
                    function() {
                        const type = this.type;
                        doc.addEventListener(
                            focusEvents[type],
                            e => { globalEventListener(e, type); });
                    } :
                    function() {
                        doc.addEventListener(
                            this.type,
                            globalEventListener,
                            true);
                    } :
                null
        };
    }

    i = 0;
    while(i < NON_BUBBLEABLE_NATIVE_EVENTS.length) {
        eventsCfg[NON_BUBBLEABLE_NATIVE_EVENTS[i++]] = {
            type : type,
            bubbles : false,
            set : false
        };
    }
}

function addListener(domNode, type, listener) {
    const cfg = eventsCfg[type];
    if(cfg) {
        if(!cfg.set) {
            cfg.setup?
                cfg.setup() :
                cfg.bubbles && doc.addEventListener(type, globalEventListener, false);
            cfg.set = true;
        }

        const domNodeId = getDomNodeId(domNode),
            listeners = listenersStorage[domNodeId] || (listenersStorage[domNodeId] = {});

        if(!listeners[type]) {
            cfg.bubbles?
                ++cfg.listenersCounter :
                domNode.addEventListener(type, eventListener, false);
        }

        listeners[type] = listener;
    }
}

function removeListener(domNode, type) {
    const domNodeId = getDomNodeId(domNode, true);

    if(domNodeId) {
        const listeners = listenersStorage[domNodeId];

        if(listeners && listeners[type]) {
            listeners[type] = null;

            const cfg = eventsCfg[type];

            if(cfg) {
                cfg.bubbles?
                    --cfg.listenersCounter :
                    domNode.removeEventListener(type, eventListener);
            }
        }
    }
}

function removeListeners(domNode) {
    const domNodeId = getDomNodeId(domNode, true);

    if(domNodeId) {
        const listeners = listenersStorage[domNodeId];

        if(listeners) {
            delete listenersStorage[domNodeId];
            for(let type in listeners) {
                removeListener(domNode, type);
            }
        }
    }
}

export {
    addListener,
    removeListener,
    removeListeners
}
