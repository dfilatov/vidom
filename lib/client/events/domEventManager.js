var addDomEventListener = require('./addDomEventListener'),
    removeDomEventListener = require('./removeDomEventListener'),
    isEventSupported = require('./isEventSupported'),
    SyntheticEvent = require('./SyntheticEvent'),
    getDomNodeId = require('../getDomNodeId'),
    doc = typeof document !== 'undefined'? document : null,
    body = doc && doc.body,
    listenersStorage = {},
    eventsCfg = {},
    BUBBLEABLE_NATIVE_EVENTS = [
        'mouseover', 'mousemove', 'mouseout', 'mousedown', 'mouseup',
        'click', 'dblclick', 'keydown', 'keypress', 'keyup',
        'change', 'input', 'submit', 'focus', 'blur'
    ],
    NON_BUBBLEABLE_NATIVE_EVENTS = [
        'scroll', 'load', 'unload'
    ],
    ATTRS_TO_EVENTS = {
        onMouseOver : 'onMouseOver',
        onMouseMove : 'onMouseMove',
        onMouseOut : 'onMouseOut',
        onMouseDown : 'onMouseDown',
        onMouseUp : 'onMouseUp',
        onClick : 'click',
        onDblClick : 'dblclick',
        onKeyDown : 'keydown',
        onKeyPress : 'keypress',
        onKeyUp : 'keyup',
        onChange : 'change',
        onInput : 'input',
        onSubmit : 'submit',
        onFocus : 'focus',
        onBlur : 'blur',
        onScroll : 'scroll',
        onLoad : 'load',
        onUnload : 'unload'
    };

function addListener(domNode, type, listener) {
    var cfg = eventsCfg[type];
    if(cfg) {
        if(!cfg.set) {
            cfg.setup?
                cfg.setup() :
                cfg.bubbles && addDomEventListener(body, type, globalEventListener, false);
            cfg.set = true;
        }

        var domNodeId = getDomNodeId(domNode),
            listeners = listenersStorage[domNodeId] || (listenersStorage[domNodeId] = {});

        if(!listeners[type]) {
            cfg.bubbles?
                ++cfg.listenersCounter :
                addDomEventListener(domNode, type, eventListener, false);
        }

        listeners[type] = listener;
    }
}

function removeListener(domNode, type) {
    var domNodeId = getDomNodeId(domNode, true);

    if(domNodeId) {
        var listeners = listenersStorage[domNodeId];

        if(listeners && listeners[type]) {
            listeners[type] = null;

            var cfg = eventsCfg[type];

            if(cfg) {
                cfg.bubbles?
                    --cfg.listenersCounter :
                    removeDomEventListener(domNode, type, eventListener);
            }
        }
    }
}

function removeListeners(domNode) {
    var domNodeId = getDomNodeId(domNode, true);

    if(domNodeId) {
        var listeners = listenersStorage[domNodeId];

        if(listeners) {
            delete listenersStorage[domNodeId];
            for(var type in listeners) {
                removeListener(domNode, type);
            }
        }
    }
}

function globalEventListener(e, type) {
    type || (type = e.type);

    var target = e.target,
        cfg = eventsCfg[type],
        listenersCount = cfg.listenersCounter,
        listeners,
        listener,
        domNodeId,
        event;

    while(listenersCount > 0 && target !== body) {
        if(domNodeId = getDomNodeId(target, true)) {
            listeners = listenersStorage[domNodeId];
            if(listeners && (listener = listeners[type])) {
                listener(event || (event = new SyntheticEvent(type, e)));
                if(event.isPropagationStopped()) {
                    break;
                }
                --listenersCount;
            }
        }

        target = target.parentNode;
    }
}

function eventListener(e) {
    listenersStorage[getDomNodeId(e.target)][e.type](new SyntheticEvent(e.type, e));
}

if(body) {
    var focusEvents = {
            focus : 'focusin',
            blur : 'focusout'
        },
        i = 0,
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
                        var type = this.type;
                        addDomEventListener(
                            body,
                            focusEvents[type],
                            function(e) {
                                globalEventListener(e, type);
                            });
                    } :
                    function() {
                        addDomEventListener(
                            body,
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

module.exports = {
    addListener : addListener,
    removeListener : removeListener,
    removeListeners : removeListeners
};
