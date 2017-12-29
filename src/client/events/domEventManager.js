import createSyntheticEvent from './createSyntheticEvent';
import getDomNodeId from '../getDomNodeId';
import SimpleMap from '../../utils/SimpleMap';
import { isIos } from '../utils/ua';

const MOUSE_NATIVE_EVENTS = ['click', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup'];
let BUBBLEABLE_NATIVE_EVENTS = [
        'animationend', 'animationiteration', 'animationstart',
        'blur', 'change', 'contextmenu', 'copy', 'cut',
        'dblclick', 'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'dragstart', 'drop',
        'focus', 'input', 'keydown', 'keypress', 'keyup', 'paste', 'submit',
        'touchcancel', 'touchend', 'touchmove', 'touchstart', 'transitionend', 'wheel'
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
    eventsCfg = new SimpleMap();
let areListenersEnabled = true;

function globalEventListener(e, type = e.type) {
    if(!areListenersEnabled) {
        return;
    }

    let { target } = e,
        { listenersCount } = eventsCfg.get(type),
        listener,
        domNodeId,
        syntheticEvent;

    while(listenersCount && target && target !== document) { // need to check target for detached dom
        if(domNodeId = getDomNodeId(target, true)) {
            if(listenersStorage.has(domNodeId)) {
                listener = listenersStorage.get(domNodeId)[type];

                if(listener != null) {
                    listener(syntheticEvent || (syntheticEvent = createSyntheticEvent(type, e)));
                    if(--listenersCount === 0 || syntheticEvent.isPropagationStopped()) {
                        return;
                    }
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
        isBubblingFocusSupported = true,
        type;
    const matchFirefox = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/);

    if(matchFirefox !== null && Number(matchFirefox[1]) < 52) {
        isBubblingFocusSupported = false;
    }

    while(i < BUBBLEABLE_NATIVE_EVENTS.length) {
        type = BUBBLEABLE_NATIVE_EVENTS[i++];
        eventsCfg.set(type, {
            type : type,
            bubbles : true,
            listenersCount : 0,
            set : false,
            setup : type in focusEvents?
                isBubblingFocusSupported?
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
        });
    }

    i = 0;
    while(i < NON_BUBBLEABLE_NATIVE_EVENTS.length) {
        eventsCfg.set(NON_BUBBLEABLE_NATIVE_EVENTS[i++], {
            type : type,
            bubbles : false,
            set : false,
            setup : null
        });
    }
}

function doAddListener(cfg, domNode, type) {
    if(cfg.bubbles) {
        ++cfg.listenersCount;
    }
    else {
        domNode.addEventListener(type, eventListener, false);
    }
}

function addListener(domNode, type, listener) {
    if(!eventsCfg.has(type)) {
        return;
    }

    const cfg = eventsCfg.get(type);

    if(!cfg.set) {
        if(cfg.setup !== null) {
            cfg.setup();
        }
        else if(cfg.bubbles) {
            document.addEventListener(type, globalEventListener, false);
        }

        cfg.set = true;
    }

    const domNodeId = getDomNodeId(domNode);
    let listeners;

    if(listenersStorage.has(domNodeId)) {
        listeners = listenersStorage.get(domNodeId);
        if(listeners[type] == null) {
            doAddListener(cfg, domNode, type);
        }
    }
    else {
        listenersStorage.set(domNodeId, listeners = Object.create(null));
        doAddListener(cfg, domNode, type);
    }

    listeners[type] = listener;
}

function doRemoveListener(cfg, domNode, type) {
    if(cfg.bubbles) {
        --cfg.listenersCount;
    }
    else {
        domNode.removeEventListener(type, eventListener);
    }
}

function removeListener(domNode, type) {
    const domNodeId = getDomNodeId(domNode, true);

    if(domNodeId !== null) {
        if(listenersStorage.has(domNodeId)) {
            const listeners = listenersStorage.get(domNodeId);

            listeners[type] = null;
            doRemoveListener(eventsCfg.get(type), domNode, type);
        }
    }
}

function removeListeners(domNode) {
    const domNodeId = getDomNodeId(domNode, true);

    if(domNodeId !== null && listenersStorage.has(domNodeId)) {
        const listeners = listenersStorage.get(domNodeId);

        for(const type in listeners) {
            if(listeners[type] !== null) {
                doRemoveListener(eventsCfg.get(type), domNode, type);
            }
        }

        listenersStorage.delete(domNodeId);
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
