import getDomNodeId from '../getDomNodeId';
import { isIos } from '../utils/ua';

const MOUSE_NATIVE_EVENTS = ['click', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup'];
let BUBBLEABLE_NATIVE_EVENTS = [
        'animationend', 'animationiteration', 'animationstart', 'blur', 'change', 'contextmenu',
        'copy', 'cut', 'dblclick', 'drag', 'dragend', 'dragenter', 'dragleave', 'dragover',
        'dragstart', 'drop', 'focus', 'input', 'keydown', 'keypress', 'keyup', 'paste',
        'pointerover', 'pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'pointerout',
        'submit', 'touchcancel', 'touchend', 'touchmove', 'touchstart', 'transitionend', 'wheel'
    ],
    NON_BUBBLEABLE_NATIVE_EVENTS = [
        'canplay', 'canplaythrough', 'complete', 'durationchange', 'emptied', 'ended', 'error',
        'gotpointercapture', 'load', 'loadeddata', 'loadedmetadata', 'loadstart', 'lostpointercapture',
        'mouseenter', 'mouseleave', 'pause', 'play', 'playing', 'pointerenter', 'pointerleave',
        'progress', 'ratechange', 'scroll', 'seeked', 'seeking', 'select', 'stalled', 'suspend',
        'timeupdate', 'volumechange', 'waiting'
    ];

if(isIos) {
    NON_BUBBLEABLE_NATIVE_EVENTS = [...NON_BUBBLEABLE_NATIVE_EVENTS, ...MOUSE_NATIVE_EVENTS];
}
else {
    BUBBLEABLE_NATIVE_EVENTS = [...BUBBLEABLE_NATIVE_EVENTS, ...MOUSE_NATIVE_EVENTS];
}

const listenersStorage = Object.create(null),
    eventsCfg = Object.create(null);
let areListenersEnabled = true;

function globalEventListener(e, type = e.type) {
    if(!areListenersEnabled) {
        return;
    }

    let { target } = e,
        { listenersCount } = eventsCfg[type],
        listener,
        domNodeId;

    while(listenersCount && target && target !== document) { // need to check target for detached dom
        if(domNodeId = getDomNodeId(target, true)) {
            if(domNodeId in listenersStorage) {
                listener = listenersStorage[domNodeId][type];

                if(listener != null) {
                    listener(e);
                    if(--listenersCount === 0 || e.cancelBubble) {
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
        listenersStorage[getDomNodeId(e.currentTarget)][e.type](e);
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
        eventsCfg[type] = {
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
        };
    }

    i = 0;
    while(i < NON_BUBBLEABLE_NATIVE_EVENTS.length) {
        eventsCfg[NON_BUBBLEABLE_NATIVE_EVENTS[i++]] = {
            type : type,
            bubbles : false,
            set : false,
            setup : null
        };
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
    if(!(type in eventsCfg)) {
        return;
    }

    const cfg = eventsCfg[type];

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

    if(domNodeId in listenersStorage) {
        listeners = listenersStorage[domNodeId];
        if(listeners[type] == null) {
            doAddListener(cfg, domNode, type);
        }
    }
    else {
        listeners = listenersStorage[domNodeId] = Object.create(null);
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
        if(domNodeId in listenersStorage) {
            const listeners = listenersStorage[domNodeId];

            listeners[type] = null;
            doRemoveListener(eventsCfg[type], domNode, type);
        }
    }
}

function removeListeners(domNode) {
    const domNodeId = getDomNodeId(domNode, true);

    if(domNodeId !== null && domNodeId in listenersStorage) {
        const listeners = listenersStorage[domNodeId];

        for(const type in listeners) {
            if(listeners[type] !== null) {
                doRemoveListener(eventsCfg[type], domNode, type);
            }
        }

        delete listenersStorage[domNodeId];
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
