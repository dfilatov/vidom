import isEventSupported from './isEventSupported';
import createSyntheticEvent from './createSyntheticEvent';
import getDomNodeId from '../getDomNodeId';
import SimpleMap from '../../utils/SimpleMap';
import { isIos } from '../utils/ua';

const MOUSE_NATIVE_EVENTS = ['click', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup'];
let BUBBLEABLE_NATIVE_EVENTS = [
        'blur', 'change', 'contextmenu', 'copy', 'cut',
        'dblclick', 'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'dragstart', 'drop',
        'focus', 'input', 'keydown', 'keypress', 'keyup',
        'paste', 'submit', 'touchcancel', 'touchend', 'touchmove', 'touchstart', 'wheel'
    ],
    NON_BUBBLEABLE_NATIVE_EVENTS = [
        'canplay', 'canplaythrough', 'complete', 'durationchange', 'emptied', 'ended', 'error',
        'load', 'loadeddata', 'loadedmetadata', 'loadstart', 'mouseenter', 'mouseleave',
        'pause', 'play', 'playing', 'progress', 'ratechange',
        'scroll', 'seeked', 'seeking', 'select', 'stalled', 'suspend',
        'timeupdate', 'volumechange', 'waiting'
    ];

if(isIos) {
    NON_BUBBLEABLE_NATIVE_EVENTS = [...NON_BUBBLEABLE_NATIVE_EVENTS, ...MOUSE_NATIVE_EVENTS];
}
else {
    BUBBLEABLE_NATIVE_EVENTS = [...BUBBLEABLE_NATIVE_EVENTS, ...MOUSE_NATIVE_EVENTS];
}

const listenersStorage = new SimpleMap(),
    eventsCfg = {};
let areListenersEnabled = true;

function globalEventListener(e, type = e.type) {
    if(!areListenersEnabled) {
        return;
    }

    let { target } = e,
        { listenersCount } = eventsCfg[type],
        listeners,
        listener,
        domNodeId,
        syntheticEvent;

    while(listenersCount && target && target !== document) { // need to check target for detached dom
        if(domNodeId = getDomNodeId(target, true)) {
            listeners = listenersStorage.get(domNodeId);
            if(listeners && (listener = listeners[type])) {
                listener(syntheticEvent || (syntheticEvent = createSyntheticEvent(type, e)));
                if(!--listenersCount || syntheticEvent.isPropagationStopped()) {
                    return;
                }
            }
        }

        target = target.parentNode;
    }
}

function eventListener(e) {
    if(areListenersEnabled) {
        listenersStorage.get(getDomNodeId(e.currentTarget))[e.type](createSyntheticEvent(e.type, e));
    }
}

if(typeof document !== 'undefined') {
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
            listenersCount : 0,
            set : false,
            setup : focusEvents[type]?
                isEventSupported(focusEvents[type])?
                    function() {
                        const type = this.type;
                        document.addEventListener(
                            focusEvents[type],
                            e => { globalEventListener(e, type); });
                    } :
                    function() {
                        document.addEventListener(
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
                cfg.bubbles && document.addEventListener(type, globalEventListener, false);
            cfg.set = true;
        }

        const domNodeId = getDomNodeId(domNode);
        let listeners = listenersStorage.get(domNodeId);

        if(!listeners) {
            listenersStorage.set(domNodeId, listeners = {});
        }

        if(!listeners[type]) {
            cfg.bubbles?
                ++cfg.listenersCount :
                domNode.addEventListener(type, eventListener, false);
        }

        listeners[type] = listener;
    }
}

function doRemoveListener(domNode, type) {
    const cfg = eventsCfg[type];

    if(cfg) {
        if(cfg.bubbles) {
            --cfg.listenersCount;
        }
        else {
            domNode.removeEventListener(type, eventListener);
        }
    }
}

function removeListener(domNode, type) {
    const domNodeId = getDomNodeId(domNode, true);

    if(domNodeId) {
        const listeners = listenersStorage.get(domNodeId);

        if(listeners && listeners[type]) {
            listeners[type] = null;
            doRemoveListener(domNode, type);
        }
    }
}

function removeListeners(domNode) {
    const domNodeId = getDomNodeId(domNode, true);

    if(domNodeId) {
        const listeners = listenersStorage.get(domNodeId);

        if(listeners) {
            for(const type in listeners) {
                if(listeners[type]) {
                    doRemoveListener(domNode, type);
                }
            }

            listenersStorage.delete(domNodeId);
        }
    }
}

function disableListeners() {
    areListenersEnabled = false;
}

function enableListeners() {
    areListenersEnabled = true;
}

export {
    addListener,
    removeListener,
    removeListeners,
    disableListeners,
    enableListeners
};
