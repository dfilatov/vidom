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
        'focusin', 'focusout'
    ],
    NON_BUBBLEABLE_NATIVE_EVENTS = [
        'focus', 'blur', 'scroll', 'load', 'unload'
    ];

function addListeners(domNode, listeners, ctx) {
    if(listeners) {
        for(var type in listeners) {
            addListener(domNode, type);
        }

        var domNodeId = getDomNodeId(domNode);
        listenersStorage[domNodeId] = {
            fns : listeners,
            ctx : ctx
        };
    }
}

function addListener(domNode, type) {
    var cfg = eventsCfg[type];
    if(cfg) {
        if(!cfg.set) {
            cfg.setup?
                cfg.setup() :
                cfg.bubbles && addDomEventListener(body, type, globalEventListener, false);
            cfg.set = true;
        }

        cfg.bubbles?
            ++cfg.listenersCounter :
            addDomEventListener(domNode, type, eventListener, false);
    }
}

function updateListeners(domNode, listeners, ctx) {
    var domNodeId = getDomNodeId(domNode, true),
        prevListeners = domNodeId && listenersStorage[domNodeId];

    if(prevListeners) {
        if(listeners) {
            var type, cfg;
            for(type in prevListeners.fns) {
                cfg = eventsCfg[type];
                if(!listeners[type]) {
                    removeListener(domNode, type);
                }
            }

            for(type in listeners) {
                if(!prevListeners.fns[type]) {
                    addListener(domNode, type);
                }
            }

            listenersStorage[domNodeId].fns = listeners;
        }
        else {
            removeListeners(domNode);
        }
    }
    else {
        addListeners(domNode, listeners, ctx);
    }
}

function removeListeners(domNode) {
    var domNodeId = getDomNodeId(domNode, true);

    if(domNodeId) {
        var listeners = listenersStorage[domNodeId];

        if(listeners) {
            delete listenersStorage[domNodeId];
            for(var type in listeners.fns) {
                removeListener(domNode, type);
            }
        }
    }
}

function removeListener(domNode, type) {
    var cfg = eventsCfg[type];
    if(cfg) {
        cfg.bubbles?
            --cfg.listenersCounter :
            removeDomEventListener(domNode, type, eventListener);
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
            if(listeners && (listener = listeners.fns[type])) {
                listener.call(listeners.ctx, event || (event = new SyntheticEvent(type, e)));
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
    var listeners = listenersStorage[getDomNodeId(e.target)];
    listeners.fns[e.type].call(listeners.ctx, new SyntheticEvent(e.type, e));
}

if(body) {
    var i = 0,
        type;

    while(i < BUBBLEABLE_NATIVE_EVENTS.length) {
        type = BUBBLEABLE_NATIVE_EVENTS[i++];
        eventsCfg[type] = {
            type : type,
            bubbles : true,
            listenersCounter : 0,
            set : false,
            setup : (type === 'focusin' || type === 'focusout') && !isEventSupported(type)?
                function() {
                    var type = this.type;
                    addDomEventListener(
                        body,
                        type === 'focusin'? 'focus' : 'blur',
                        function(e) {
                            globalEventListener(e, type);
                        },
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
    addListeners : addListeners,
    updateListeners : updateListeners,
    removeListeners : removeListeners
};
