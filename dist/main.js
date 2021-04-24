(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./node_modules/hammerjs/hammer.js":
/*!*****************************************!*\
  !*** ./node_modules/hammerjs/hammer.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*! Hammer.JS - v2.0.7 - 2016-04-22
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
(function(window, document, exportName, undefined) {
  'use strict';

var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
var TEST_ELEMENT = document.createElement('div');

var TYPE_FUNCTION = 'function';

var round = Math.round;
var abs = Math.abs;
var now = Date.now;

/**
 * set a timeout with a given scope
 * @param {Function} fn
 * @param {Number} timeout
 * @param {Object} context
 * @returns {number}
 */
function setTimeoutContext(fn, timeout, context) {
    return setTimeout(bindFn(fn, context), timeout);
}

/**
 * if the argument is an array, we want to execute the fn on each entry
 * if it aint an array we don't want to do a thing.
 * this is used by all the methods that accept a single and array argument.
 * @param {*|Array} arg
 * @param {String} fn
 * @param {Object} [context]
 * @returns {Boolean}
 */
function invokeArrayArg(arg, fn, context) {
    if (Array.isArray(arg)) {
        each(arg, context[fn], context);
        return true;
    }
    return false;
}

/**
 * walk objects and arrays
 * @param {Object} obj
 * @param {Function} iterator
 * @param {Object} context
 */
function each(obj, iterator, context) {
    var i;

    if (!obj) {
        return;
    }

    if (obj.forEach) {
        obj.forEach(iterator, context);
    } else if (obj.length !== undefined) {
        i = 0;
        while (i < obj.length) {
            iterator.call(context, obj[i], i, obj);
            i++;
        }
    } else {
        for (i in obj) {
            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
        }
    }
}

/**
 * wrap a method with a deprecation warning and stack trace
 * @param {Function} method
 * @param {String} name
 * @param {String} message
 * @returns {Function} A new function wrapping the supplied method.
 */
function deprecate(method, name, message) {
    var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
    return function() {
        var e = new Error('get-stack-trace');
        var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '')
            .replace(/^\s+at\s+/gm, '')
            .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';

        var log = window.console && (window.console.warn || window.console.log);
        if (log) {
            log.call(window.console, deprecationMessage, stack);
        }
        return method.apply(this, arguments);
    };
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} target
 * @param {...Object} objects_to_assign
 * @returns {Object} target
 */
var assign;
if (typeof Object.assign !== 'function') {
    assign = function assign(target) {
        if (target === undefined || target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        var output = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source !== undefined && source !== null) {
                for (var nextKey in source) {
                    if (source.hasOwnProperty(nextKey)) {
                        output[nextKey] = source[nextKey];
                    }
                }
            }
        }
        return output;
    };
} else {
    assign = Object.assign;
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} dest
 * @param {Object} src
 * @param {Boolean} [merge=false]
 * @returns {Object} dest
 */
var extend = deprecate(function extend(dest, src, merge) {
    var keys = Object.keys(src);
    var i = 0;
    while (i < keys.length) {
        if (!merge || (merge && dest[keys[i]] === undefined)) {
            dest[keys[i]] = src[keys[i]];
        }
        i++;
    }
    return dest;
}, 'extend', 'Use `assign`.');

/**
 * merge the values from src in the dest.
 * means that properties that exist in dest will not be overwritten by src
 * @param {Object} dest
 * @param {Object} src
 * @returns {Object} dest
 */
var merge = deprecate(function merge(dest, src) {
    return extend(dest, src, true);
}, 'merge', 'Use `assign`.');

/**
 * simple class inheritance
 * @param {Function} child
 * @param {Function} base
 * @param {Object} [properties]
 */
function inherit(child, base, properties) {
    var baseP = base.prototype,
        childP;

    childP = child.prototype = Object.create(baseP);
    childP.constructor = child;
    childP._super = baseP;

    if (properties) {
        assign(childP, properties);
    }
}

/**
 * simple function bind
 * @param {Function} fn
 * @param {Object} context
 * @returns {Function}
 */
function bindFn(fn, context) {
    return function boundFn() {
        return fn.apply(context, arguments);
    };
}

/**
 * let a boolean value also be a function that must return a boolean
 * this first item in args will be used as the context
 * @param {Boolean|Function} val
 * @param {Array} [args]
 * @returns {Boolean}
 */
function boolOrFn(val, args) {
    if (typeof val == TYPE_FUNCTION) {
        return val.apply(args ? args[0] || undefined : undefined, args);
    }
    return val;
}

/**
 * use the val2 when val1 is undefined
 * @param {*} val1
 * @param {*} val2
 * @returns {*}
 */
function ifUndefined(val1, val2) {
    return (val1 === undefined) ? val2 : val1;
}

/**
 * addEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function addEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.addEventListener(type, handler, false);
    });
}

/**
 * removeEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function removeEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.removeEventListener(type, handler, false);
    });
}

/**
 * find if a node is in the given parent
 * @method hasParent
 * @param {HTMLElement} node
 * @param {HTMLElement} parent
 * @return {Boolean} found
 */
function hasParent(node, parent) {
    while (node) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/**
 * small indexOf wrapper
 * @param {String} str
 * @param {String} find
 * @returns {Boolean} found
 */
function inStr(str, find) {
    return str.indexOf(find) > -1;
}

/**
 * split string on whitespace
 * @param {String} str
 * @returns {Array} words
 */
function splitStr(str) {
    return str.trim().split(/\s+/g);
}

/**
 * find if a array contains the object using indexOf or a simple polyFill
 * @param {Array} src
 * @param {String} find
 * @param {String} [findByKey]
 * @return {Boolean|Number} false when not found, or the index
 */
function inArray(src, find, findByKey) {
    if (src.indexOf && !findByKey) {
        return src.indexOf(find);
    } else {
        var i = 0;
        while (i < src.length) {
            if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
                return i;
            }
            i++;
        }
        return -1;
    }
}

/**
 * convert array-like objects to real arrays
 * @param {Object} obj
 * @returns {Array}
 */
function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}

/**
 * unique array with objects based on a key (like 'id') or just by the array's value
 * @param {Array} src [{id:1},{id:2},{id:1}]
 * @param {String} [key]
 * @param {Boolean} [sort=False]
 * @returns {Array} [{id:1},{id:2}]
 */
function uniqueArray(src, key, sort) {
    var results = [];
    var values = [];
    var i = 0;

    while (i < src.length) {
        var val = key ? src[i][key] : src[i];
        if (inArray(values, val) < 0) {
            results.push(src[i]);
        }
        values[i] = val;
        i++;
    }

    if (sort) {
        if (!key) {
            results = results.sort();
        } else {
            results = results.sort(function sortUniqueArray(a, b) {
                return a[key] > b[key];
            });
        }
    }

    return results;
}

/**
 * get the prefixed property
 * @param {Object} obj
 * @param {String} property
 * @returns {String|Undefined} prefixed
 */
function prefixed(obj, property) {
    var prefix, prop;
    var camelProp = property[0].toUpperCase() + property.slice(1);

    var i = 0;
    while (i < VENDOR_PREFIXES.length) {
        prefix = VENDOR_PREFIXES[i];
        prop = (prefix) ? prefix + camelProp : property;

        if (prop in obj) {
            return prop;
        }
        i++;
    }
    return undefined;
}

/**
 * get a unique id
 * @returns {number} uniqueId
 */
var _uniqueId = 1;
function uniqueId() {
    return _uniqueId++;
}

/**
 * get the window object of an element
 * @param {HTMLElement} element
 * @returns {DocumentView|Window}
 */
function getWindowForElement(element) {
    var doc = element.ownerDocument || element;
    return (doc.defaultView || doc.parentWindow || window);
}

var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

var SUPPORT_TOUCH = ('ontouchstart' in window);
var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

var INPUT_TYPE_TOUCH = 'touch';
var INPUT_TYPE_PEN = 'pen';
var INPUT_TYPE_MOUSE = 'mouse';
var INPUT_TYPE_KINECT = 'kinect';

var COMPUTE_INTERVAL = 25;

var INPUT_START = 1;
var INPUT_MOVE = 2;
var INPUT_END = 4;
var INPUT_CANCEL = 8;

var DIRECTION_NONE = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 4;
var DIRECTION_UP = 8;
var DIRECTION_DOWN = 16;

var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

var PROPS_XY = ['x', 'y'];
var PROPS_CLIENT_XY = ['clientX', 'clientY'];

/**
 * create new input type manager
 * @param {Manager} manager
 * @param {Function} callback
 * @returns {Input}
 * @constructor
 */
function Input(manager, callback) {
    var self = this;
    this.manager = manager;
    this.callback = callback;
    this.element = manager.element;
    this.target = manager.options.inputTarget;

    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
    // so when disabled the input events are completely bypassed.
    this.domHandler = function(ev) {
        if (boolOrFn(manager.options.enable, [manager])) {
            self.handler(ev);
        }
    };

    this.init();

}

Input.prototype = {
    /**
     * should handle the inputEvent data and trigger the callback
     * @virtual
     */
    handler: function() { },

    /**
     * bind the events
     */
    init: function() {
        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    },

    /**
     * unbind the events
     */
    destroy: function() {
        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    }
};

/**
 * create new input type manager
 * called by the Manager constructor
 * @param {Hammer} manager
 * @returns {Input}
 */
function createInputInstance(manager) {
    var Type;
    var inputClass = manager.options.inputClass;

    if (inputClass) {
        Type = inputClass;
    } else if (SUPPORT_POINTER_EVENTS) {
        Type = PointerEventInput;
    } else if (SUPPORT_ONLY_TOUCH) {
        Type = TouchInput;
    } else if (!SUPPORT_TOUCH) {
        Type = MouseInput;
    } else {
        Type = TouchMouseInput;
    }
    return new (Type)(manager, inputHandler);
}

/**
 * handle input events
 * @param {Manager} manager
 * @param {String} eventType
 * @param {Object} input
 */
function inputHandler(manager, eventType, input) {
    var pointersLen = input.pointers.length;
    var changedPointersLen = input.changedPointers.length;
    var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
    var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

    input.isFirst = !!isFirst;
    input.isFinal = !!isFinal;

    if (isFirst) {
        manager.session = {};
    }

    // source event is the normalized value of the domEvents
    // like 'touchstart, mouseup, pointerdown'
    input.eventType = eventType;

    // compute scale, rotation etc
    computeInputData(manager, input);

    // emit secret event
    manager.emit('hammer.input', input);

    manager.recognize(input);
    manager.session.prevInput = input;
}

/**
 * extend the data with some usable properties like scale, rotate, velocity etc
 * @param {Object} manager
 * @param {Object} input
 */
function computeInputData(manager, input) {
    var session = manager.session;
    var pointers = input.pointers;
    var pointersLength = pointers.length;

    // store the first input to calculate the distance and direction
    if (!session.firstInput) {
        session.firstInput = simpleCloneInputData(input);
    }

    // to compute scale and rotation we need to store the multiple touches
    if (pointersLength > 1 && !session.firstMultiple) {
        session.firstMultiple = simpleCloneInputData(input);
    } else if (pointersLength === 1) {
        session.firstMultiple = false;
    }

    var firstInput = session.firstInput;
    var firstMultiple = session.firstMultiple;
    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

    var center = input.center = getCenter(pointers);
    input.timeStamp = now();
    input.deltaTime = input.timeStamp - firstInput.timeStamp;

    input.angle = getAngle(offsetCenter, center);
    input.distance = getDistance(offsetCenter, center);

    computeDeltaXY(session, input);
    input.offsetDirection = getDirection(input.deltaX, input.deltaY);

    var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
    input.overallVelocityX = overallVelocity.x;
    input.overallVelocityY = overallVelocity.y;
    input.overallVelocity = (abs(overallVelocity.x) > abs(overallVelocity.y)) ? overallVelocity.x : overallVelocity.y;

    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

    input.maxPointers = !session.prevInput ? input.pointers.length : ((input.pointers.length >
        session.prevInput.maxPointers) ? input.pointers.length : session.prevInput.maxPointers);

    computeIntervalInputData(session, input);

    // find the correct target
    var target = manager.element;
    if (hasParent(input.srcEvent.target, target)) {
        target = input.srcEvent.target;
    }
    input.target = target;
}

function computeDeltaXY(session, input) {
    var center = input.center;
    var offset = session.offsetDelta || {};
    var prevDelta = session.prevDelta || {};
    var prevInput = session.prevInput || {};

    if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
        prevDelta = session.prevDelta = {
            x: prevInput.deltaX || 0,
            y: prevInput.deltaY || 0
        };

        offset = session.offsetDelta = {
            x: center.x,
            y: center.y
        };
    }

    input.deltaX = prevDelta.x + (center.x - offset.x);
    input.deltaY = prevDelta.y + (center.y - offset.y);
}

/**
 * velocity is calculated every x ms
 * @param {Object} session
 * @param {Object} input
 */
function computeIntervalInputData(session, input) {
    var last = session.lastInterval || input,
        deltaTime = input.timeStamp - last.timeStamp,
        velocity, velocityX, velocityY, direction;

    if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
        var deltaX = input.deltaX - last.deltaX;
        var deltaY = input.deltaY - last.deltaY;

        var v = getVelocity(deltaTime, deltaX, deltaY);
        velocityX = v.x;
        velocityY = v.y;
        velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
        direction = getDirection(deltaX, deltaY);

        session.lastInterval = input;
    } else {
        // use latest velocity info if it doesn't overtake a minimum period
        velocity = last.velocity;
        velocityX = last.velocityX;
        velocityY = last.velocityY;
        direction = last.direction;
    }

    input.velocity = velocity;
    input.velocityX = velocityX;
    input.velocityY = velocityY;
    input.direction = direction;
}

/**
 * create a simple clone from the input used for storage of firstInput and firstMultiple
 * @param {Object} input
 * @returns {Object} clonedInputData
 */
function simpleCloneInputData(input) {
    // make a simple copy of the pointers because we will get a reference if we don't
    // we only need clientXY for the calculations
    var pointers = [];
    var i = 0;
    while (i < input.pointers.length) {
        pointers[i] = {
            clientX: round(input.pointers[i].clientX),
            clientY: round(input.pointers[i].clientY)
        };
        i++;
    }

    return {
        timeStamp: now(),
        pointers: pointers,
        center: getCenter(pointers),
        deltaX: input.deltaX,
        deltaY: input.deltaY
    };
}

/**
 * get the center of all the pointers
 * @param {Array} pointers
 * @return {Object} center contains `x` and `y` properties
 */
function getCenter(pointers) {
    var pointersLength = pointers.length;

    // no need to loop when only one touch
    if (pointersLength === 1) {
        return {
            x: round(pointers[0].clientX),
            y: round(pointers[0].clientY)
        };
    }

    var x = 0, y = 0, i = 0;
    while (i < pointersLength) {
        x += pointers[i].clientX;
        y += pointers[i].clientY;
        i++;
    }

    return {
        x: round(x / pointersLength),
        y: round(y / pointersLength)
    };
}

/**
 * calculate the velocity between two points. unit is in px per ms.
 * @param {Number} deltaTime
 * @param {Number} x
 * @param {Number} y
 * @return {Object} velocity `x` and `y`
 */
function getVelocity(deltaTime, x, y) {
    return {
        x: x / deltaTime || 0,
        y: y / deltaTime || 0
    };
}

/**
 * get the direction between two points
 * @param {Number} x
 * @param {Number} y
 * @return {Number} direction
 */
function getDirection(x, y) {
    if (x === y) {
        return DIRECTION_NONE;
    }

    if (abs(x) >= abs(y)) {
        return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
}

/**
 * calculate the absolute distance between two points
 * @param {Object} p1 {x, y}
 * @param {Object} p2 {x, y}
 * @param {Array} [props] containing x and y keys
 * @return {Number} distance
 */
function getDistance(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];

    return Math.sqrt((x * x) + (y * y));
}

/**
 * calculate the angle between two coordinates
 * @param {Object} p1
 * @param {Object} p2
 * @param {Array} [props] containing x and y keys
 * @return {Number} angle
 */
function getAngle(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];
    return Math.atan2(y, x) * 180 / Math.PI;
}

/**
 * calculate the rotation degrees between two pointersets
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} rotation
 */
function getRotation(start, end) {
    return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
}

/**
 * calculate the scale factor between two pointersets
 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} scale
 */
function getScale(start, end) {
    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
}

var MOUSE_INPUT_MAP = {
    mousedown: INPUT_START,
    mousemove: INPUT_MOVE,
    mouseup: INPUT_END
};

var MOUSE_ELEMENT_EVENTS = 'mousedown';
var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

/**
 * Mouse events input
 * @constructor
 * @extends Input
 */
function MouseInput() {
    this.evEl = MOUSE_ELEMENT_EVENTS;
    this.evWin = MOUSE_WINDOW_EVENTS;

    this.pressed = false; // mousedown state

    Input.apply(this, arguments);
}

inherit(MouseInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function MEhandler(ev) {
        var eventType = MOUSE_INPUT_MAP[ev.type];

        // on start we want to have the left mouse button down
        if (eventType & INPUT_START && ev.button === 0) {
            this.pressed = true;
        }

        if (eventType & INPUT_MOVE && ev.which !== 1) {
            eventType = INPUT_END;
        }

        // mouse must be down
        if (!this.pressed) {
            return;
        }

        if (eventType & INPUT_END) {
            this.pressed = false;
        }

        this.callback(this.manager, eventType, {
            pointers: [ev],
            changedPointers: [ev],
            pointerType: INPUT_TYPE_MOUSE,
            srcEvent: ev
        });
    }
});

var POINTER_INPUT_MAP = {
    pointerdown: INPUT_START,
    pointermove: INPUT_MOVE,
    pointerup: INPUT_END,
    pointercancel: INPUT_CANCEL,
    pointerout: INPUT_CANCEL
};

// in IE10 the pointer types is defined as an enum
var IE10_POINTER_TYPE_ENUM = {
    2: INPUT_TYPE_TOUCH,
    3: INPUT_TYPE_PEN,
    4: INPUT_TYPE_MOUSE,
    5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
};

var POINTER_ELEMENT_EVENTS = 'pointerdown';
var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

// IE10 has prefixed support, and case-sensitive
if (window.MSPointerEvent && !window.PointerEvent) {
    POINTER_ELEMENT_EVENTS = 'MSPointerDown';
    POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
}

/**
 * Pointer events input
 * @constructor
 * @extends Input
 */
function PointerEventInput() {
    this.evEl = POINTER_ELEMENT_EVENTS;
    this.evWin = POINTER_WINDOW_EVENTS;

    Input.apply(this, arguments);

    this.store = (this.manager.session.pointerEvents = []);
}

inherit(PointerEventInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function PEhandler(ev) {
        var store = this.store;
        var removePointer = false;

        var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

        var isTouch = (pointerType == INPUT_TYPE_TOUCH);

        // get index of the event in the store
        var storeIndex = inArray(store, ev.pointerId, 'pointerId');

        // start and mouse must be down
        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
            if (storeIndex < 0) {
                store.push(ev);
                storeIndex = store.length - 1;
            }
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            removePointer = true;
        }

        // it not found, so the pointer hasn't been down (so it's probably a hover)
        if (storeIndex < 0) {
            return;
        }

        // update the event in the store
        store[storeIndex] = ev;

        this.callback(this.manager, eventType, {
            pointers: store,
            changedPointers: [ev],
            pointerType: pointerType,
            srcEvent: ev
        });

        if (removePointer) {
            // remove from the store
            store.splice(storeIndex, 1);
        }
    }
});

var SINGLE_TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Touch events input
 * @constructor
 * @extends Input
 */
function SingleTouchInput() {
    this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
    this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
    this.started = false;

    Input.apply(this, arguments);
}

inherit(SingleTouchInput, Input, {
    handler: function TEhandler(ev) {
        var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

        // should we handle the touch events?
        if (type === INPUT_START) {
            this.started = true;
        }

        if (!this.started) {
            return;
        }

        var touches = normalizeSingleTouches.call(this, ev, type);

        // when done, reset the started state
        if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
            this.started = false;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function normalizeSingleTouches(ev, type) {
    var all = toArray(ev.touches);
    var changed = toArray(ev.changedTouches);

    if (type & (INPUT_END | INPUT_CANCEL)) {
        all = uniqueArray(all.concat(changed), 'identifier', true);
    }

    return [all, changed];
}

var TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Multi-user touch events input
 * @constructor
 * @extends Input
 */
function TouchInput() {
    this.evTarget = TOUCH_TARGET_EVENTS;
    this.targetIds = {};

    Input.apply(this, arguments);
}

inherit(TouchInput, Input, {
    handler: function MTEhandler(ev) {
        var type = TOUCH_INPUT_MAP[ev.type];
        var touches = getTouches.call(this, ev, type);
        if (!touches) {
            return;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function getTouches(ev, type) {
    var allTouches = toArray(ev.touches);
    var targetIds = this.targetIds;

    // when there is only one touch, the process can be simplified
    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
        targetIds[allTouches[0].identifier] = true;
        return [allTouches, allTouches];
    }

    var i,
        targetTouches,
        changedTouches = toArray(ev.changedTouches),
        changedTargetTouches = [],
        target = this.target;

    // get target touches from touches
    targetTouches = allTouches.filter(function(touch) {
        return hasParent(touch.target, target);
    });

    // collect touches
    if (type === INPUT_START) {
        i = 0;
        while (i < targetTouches.length) {
            targetIds[targetTouches[i].identifier] = true;
            i++;
        }
    }

    // filter changed touches to only contain touches that exist in the collected target ids
    i = 0;
    while (i < changedTouches.length) {
        if (targetIds[changedTouches[i].identifier]) {
            changedTargetTouches.push(changedTouches[i]);
        }

        // cleanup removed touches
        if (type & (INPUT_END | INPUT_CANCEL)) {
            delete targetIds[changedTouches[i].identifier];
        }
        i++;
    }

    if (!changedTargetTouches.length) {
        return;
    }

    return [
        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
        changedTargetTouches
    ];
}

/**
 * Combined touch and mouse input
 *
 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
 * This because touch devices also emit mouse events while doing a touch.
 *
 * @constructor
 * @extends Input
 */

var DEDUP_TIMEOUT = 2500;
var DEDUP_DISTANCE = 25;

function TouchMouseInput() {
    Input.apply(this, arguments);

    var handler = bindFn(this.handler, this);
    this.touch = new TouchInput(this.manager, handler);
    this.mouse = new MouseInput(this.manager, handler);

    this.primaryTouch = null;
    this.lastTouches = [];
}

inherit(TouchMouseInput, Input, {
    /**
     * handle mouse and touch events
     * @param {Hammer} manager
     * @param {String} inputEvent
     * @param {Object} inputData
     */
    handler: function TMEhandler(manager, inputEvent, inputData) {
        var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
            isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

        if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
            return;
        }

        // when we're in a touch event, record touches to  de-dupe synthetic mouse event
        if (isTouch) {
            recordTouches.call(this, inputEvent, inputData);
        } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
            return;
        }

        this.callback(manager, inputEvent, inputData);
    },

    /**
     * remove the event listeners
     */
    destroy: function destroy() {
        this.touch.destroy();
        this.mouse.destroy();
    }
});

function recordTouches(eventType, eventData) {
    if (eventType & INPUT_START) {
        this.primaryTouch = eventData.changedPointers[0].identifier;
        setLastTouch.call(this, eventData);
    } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
        setLastTouch.call(this, eventData);
    }
}

function setLastTouch(eventData) {
    var touch = eventData.changedPointers[0];

    if (touch.identifier === this.primaryTouch) {
        var lastTouch = {x: touch.clientX, y: touch.clientY};
        this.lastTouches.push(lastTouch);
        var lts = this.lastTouches;
        var removeLastTouch = function() {
            var i = lts.indexOf(lastTouch);
            if (i > -1) {
                lts.splice(i, 1);
            }
        };
        setTimeout(removeLastTouch, DEDUP_TIMEOUT);
    }
}

function isSyntheticEvent(eventData) {
    var x = eventData.srcEvent.clientX, y = eventData.srcEvent.clientY;
    for (var i = 0; i < this.lastTouches.length; i++) {
        var t = this.lastTouches[i];
        var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
        if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
            return true;
        }
    }
    return false;
}

var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

// magical touchAction value
var TOUCH_ACTION_COMPUTE = 'compute';
var TOUCH_ACTION_AUTO = 'auto';
var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
var TOUCH_ACTION_NONE = 'none';
var TOUCH_ACTION_PAN_X = 'pan-x';
var TOUCH_ACTION_PAN_Y = 'pan-y';
var TOUCH_ACTION_MAP = getTouchActionProps();

/**
 * Touch Action
 * sets the touchAction property or uses the js alternative
 * @param {Manager} manager
 * @param {String} value
 * @constructor
 */
function TouchAction(manager, value) {
    this.manager = manager;
    this.set(value);
}

TouchAction.prototype = {
    /**
     * set the touchAction value on the element or enable the polyfill
     * @param {String} value
     */
    set: function(value) {
        // find out the touch-action by the event handlers
        if (value == TOUCH_ACTION_COMPUTE) {
            value = this.compute();
        }

        if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
        }
        this.actions = value.toLowerCase().trim();
    },

    /**
     * just re-set the touchAction value
     */
    update: function() {
        this.set(this.manager.options.touchAction);
    },

    /**
     * compute the value for the touchAction property based on the recognizer's settings
     * @returns {String} value
     */
    compute: function() {
        var actions = [];
        each(this.manager.recognizers, function(recognizer) {
            if (boolOrFn(recognizer.options.enable, [recognizer])) {
                actions = actions.concat(recognizer.getTouchAction());
            }
        });
        return cleanTouchActions(actions.join(' '));
    },

    /**
     * this method is called on each input cycle and provides the preventing of the browser behavior
     * @param {Object} input
     */
    preventDefaults: function(input) {
        var srcEvent = input.srcEvent;
        var direction = input.offsetDirection;

        // if the touch action did prevented once this session
        if (this.manager.session.prevented) {
            srcEvent.preventDefault();
            return;
        }

        var actions = this.actions;
        var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

        if (hasNone) {
            //do not prevent defaults if this is a tap gesture

            var isTapPointer = input.pointers.length === 1;
            var isTapMovement = input.distance < 2;
            var isTapTouchTime = input.deltaTime < 250;

            if (isTapPointer && isTapMovement && isTapTouchTime) {
                return;
            }
        }

        if (hasPanX && hasPanY) {
            // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
            return;
        }

        if (hasNone ||
            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
            (hasPanX && direction & DIRECTION_VERTICAL)) {
            return this.preventSrc(srcEvent);
        }
    },

    /**
     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
     * @param {Object} srcEvent
     */
    preventSrc: function(srcEvent) {
        this.manager.session.prevented = true;
        srcEvent.preventDefault();
    }
};

/**
 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
 * @param {String} actions
 * @returns {*}
 */
function cleanTouchActions(actions) {
    // none
    if (inStr(actions, TOUCH_ACTION_NONE)) {
        return TOUCH_ACTION_NONE;
    }

    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

    // if both pan-x and pan-y are set (different recognizers
    // for different directions, e.g. horizontal pan but vertical swipe?)
    // we need none (as otherwise with pan-x pan-y combined none of these
    // recognizers will work, since the browser would handle all panning
    if (hasPanX && hasPanY) {
        return TOUCH_ACTION_NONE;
    }

    // pan-x OR pan-y
    if (hasPanX || hasPanY) {
        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
    }

    // manipulation
    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
        return TOUCH_ACTION_MANIPULATION;
    }

    return TOUCH_ACTION_AUTO;
}

function getTouchActionProps() {
    if (!NATIVE_TOUCH_ACTION) {
        return false;
    }
    var touchMap = {};
    var cssSupports = window.CSS && window.CSS.supports;
    ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function(val) {

        // If css.supports is not supported but there is native touch-action assume it supports
        // all values. This is the case for IE 10 and 11.
        touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
    });
    return touchMap;
}

/**
 * Recognizer flow explained; *
 * All recognizers have the initial state of POSSIBLE when a input session starts.
 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
 * Example session for mouse-input: mousedown -> mousemove -> mouseup
 *
 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
 * which determines with state it should be.
 *
 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
 * POSSIBLE to give it another change on the next cycle.
 *
 *               Possible
 *                  |
 *            +-----+---------------+
 *            |                     |
 *      +-----+-----+               |
 *      |           |               |
 *   Failed      Cancelled          |
 *                          +-------+------+
 *                          |              |
 *                      Recognized       Began
 *                                         |
 *                                      Changed
 *                                         |
 *                                  Ended/Recognized
 */
var STATE_POSSIBLE = 1;
var STATE_BEGAN = 2;
var STATE_CHANGED = 4;
var STATE_ENDED = 8;
var STATE_RECOGNIZED = STATE_ENDED;
var STATE_CANCELLED = 16;
var STATE_FAILED = 32;

/**
 * Recognizer
 * Every recognizer needs to extend from this class.
 * @constructor
 * @param {Object} options
 */
function Recognizer(options) {
    this.options = assign({}, this.defaults, options || {});

    this.id = uniqueId();

    this.manager = null;

    // default is enable true
    this.options.enable = ifUndefined(this.options.enable, true);

    this.state = STATE_POSSIBLE;

    this.simultaneous = {};
    this.requireFail = [];
}

Recognizer.prototype = {
    /**
     * @virtual
     * @type {Object}
     */
    defaults: {},

    /**
     * set options
     * @param {Object} options
     * @return {Recognizer}
     */
    set: function(options) {
        assign(this.options, options);

        // also update the touchAction, in case something changed about the directions/enabled state
        this.manager && this.manager.touchAction.update();
        return this;
    },

    /**
     * recognize simultaneous with an other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    recognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
            return this;
        }

        var simultaneous = this.simultaneous;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (!simultaneous[otherRecognizer.id]) {
            simultaneous[otherRecognizer.id] = otherRecognizer;
            otherRecognizer.recognizeWith(this);
        }
        return this;
    },

    /**
     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRecognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        delete this.simultaneous[otherRecognizer.id];
        return this;
    },

    /**
     * recognizer can only run when an other is failing
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    requireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
            return this;
        }

        var requireFail = this.requireFail;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (inArray(requireFail, otherRecognizer) === -1) {
            requireFail.push(otherRecognizer);
            otherRecognizer.requireFailure(this);
        }
        return this;
    },

    /**
     * drop the requireFailure link. it does not remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRequireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        var index = inArray(this.requireFail, otherRecognizer);
        if (index > -1) {
            this.requireFail.splice(index, 1);
        }
        return this;
    },

    /**
     * has require failures boolean
     * @returns {boolean}
     */
    hasRequireFailures: function() {
        return this.requireFail.length > 0;
    },

    /**
     * if the recognizer can recognize simultaneous with an other recognizer
     * @param {Recognizer} otherRecognizer
     * @returns {Boolean}
     */
    canRecognizeWith: function(otherRecognizer) {
        return !!this.simultaneous[otherRecognizer.id];
    },

    /**
     * You should use `tryEmit` instead of `emit` directly to check
     * that all the needed recognizers has failed before emitting.
     * @param {Object} input
     */
    emit: function(input) {
        var self = this;
        var state = this.state;

        function emit(event) {
            self.manager.emit(event, input);
        }

        // 'panstart' and 'panmove'
        if (state < STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }

        emit(self.options.event); // simple 'eventName' events

        if (input.additionalEvent) { // additional event(panleft, panright, pinchin, pinchout...)
            emit(input.additionalEvent);
        }

        // panend and pancancel
        if (state >= STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }
    },

    /**
     * Check that all the require failure recognizers has failed,
     * if true, it emits a gesture event,
     * otherwise, setup the state to FAILED.
     * @param {Object} input
     */
    tryEmit: function(input) {
        if (this.canEmit()) {
            return this.emit(input);
        }
        // it's failing anyway
        this.state = STATE_FAILED;
    },

    /**
     * can we emit?
     * @returns {boolean}
     */
    canEmit: function() {
        var i = 0;
        while (i < this.requireFail.length) {
            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                return false;
            }
            i++;
        }
        return true;
    },

    /**
     * update the recognizer
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        // make a new copy of the inputData
        // so we can change the inputData without messing up the other recognizers
        var inputDataClone = assign({}, inputData);

        // is is enabled and allow recognizing?
        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
            this.reset();
            this.state = STATE_FAILED;
            return;
        }

        // reset when we've reached the end
        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
            this.state = STATE_POSSIBLE;
        }

        this.state = this.process(inputDataClone);

        // the recognizer has recognized a gesture
        // so trigger an event
        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
            this.tryEmit(inputDataClone);
        }
    },

    /**
     * return the state of the recognizer
     * the actual recognizing happens in this method
     * @virtual
     * @param {Object} inputData
     * @returns {Const} STATE
     */
    process: function(inputData) { }, // jshint ignore:line

    /**
     * return the preferred touch-action
     * @virtual
     * @returns {Array}
     */
    getTouchAction: function() { },

    /**
     * called when the gesture isn't allowed to recognize
     * like when another is being recognized or it is disabled
     * @virtual
     */
    reset: function() { }
};

/**
 * get a usable string, used as event postfix
 * @param {Const} state
 * @returns {String} state
 */
function stateStr(state) {
    if (state & STATE_CANCELLED) {
        return 'cancel';
    } else if (state & STATE_ENDED) {
        return 'end';
    } else if (state & STATE_CHANGED) {
        return 'move';
    } else if (state & STATE_BEGAN) {
        return 'start';
    }
    return '';
}

/**
 * direction cons to string
 * @param {Const} direction
 * @returns {String}
 */
function directionStr(direction) {
    if (direction == DIRECTION_DOWN) {
        return 'down';
    } else if (direction == DIRECTION_UP) {
        return 'up';
    } else if (direction == DIRECTION_LEFT) {
        return 'left';
    } else if (direction == DIRECTION_RIGHT) {
        return 'right';
    }
    return '';
}

/**
 * get a recognizer by name if it is bound to a manager
 * @param {Recognizer|String} otherRecognizer
 * @param {Recognizer} recognizer
 * @returns {Recognizer}
 */
function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
    var manager = recognizer.manager;
    if (manager) {
        return manager.get(otherRecognizer);
    }
    return otherRecognizer;
}

/**
 * This recognizer is just used as a base for the simple attribute recognizers.
 * @constructor
 * @extends Recognizer
 */
function AttrRecognizer() {
    Recognizer.apply(this, arguments);
}

inherit(AttrRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof AttrRecognizer
     */
    defaults: {
        /**
         * @type {Number}
         * @default 1
         */
        pointers: 1
    },

    /**
     * Used to check if it the recognizer receives valid input, like input.distance > 10.
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {Boolean} recognized
     */
    attrTest: function(input) {
        var optionPointers = this.options.pointers;
        return optionPointers === 0 || input.pointers.length === optionPointers;
    },

    /**
     * Process the input and return the state for the recognizer
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {*} State
     */
    process: function(input) {
        var state = this.state;
        var eventType = input.eventType;

        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
        var isValid = this.attrTest(input);

        // on cancel input and we've recognized before, return STATE_CANCELLED
        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
            return state | STATE_CANCELLED;
        } else if (isRecognized || isValid) {
            if (eventType & INPUT_END) {
                return state | STATE_ENDED;
            } else if (!(state & STATE_BEGAN)) {
                return STATE_BEGAN;
            }
            return state | STATE_CHANGED;
        }
        return STATE_FAILED;
    }
});

/**
 * Pan
 * Recognized when the pointer is down and moved in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function PanRecognizer() {
    AttrRecognizer.apply(this, arguments);

    this.pX = null;
    this.pY = null;
}

inherit(PanRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PanRecognizer
     */
    defaults: {
        event: 'pan',
        threshold: 10,
        pointers: 1,
        direction: DIRECTION_ALL
    },

    getTouchAction: function() {
        var direction = this.options.direction;
        var actions = [];
        if (direction & DIRECTION_HORIZONTAL) {
            actions.push(TOUCH_ACTION_PAN_Y);
        }
        if (direction & DIRECTION_VERTICAL) {
            actions.push(TOUCH_ACTION_PAN_X);
        }
        return actions;
    },

    directionTest: function(input) {
        var options = this.options;
        var hasMoved = true;
        var distance = input.distance;
        var direction = input.direction;
        var x = input.deltaX;
        var y = input.deltaY;

        // lock to axis?
        if (!(direction & options.direction)) {
            if (options.direction & DIRECTION_HORIZONTAL) {
                direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
                hasMoved = x != this.pX;
                distance = Math.abs(input.deltaX);
            } else {
                direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
                hasMoved = y != this.pY;
                distance = Math.abs(input.deltaY);
            }
        }
        input.direction = direction;
        return hasMoved && distance > options.threshold && direction & options.direction;
    },

    attrTest: function(input) {
        return AttrRecognizer.prototype.attrTest.call(this, input) &&
            (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
    },

    emit: function(input) {

        this.pX = input.deltaX;
        this.pY = input.deltaY;

        var direction = directionStr(input.direction);

        if (direction) {
            input.additionalEvent = this.options.event + direction;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Pinch
 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
 * @constructor
 * @extends AttrRecognizer
 */
function PinchRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(PinchRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'pinch',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
    },

    emit: function(input) {
        if (input.scale !== 1) {
            var inOut = input.scale < 1 ? 'in' : 'out';
            input.additionalEvent = this.options.event + inOut;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Press
 * Recognized when the pointer is down for x ms without any movement.
 * @constructor
 * @extends Recognizer
 */
function PressRecognizer() {
    Recognizer.apply(this, arguments);

    this._timer = null;
    this._input = null;
}

inherit(PressRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PressRecognizer
     */
    defaults: {
        event: 'press',
        pointers: 1,
        time: 251, // minimal time of the pointer to be pressed
        threshold: 9 // a minimal movement is ok, but keep it low
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_AUTO];
    },

    process: function(input) {
        var options = this.options;
        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTime = input.deltaTime > options.time;

        this._input = input;

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
            this.reset();
        } else if (input.eventType & INPUT_START) {
            this.reset();
            this._timer = setTimeoutContext(function() {
                this.state = STATE_RECOGNIZED;
                this.tryEmit();
            }, options.time, this);
        } else if (input.eventType & INPUT_END) {
            return STATE_RECOGNIZED;
        }
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function(input) {
        if (this.state !== STATE_RECOGNIZED) {
            return;
        }

        if (input && (input.eventType & INPUT_END)) {
            this.manager.emit(this.options.event + 'up', input);
        } else {
            this._input.timeStamp = now();
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Rotate
 * Recognized when two or more pointer are moving in a circular motion.
 * @constructor
 * @extends AttrRecognizer
 */
function RotateRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(RotateRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof RotateRecognizer
     */
    defaults: {
        event: 'rotate',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
    }
});

/**
 * Swipe
 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function SwipeRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(SwipeRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof SwipeRecognizer
     */
    defaults: {
        event: 'swipe',
        threshold: 10,
        velocity: 0.3,
        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
        pointers: 1
    },

    getTouchAction: function() {
        return PanRecognizer.prototype.getTouchAction.call(this);
    },

    attrTest: function(input) {
        var direction = this.options.direction;
        var velocity;

        if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
            velocity = input.overallVelocity;
        } else if (direction & DIRECTION_HORIZONTAL) {
            velocity = input.overallVelocityX;
        } else if (direction & DIRECTION_VERTICAL) {
            velocity = input.overallVelocityY;
        }

        return this._super.attrTest.call(this, input) &&
            direction & input.offsetDirection &&
            input.distance > this.options.threshold &&
            input.maxPointers == this.options.pointers &&
            abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
    },

    emit: function(input) {
        var direction = directionStr(input.offsetDirection);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this.manager.emit(this.options.event, input);
    }
});

/**
 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
 * a single tap.
 *
 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
 * multi-taps being recognized.
 * @constructor
 * @extends Recognizer
 */
function TapRecognizer() {
    Recognizer.apply(this, arguments);

    // previous time and center,
    // used for tap counting
    this.pTime = false;
    this.pCenter = false;

    this._timer = null;
    this._input = null;
    this.count = 0;
}

inherit(TapRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'tap',
        pointers: 1,
        taps: 1,
        interval: 300, // max time between the multi-tap taps
        time: 250, // max time of the pointer to be down (like finger on the screen)
        threshold: 9, // a minimal movement is ok, but keep it low
        posThreshold: 10 // a multi-tap can be a bit off the initial position
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_MANIPULATION];
    },

    process: function(input) {
        var options = this.options;

        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTouchTime = input.deltaTime < options.time;

        this.reset();

        if ((input.eventType & INPUT_START) && (this.count === 0)) {
            return this.failTimeout();
        }

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (validMovement && validTouchTime && validPointers) {
            if (input.eventType != INPUT_END) {
                return this.failTimeout();
            }

            var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

            this.pTime = input.timeStamp;
            this.pCenter = input.center;

            if (!validMultiTap || !validInterval) {
                this.count = 1;
            } else {
                this.count += 1;
            }

            this._input = input;

            // if tap count matches we have recognized it,
            // else it has began recognizing...
            var tapCount = this.count % options.taps;
            if (tapCount === 0) {
                // no failing requirements, immediately trigger the tap event
                // or wait as long as the multitap interval to trigger
                if (!this.hasRequireFailures()) {
                    return STATE_RECOGNIZED;
                } else {
                    this._timer = setTimeoutContext(function() {
                        this.state = STATE_RECOGNIZED;
                        this.tryEmit();
                    }, options.interval, this);
                    return STATE_BEGAN;
                }
            }
        }
        return STATE_FAILED;
    },

    failTimeout: function() {
        this._timer = setTimeoutContext(function() {
            this.state = STATE_FAILED;
        }, this.options.interval, this);
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function() {
        if (this.state == STATE_RECOGNIZED) {
            this._input.tapCount = this.count;
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Simple way to create a manager with a default set of recognizers.
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Hammer(element, options) {
    options = options || {};
    options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
    return new Manager(element, options);
}

/**
 * @const {string}
 */
Hammer.VERSION = '2.0.7';

/**
 * default settings
 * @namespace
 */
Hammer.defaults = {
    /**
     * set if DOM events are being triggered.
     * But this is slower and unused by simple implementations, so disabled by default.
     * @type {Boolean}
     * @default false
     */
    domEvents: false,

    /**
     * The value for the touchAction property/fallback.
     * When set to `compute` it will magically set the correct value based on the added recognizers.
     * @type {String}
     * @default compute
     */
    touchAction: TOUCH_ACTION_COMPUTE,

    /**
     * @type {Boolean}
     * @default true
     */
    enable: true,

    /**
     * EXPERIMENTAL FEATURE -- can be removed/changed
     * Change the parent input target element.
     * If Null, then it is being set the to main element.
     * @type {Null|EventTarget}
     * @default null
     */
    inputTarget: null,

    /**
     * force an input class
     * @type {Null|Function}
     * @default null
     */
    inputClass: null,

    /**
     * Default recognizer setup when calling `Hammer()`
     * When creating a new Manager these will be skipped.
     * @type {Array}
     */
    preset: [
        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
        [RotateRecognizer, {enable: false}],
        [PinchRecognizer, {enable: false}, ['rotate']],
        [SwipeRecognizer, {direction: DIRECTION_HORIZONTAL}],
        [PanRecognizer, {direction: DIRECTION_HORIZONTAL}, ['swipe']],
        [TapRecognizer],
        [TapRecognizer, {event: 'doubletap', taps: 2}, ['tap']],
        [PressRecognizer]
    ],

    /**
     * Some CSS properties can be used to improve the working of Hammer.
     * Add them to this method and they will be set when creating a new Manager.
     * @namespace
     */
    cssProps: {
        /**
         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userSelect: 'none',

        /**
         * Disable the Windows Phone grippers when pressing an element.
         * @type {String}
         * @default 'none'
         */
        touchSelect: 'none',

        /**
         * Disables the default callout shown when you touch and hold a touch target.
         * On iOS, when you touch and hold a touch target such as a link, Safari displays
         * a callout containing information about the link. This property allows you to disable that callout.
         * @type {String}
         * @default 'none'
         */
        touchCallout: 'none',

        /**
         * Specifies whether zooming is enabled. Used by IE10>
         * @type {String}
         * @default 'none'
         */
        contentZooming: 'none',

        /**
         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userDrag: 'none',

        /**
         * Overrides the highlight color shown when the user taps a link or a JavaScript
         * clickable element in iOS. This property obeys the alpha value, if specified.
         * @type {String}
         * @default 'rgba(0,0,0,0)'
         */
        tapHighlightColor: 'rgba(0,0,0,0)'
    }
};

var STOP = 1;
var FORCED_STOP = 2;

/**
 * Manager
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Manager(element, options) {
    this.options = assign({}, Hammer.defaults, options || {});

    this.options.inputTarget = this.options.inputTarget || element;

    this.handlers = {};
    this.session = {};
    this.recognizers = [];
    this.oldCssProps = {};

    this.element = element;
    this.input = createInputInstance(this);
    this.touchAction = new TouchAction(this, this.options.touchAction);

    toggleCssProps(this, true);

    each(this.options.recognizers, function(item) {
        var recognizer = this.add(new (item[0])(item[1]));
        item[2] && recognizer.recognizeWith(item[2]);
        item[3] && recognizer.requireFailure(item[3]);
    }, this);
}

Manager.prototype = {
    /**
     * set options
     * @param {Object} options
     * @returns {Manager}
     */
    set: function(options) {
        assign(this.options, options);

        // Options that need a little more setup
        if (options.touchAction) {
            this.touchAction.update();
        }
        if (options.inputTarget) {
            // Clean up existing event listeners and reinitialize
            this.input.destroy();
            this.input.target = options.inputTarget;
            this.input.init();
        }
        return this;
    },

    /**
     * stop recognizing for this session.
     * This session will be discarded, when a new [input]start event is fired.
     * When forced, the recognizer cycle is stopped immediately.
     * @param {Boolean} [force]
     */
    stop: function(force) {
        this.session.stopped = force ? FORCED_STOP : STOP;
    },

    /**
     * run the recognizers!
     * called by the inputHandler function on every movement of the pointers (touches)
     * it walks through all the recognizers and tries to detect the gesture that is being made
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        var session = this.session;
        if (session.stopped) {
            return;
        }

        // run the touch-action polyfill
        this.touchAction.preventDefaults(inputData);

        var recognizer;
        var recognizers = this.recognizers;

        // this holds the recognizer that is being recognized.
        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
        // if no recognizer is detecting a thing, it is set to `null`
        var curRecognizer = session.curRecognizer;

        // reset when the last recognizer is recognized
        // or when we're in a new session
        if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
            curRecognizer = session.curRecognizer = null;
        }

        var i = 0;
        while (i < recognizers.length) {
            recognizer = recognizers[i];

            // find out if we are allowed try to recognize the input for this one.
            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
            //      that is being recognized.
            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
            //      this can be setup with the `recognizeWith()` method on the recognizer.
            if (session.stopped !== FORCED_STOP && ( // 1
                    !curRecognizer || recognizer == curRecognizer || // 2
                    recognizer.canRecognizeWith(curRecognizer))) { // 3
                recognizer.recognize(inputData);
            } else {
                recognizer.reset();
            }

            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
            // current active recognizer. but only if we don't already have an active recognizer
            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                curRecognizer = session.curRecognizer = recognizer;
            }
            i++;
        }
    },

    /**
     * get a recognizer by its event name.
     * @param {Recognizer|String} recognizer
     * @returns {Recognizer|Null}
     */
    get: function(recognizer) {
        if (recognizer instanceof Recognizer) {
            return recognizer;
        }

        var recognizers = this.recognizers;
        for (var i = 0; i < recognizers.length; i++) {
            if (recognizers[i].options.event == recognizer) {
                return recognizers[i];
            }
        }
        return null;
    },

    /**
     * add a recognizer to the manager
     * existing recognizers with the same event name will be removed
     * @param {Recognizer} recognizer
     * @returns {Recognizer|Manager}
     */
    add: function(recognizer) {
        if (invokeArrayArg(recognizer, 'add', this)) {
            return this;
        }

        // remove existing
        var existing = this.get(recognizer.options.event);
        if (existing) {
            this.remove(existing);
        }

        this.recognizers.push(recognizer);
        recognizer.manager = this;

        this.touchAction.update();
        return recognizer;
    },

    /**
     * remove a recognizer by name or instance
     * @param {Recognizer|String} recognizer
     * @returns {Manager}
     */
    remove: function(recognizer) {
        if (invokeArrayArg(recognizer, 'remove', this)) {
            return this;
        }

        recognizer = this.get(recognizer);

        // let's make sure this recognizer exists
        if (recognizer) {
            var recognizers = this.recognizers;
            var index = inArray(recognizers, recognizer);

            if (index !== -1) {
                recognizers.splice(index, 1);
                this.touchAction.update();
            }
        }

        return this;
    },

    /**
     * bind event
     * @param {String} events
     * @param {Function} handler
     * @returns {EventEmitter} this
     */
    on: function(events, handler) {
        if (events === undefined) {
            return;
        }
        if (handler === undefined) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            handlers[event] = handlers[event] || [];
            handlers[event].push(handler);
        });
        return this;
    },

    /**
     * unbind event, leave emit blank to remove all handlers
     * @param {String} events
     * @param {Function} [handler]
     * @returns {EventEmitter} this
     */
    off: function(events, handler) {
        if (events === undefined) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            if (!handler) {
                delete handlers[event];
            } else {
                handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
            }
        });
        return this;
    },

    /**
     * emit event to the listeners
     * @param {String} event
     * @param {Object} data
     */
    emit: function(event, data) {
        // we also want to trigger dom events
        if (this.options.domEvents) {
            triggerDomEvent(event, data);
        }

        // no handlers, so skip it all
        var handlers = this.handlers[event] && this.handlers[event].slice();
        if (!handlers || !handlers.length) {
            return;
        }

        data.type = event;
        data.preventDefault = function() {
            data.srcEvent.preventDefault();
        };

        var i = 0;
        while (i < handlers.length) {
            handlers[i](data);
            i++;
        }
    },

    /**
     * destroy the manager and unbinds all events
     * it doesn't unbind dom events, that is the user own responsibility
     */
    destroy: function() {
        this.element && toggleCssProps(this, false);

        this.handlers = {};
        this.session = {};
        this.input.destroy();
        this.element = null;
    }
};

/**
 * add/remove the css properties as defined in manager.options.cssProps
 * @param {Manager} manager
 * @param {Boolean} add
 */
function toggleCssProps(manager, add) {
    var element = manager.element;
    if (!element.style) {
        return;
    }
    var prop;
    each(manager.options.cssProps, function(value, name) {
        prop = prefixed(element.style, name);
        if (add) {
            manager.oldCssProps[prop] = element.style[prop];
            element.style[prop] = value;
        } else {
            element.style[prop] = manager.oldCssProps[prop] || '';
        }
    });
    if (!add) {
        manager.oldCssProps = {};
    }
}

/**
 * trigger dom event
 * @param {String} event
 * @param {Object} data
 */
function triggerDomEvent(event, data) {
    var gestureEvent = document.createEvent('Event');
    gestureEvent.initEvent(event, true, true);
    gestureEvent.gesture = data;
    data.target.dispatchEvent(gestureEvent);
}

assign(Hammer, {
    INPUT_START: INPUT_START,
    INPUT_MOVE: INPUT_MOVE,
    INPUT_END: INPUT_END,
    INPUT_CANCEL: INPUT_CANCEL,

    STATE_POSSIBLE: STATE_POSSIBLE,
    STATE_BEGAN: STATE_BEGAN,
    STATE_CHANGED: STATE_CHANGED,
    STATE_ENDED: STATE_ENDED,
    STATE_RECOGNIZED: STATE_RECOGNIZED,
    STATE_CANCELLED: STATE_CANCELLED,
    STATE_FAILED: STATE_FAILED,

    DIRECTION_NONE: DIRECTION_NONE,
    DIRECTION_LEFT: DIRECTION_LEFT,
    DIRECTION_RIGHT: DIRECTION_RIGHT,
    DIRECTION_UP: DIRECTION_UP,
    DIRECTION_DOWN: DIRECTION_DOWN,
    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
    DIRECTION_ALL: DIRECTION_ALL,

    Manager: Manager,
    Input: Input,
    TouchAction: TouchAction,

    TouchInput: TouchInput,
    MouseInput: MouseInput,
    PointerEventInput: PointerEventInput,
    TouchMouseInput: TouchMouseInput,
    SingleTouchInput: SingleTouchInput,

    Recognizer: Recognizer,
    AttrRecognizer: AttrRecognizer,
    Tap: TapRecognizer,
    Pan: PanRecognizer,
    Swipe: SwipeRecognizer,
    Pinch: PinchRecognizer,
    Rotate: RotateRecognizer,
    Press: PressRecognizer,

    on: addEventListeners,
    off: removeEventListeners,
    each: each,
    merge: merge,
    extend: extend,
    assign: assign,
    inherit: inherit,
    bindFn: bindFn,
    prefixed: prefixed
});

// this prevents errors when Hammer is loaded in the presence of an AMD
//  style loader but by script tag, not by the loader.
var freeGlobal = (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {})); // jshint ignore:line
freeGlobal.Hammer = Hammer;

if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
        return Hammer;
    }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {}

})(window, document, 'Hammer');


/***/ }),

/***/ "./node_modules/zone.js/dist/zone.js":
/*!*******************************************!*\
  !*** ./node_modules/zone.js/dist/zone.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
* @license
* Copyright Google Inc. All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://angular.io/license
*/
(function (global, factory) {
	 true ? factory() :
	undefined;
}(this, (function () { 'use strict';

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var Zone$1 = (function (global) {
    var performance = global['performance'];
    function mark(name) {
        performance && performance['mark'] && performance['mark'](name);
    }
    function performanceMeasure(name, label) {
        performance && performance['measure'] && performance['measure'](name, label);
    }
    mark('Zone');
    var checkDuplicate = global[('__zone_symbol__forceDuplicateZoneCheck')] === true;
    if (global['Zone']) {
        // if global['Zone'] already exists (maybe zone.js was already loaded or
        // some other lib also registered a global object named Zone), we may need
        // to throw an error, but sometimes user may not want this error.
        // For example,
        // we have two web pages, page1 includes zone.js, page2 doesn't.
        // and the 1st time user load page1 and page2, everything work fine,
        // but when user load page2 again, error occurs because global['Zone'] already exists.
        // so we add a flag to let user choose whether to throw this error or not.
        // By default, if existing Zone is from zone.js, we will not throw the error.
        if (checkDuplicate || typeof global['Zone'].__symbol__ !== 'function') {
            throw new Error('Zone already loaded.');
        }
        else {
            return global['Zone'];
        }
    }
    var Zone = /** @class */ (function () {
        function Zone(parent, zoneSpec) {
            this._parent = parent;
            this._name = zoneSpec ? zoneSpec.name || 'unnamed' : '<root>';
            this._properties = zoneSpec && zoneSpec.properties || {};
            this._zoneDelegate =
                new ZoneDelegate(this, this._parent && this._parent._zoneDelegate, zoneSpec);
        }
        Zone.assertZonePatched = function () {
            if (global['Promise'] !== patches['ZoneAwarePromise']) {
                throw new Error('Zone.js has detected that ZoneAwarePromise `(window|global).Promise` ' +
                    'has been overwritten.\n' +
                    'Most likely cause is that a Promise polyfill has been loaded ' +
                    'after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. ' +
                    'If you must load one, do so before loading zone.js.)');
            }
        };
        Object.defineProperty(Zone, "root", {
            get: function () {
                var zone = Zone.current;
                while (zone.parent) {
                    zone = zone.parent;
                }
                return zone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Zone, "current", {
            get: function () {
                return _currentZoneFrame.zone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Zone, "currentTask", {
            get: function () {
                return _currentTask;
            },
            enumerable: true,
            configurable: true
        });
        Zone.__load_patch = function (name, fn) {
            if (patches.hasOwnProperty(name)) {
                if (checkDuplicate) {
                    throw Error('Already loaded patch: ' + name);
                }
            }
            else if (!global['__Zone_disable_' + name]) {
                var perfName = 'Zone:' + name;
                mark(perfName);
                patches[name] = fn(global, Zone, _api);
                performanceMeasure(perfName, perfName);
            }
        };
        Object.defineProperty(Zone.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Zone.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Zone.prototype.get = function (key) {
            var zone = this.getZoneWith(key);
            if (zone)
                return zone._properties[key];
        };
        Zone.prototype.getZoneWith = function (key) {
            var current = this;
            while (current) {
                if (current._properties.hasOwnProperty(key)) {
                    return current;
                }
                current = current._parent;
            }
            return null;
        };
        Zone.prototype.fork = function (zoneSpec) {
            if (!zoneSpec)
                throw new Error('ZoneSpec required!');
            return this._zoneDelegate.fork(this, zoneSpec);
        };
        Zone.prototype.wrap = function (callback, source) {
            if (typeof callback !== 'function') {
                throw new Error('Expecting function got: ' + callback);
            }
            var _callback = this._zoneDelegate.intercept(this, callback, source);
            var zone = this;
            return function () {
                return zone.runGuarded(_callback, this, arguments, source);
            };
        };
        Zone.prototype.run = function (callback, applyThis, applyArgs, source) {
            _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
            try {
                return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
            }
            finally {
                _currentZoneFrame = _currentZoneFrame.parent;
            }
        };
        Zone.prototype.runGuarded = function (callback, applyThis, applyArgs, source) {
            if (applyThis === void 0) { applyThis = null; }
            _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
            try {
                try {
                    return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
                }
                catch (error) {
                    if (this._zoneDelegate.handleError(this, error)) {
                        throw error;
                    }
                }
            }
            finally {
                _currentZoneFrame = _currentZoneFrame.parent;
            }
        };
        Zone.prototype.runTask = function (task, applyThis, applyArgs) {
            if (task.zone != this) {
                throw new Error('A task can only be run in the zone of creation! (Creation: ' +
                    (task.zone || NO_ZONE).name + '; Execution: ' + this.name + ')');
            }
            // https://github.com/angular/zone.js/issues/778, sometimes eventTask
            // will run in notScheduled(canceled) state, we should not try to
            // run such kind of task but just return
            if (task.state === notScheduled && (task.type === eventTask || task.type === macroTask)) {
                return;
            }
            var reEntryGuard = task.state != running;
            reEntryGuard && task._transitionTo(running, scheduled);
            task.runCount++;
            var previousTask = _currentTask;
            _currentTask = task;
            _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
            try {
                if (task.type == macroTask && task.data && !task.data.isPeriodic) {
                    task.cancelFn = undefined;
                }
                try {
                    return this._zoneDelegate.invokeTask(this, task, applyThis, applyArgs);
                }
                catch (error) {
                    if (this._zoneDelegate.handleError(this, error)) {
                        throw error;
                    }
                }
            }
            finally {
                // if the task's state is notScheduled or unknown, then it has already been cancelled
                // we should not reset the state to scheduled
                if (task.state !== notScheduled && task.state !== unknown) {
                    if (task.type == eventTask || (task.data && task.data.isPeriodic)) {
                        reEntryGuard && task._transitionTo(scheduled, running);
                    }
                    else {
                        task.runCount = 0;
                        this._updateTaskCount(task, -1);
                        reEntryGuard &&
                            task._transitionTo(notScheduled, running, notScheduled);
                    }
                }
                _currentZoneFrame = _currentZoneFrame.parent;
                _currentTask = previousTask;
            }
        };
        Zone.prototype.scheduleTask = function (task) {
            if (task.zone && task.zone !== this) {
                // check if the task was rescheduled, the newZone
                // should not be the children of the original zone
                var newZone = this;
                while (newZone) {
                    if (newZone === task.zone) {
                        throw Error("can not reschedule task to " + this.name + " which is descendants of the original zone " + task.zone.name);
                    }
                    newZone = newZone.parent;
                }
            }
            task._transitionTo(scheduling, notScheduled);
            var zoneDelegates = [];
            task._zoneDelegates = zoneDelegates;
            task._zone = this;
            try {
                task = this._zoneDelegate.scheduleTask(this, task);
            }
            catch (err) {
                // should set task's state to unknown when scheduleTask throw error
                // because the err may from reschedule, so the fromState maybe notScheduled
                task._transitionTo(unknown, scheduling, notScheduled);
                // TODO: @JiaLiPassion, should we check the result from handleError?
                this._zoneDelegate.handleError(this, err);
                throw err;
            }
            if (task._zoneDelegates === zoneDelegates) {
                // we have to check because internally the delegate can reschedule the task.
                this._updateTaskCount(task, 1);
            }
            if (task.state == scheduling) {
                task._transitionTo(scheduled, scheduling);
            }
            return task;
        };
        Zone.prototype.scheduleMicroTask = function (source, callback, data, customSchedule) {
            return this.scheduleTask(new ZoneTask(microTask, source, callback, data, customSchedule, undefined));
        };
        Zone.prototype.scheduleMacroTask = function (source, callback, data, customSchedule, customCancel) {
            return this.scheduleTask(new ZoneTask(macroTask, source, callback, data, customSchedule, customCancel));
        };
        Zone.prototype.scheduleEventTask = function (source, callback, data, customSchedule, customCancel) {
            return this.scheduleTask(new ZoneTask(eventTask, source, callback, data, customSchedule, customCancel));
        };
        Zone.prototype.cancelTask = function (task) {
            if (task.zone != this)
                throw new Error('A task can only be cancelled in the zone of creation! (Creation: ' +
                    (task.zone || NO_ZONE).name + '; Execution: ' + this.name + ')');
            task._transitionTo(canceling, scheduled, running);
            try {
                this._zoneDelegate.cancelTask(this, task);
            }
            catch (err) {
                // if error occurs when cancelTask, transit the state to unknown
                task._transitionTo(unknown, canceling);
                this._zoneDelegate.handleError(this, err);
                throw err;
            }
            this._updateTaskCount(task, -1);
            task._transitionTo(notScheduled, canceling);
            task.runCount = 0;
            return task;
        };
        Zone.prototype._updateTaskCount = function (task, count) {
            var zoneDelegates = task._zoneDelegates;
            if (count == -1) {
                task._zoneDelegates = null;
            }
            for (var i = 0; i < zoneDelegates.length; i++) {
                zoneDelegates[i]._updateTaskCount(task.type, count);
            }
        };
        Zone.__symbol__ = __symbol__;
        return Zone;
    }());
    var DELEGATE_ZS = {
        name: '',
        onHasTask: function (delegate, _, target, hasTaskState) { return delegate.hasTask(target, hasTaskState); },
        onScheduleTask: function (delegate, _, target, task) {
            return delegate.scheduleTask(target, task);
        },
        onInvokeTask: function (delegate, _, target, task, applyThis, applyArgs) {
            return delegate.invokeTask(target, task, applyThis, applyArgs);
        },
        onCancelTask: function (delegate, _, target, task) { return delegate.cancelTask(target, task); }
    };
    var ZoneDelegate = /** @class */ (function () {
        function ZoneDelegate(zone, parentDelegate, zoneSpec) {
            this._taskCounts = { 'microTask': 0, 'macroTask': 0, 'eventTask': 0 };
            this.zone = zone;
            this._parentDelegate = parentDelegate;
            this._forkZS = zoneSpec && (zoneSpec && zoneSpec.onFork ? zoneSpec : parentDelegate._forkZS);
            this._forkDlgt = zoneSpec && (zoneSpec.onFork ? parentDelegate : parentDelegate._forkDlgt);
            this._forkCurrZone = zoneSpec && (zoneSpec.onFork ? this.zone : parentDelegate.zone);
            this._interceptZS =
                zoneSpec && (zoneSpec.onIntercept ? zoneSpec : parentDelegate._interceptZS);
            this._interceptDlgt =
                zoneSpec && (zoneSpec.onIntercept ? parentDelegate : parentDelegate._interceptDlgt);
            this._interceptCurrZone =
                zoneSpec && (zoneSpec.onIntercept ? this.zone : parentDelegate.zone);
            this._invokeZS = zoneSpec && (zoneSpec.onInvoke ? zoneSpec : parentDelegate._invokeZS);
            this._invokeDlgt =
                zoneSpec && (zoneSpec.onInvoke ? parentDelegate : parentDelegate._invokeDlgt);
            this._invokeCurrZone = zoneSpec && (zoneSpec.onInvoke ? this.zone : parentDelegate.zone);
            this._handleErrorZS =
                zoneSpec && (zoneSpec.onHandleError ? zoneSpec : parentDelegate._handleErrorZS);
            this._handleErrorDlgt =
                zoneSpec && (zoneSpec.onHandleError ? parentDelegate : parentDelegate._handleErrorDlgt);
            this._handleErrorCurrZone =
                zoneSpec && (zoneSpec.onHandleError ? this.zone : parentDelegate.zone);
            this._scheduleTaskZS =
                zoneSpec && (zoneSpec.onScheduleTask ? zoneSpec : parentDelegate._scheduleTaskZS);
            this._scheduleTaskDlgt = zoneSpec &&
                (zoneSpec.onScheduleTask ? parentDelegate : parentDelegate._scheduleTaskDlgt);
            this._scheduleTaskCurrZone =
                zoneSpec && (zoneSpec.onScheduleTask ? this.zone : parentDelegate.zone);
            this._invokeTaskZS =
                zoneSpec && (zoneSpec.onInvokeTask ? zoneSpec : parentDelegate._invokeTaskZS);
            this._invokeTaskDlgt =
                zoneSpec && (zoneSpec.onInvokeTask ? parentDelegate : parentDelegate._invokeTaskDlgt);
            this._invokeTaskCurrZone =
                zoneSpec && (zoneSpec.onInvokeTask ? this.zone : parentDelegate.zone);
            this._cancelTaskZS =
                zoneSpec && (zoneSpec.onCancelTask ? zoneSpec : parentDelegate._cancelTaskZS);
            this._cancelTaskDlgt =
                zoneSpec && (zoneSpec.onCancelTask ? parentDelegate : parentDelegate._cancelTaskDlgt);
            this._cancelTaskCurrZone =
                zoneSpec && (zoneSpec.onCancelTask ? this.zone : parentDelegate.zone);
            this._hasTaskZS = null;
            this._hasTaskDlgt = null;
            this._hasTaskDlgtOwner = null;
            this._hasTaskCurrZone = null;
            var zoneSpecHasTask = zoneSpec && zoneSpec.onHasTask;
            var parentHasTask = parentDelegate && parentDelegate._hasTaskZS;
            if (zoneSpecHasTask || parentHasTask) {
                // If we need to report hasTask, than this ZS needs to do ref counting on tasks. In such
                // a case all task related interceptors must go through this ZD. We can't short circuit it.
                this._hasTaskZS = zoneSpecHasTask ? zoneSpec : DELEGATE_ZS;
                this._hasTaskDlgt = parentDelegate;
                this._hasTaskDlgtOwner = this;
                this._hasTaskCurrZone = zone;
                if (!zoneSpec.onScheduleTask) {
                    this._scheduleTaskZS = DELEGATE_ZS;
                    this._scheduleTaskDlgt = parentDelegate;
                    this._scheduleTaskCurrZone = this.zone;
                }
                if (!zoneSpec.onInvokeTask) {
                    this._invokeTaskZS = DELEGATE_ZS;
                    this._invokeTaskDlgt = parentDelegate;
                    this._invokeTaskCurrZone = this.zone;
                }
                if (!zoneSpec.onCancelTask) {
                    this._cancelTaskZS = DELEGATE_ZS;
                    this._cancelTaskDlgt = parentDelegate;
                    this._cancelTaskCurrZone = this.zone;
                }
            }
        }
        ZoneDelegate.prototype.fork = function (targetZone, zoneSpec) {
            return this._forkZS ? this._forkZS.onFork(this._forkDlgt, this.zone, targetZone, zoneSpec) :
                new Zone(targetZone, zoneSpec);
        };
        ZoneDelegate.prototype.intercept = function (targetZone, callback, source) {
            return this._interceptZS ?
                this._interceptZS.onIntercept(this._interceptDlgt, this._interceptCurrZone, targetZone, callback, source) :
                callback;
        };
        ZoneDelegate.prototype.invoke = function (targetZone, callback, applyThis, applyArgs, source) {
            return this._invokeZS ? this._invokeZS.onInvoke(this._invokeDlgt, this._invokeCurrZone, targetZone, callback, applyThis, applyArgs, source) :
                callback.apply(applyThis, applyArgs);
        };
        ZoneDelegate.prototype.handleError = function (targetZone, error) {
            return this._handleErrorZS ?
                this._handleErrorZS.onHandleError(this._handleErrorDlgt, this._handleErrorCurrZone, targetZone, error) :
                true;
        };
        ZoneDelegate.prototype.scheduleTask = function (targetZone, task) {
            var returnTask = task;
            if (this._scheduleTaskZS) {
                if (this._hasTaskZS) {
                    returnTask._zoneDelegates.push(this._hasTaskDlgtOwner);
                }
                returnTask = this._scheduleTaskZS.onScheduleTask(this._scheduleTaskDlgt, this._scheduleTaskCurrZone, targetZone, task);
                if (!returnTask)
                    returnTask = task;
            }
            else {
                if (task.scheduleFn) {
                    task.scheduleFn(task);
                }
                else if (task.type == microTask) {
                    scheduleMicroTask(task);
                }
                else {
                    throw new Error('Task is missing scheduleFn.');
                }
            }
            return returnTask;
        };
        ZoneDelegate.prototype.invokeTask = function (targetZone, task, applyThis, applyArgs) {
            return this._invokeTaskZS ? this._invokeTaskZS.onInvokeTask(this._invokeTaskDlgt, this._invokeTaskCurrZone, targetZone, task, applyThis, applyArgs) :
                task.callback.apply(applyThis, applyArgs);
        };
        ZoneDelegate.prototype.cancelTask = function (targetZone, task) {
            var value;
            if (this._cancelTaskZS) {
                value = this._cancelTaskZS.onCancelTask(this._cancelTaskDlgt, this._cancelTaskCurrZone, targetZone, task);
            }
            else {
                if (!task.cancelFn) {
                    throw Error('Task is not cancelable');
                }
                value = task.cancelFn(task);
            }
            return value;
        };
        ZoneDelegate.prototype.hasTask = function (targetZone, isEmpty) {
            // hasTask should not throw error so other ZoneDelegate
            // can still trigger hasTask callback
            try {
                this._hasTaskZS &&
                    this._hasTaskZS.onHasTask(this._hasTaskDlgt, this._hasTaskCurrZone, targetZone, isEmpty);
            }
            catch (err) {
                this.handleError(targetZone, err);
            }
        };
        ZoneDelegate.prototype._updateTaskCount = function (type, count) {
            var counts = this._taskCounts;
            var prev = counts[type];
            var next = counts[type] = prev + count;
            if (next < 0) {
                throw new Error('More tasks executed then were scheduled.');
            }
            if (prev == 0 || next == 0) {
                var isEmpty = {
                    microTask: counts['microTask'] > 0,
                    macroTask: counts['macroTask'] > 0,
                    eventTask: counts['eventTask'] > 0,
                    change: type
                };
                this.hasTask(this.zone, isEmpty);
            }
        };
        return ZoneDelegate;
    }());
    var ZoneTask = /** @class */ (function () {
        function ZoneTask(type, source, callback, options, scheduleFn, cancelFn) {
            this._zone = null;
            this.runCount = 0;
            this._zoneDelegates = null;
            this._state = 'notScheduled';
            this.type = type;
            this.source = source;
            this.data = options;
            this.scheduleFn = scheduleFn;
            this.cancelFn = cancelFn;
            this.callback = callback;
            var self = this;
            // TODO: @JiaLiPassion options should have interface
            if (type === eventTask && options && options.useG) {
                this.invoke = ZoneTask.invokeTask;
            }
            else {
                this.invoke = function () {
                    return ZoneTask.invokeTask.call(global, self, this, arguments);
                };
            }
        }
        ZoneTask.invokeTask = function (task, target, args) {
            if (!task) {
                task = this;
            }
            _numberOfNestedTaskFrames++;
            try {
                task.runCount++;
                return task.zone.runTask(task, target, args);
            }
            finally {
                if (_numberOfNestedTaskFrames == 1) {
                    drainMicroTaskQueue();
                }
                _numberOfNestedTaskFrames--;
            }
        };
        Object.defineProperty(ZoneTask.prototype, "zone", {
            get: function () {
                return this._zone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ZoneTask.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        ZoneTask.prototype.cancelScheduleRequest = function () {
            this._transitionTo(notScheduled, scheduling);
        };
        ZoneTask.prototype._transitionTo = function (toState, fromState1, fromState2) {
            if (this._state === fromState1 || this._state === fromState2) {
                this._state = toState;
                if (toState == notScheduled) {
                    this._zoneDelegates = null;
                }
            }
            else {
                throw new Error(this.type + " '" + this.source + "': can not transition to '" + toState + "', expecting state '" + fromState1 + "'" + (fromState2 ? ' or \'' + fromState2 + '\'' : '') + ", was '" + this._state + "'.");
            }
        };
        ZoneTask.prototype.toString = function () {
            if (this.data && typeof this.data.handleId !== 'undefined') {
                return this.data.handleId.toString();
            }
            else {
                return Object.prototype.toString.call(this);
            }
        };
        // add toJSON method to prevent cyclic error when
        // call JSON.stringify(zoneTask)
        ZoneTask.prototype.toJSON = function () {
            return {
                type: this.type,
                state: this.state,
                source: this.source,
                zone: this.zone.name,
                runCount: this.runCount
            };
        };
        return ZoneTask;
    }());
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    ///  MICROTASK QUEUE
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    var symbolSetTimeout = __symbol__('setTimeout');
    var symbolPromise = __symbol__('Promise');
    var symbolThen = __symbol__('then');
    var _microTaskQueue = [];
    var _isDrainingMicrotaskQueue = false;
    var nativeMicroTaskQueuePromise;
    function scheduleMicroTask(task) {
        // if we are not running in any task, and there has not been anything scheduled
        // we must bootstrap the initial task creation by manually scheduling the drain
        if (_numberOfNestedTaskFrames === 0 && _microTaskQueue.length === 0) {
            // We are not running in Task, so we need to kickstart the microtask queue.
            if (!nativeMicroTaskQueuePromise) {
                if (global[symbolPromise]) {
                    nativeMicroTaskQueuePromise = global[symbolPromise].resolve(0);
                }
            }
            if (nativeMicroTaskQueuePromise) {
                var nativeThen = nativeMicroTaskQueuePromise[symbolThen];
                if (!nativeThen) {
                    // native Promise is not patchable, we need to use `then` directly
                    // issue 1078
                    nativeThen = nativeMicroTaskQueuePromise['then'];
                }
                nativeThen.call(nativeMicroTaskQueuePromise, drainMicroTaskQueue);
            }
            else {
                global[symbolSetTimeout](drainMicroTaskQueue, 0);
            }
        }
        task && _microTaskQueue.push(task);
    }
    function drainMicroTaskQueue() {
        if (!_isDrainingMicrotaskQueue) {
            _isDrainingMicrotaskQueue = true;
            while (_microTaskQueue.length) {
                var queue = _microTaskQueue;
                _microTaskQueue = [];
                for (var i = 0; i < queue.length; i++) {
                    var task = queue[i];
                    try {
                        task.zone.runTask(task, null, null);
                    }
                    catch (error) {
                        _api.onUnhandledError(error);
                    }
                }
            }
            _api.microtaskDrainDone();
            _isDrainingMicrotaskQueue = false;
        }
    }
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    ///  BOOTSTRAP
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    var NO_ZONE = { name: 'NO ZONE' };
    var notScheduled = 'notScheduled', scheduling = 'scheduling', scheduled = 'scheduled', running = 'running', canceling = 'canceling', unknown = 'unknown';
    var microTask = 'microTask', macroTask = 'macroTask', eventTask = 'eventTask';
    var patches = {};
    var _api = {
        symbol: __symbol__,
        currentZoneFrame: function () { return _currentZoneFrame; },
        onUnhandledError: noop,
        microtaskDrainDone: noop,
        scheduleMicroTask: scheduleMicroTask,
        showUncaughtError: function () { return !Zone[__symbol__('ignoreConsoleErrorUncaughtError')]; },
        patchEventTarget: function () { return []; },
        patchOnProperties: noop,
        patchMethod: function () { return noop; },
        bindArguments: function () { return []; },
        patchThen: function () { return noop; },
        setNativePromise: function (NativePromise) {
            // sometimes NativePromise.resolve static function
            // is not ready yet, (such as core-js/es6.promise)
            // so we need to check here.
            if (NativePromise && typeof NativePromise.resolve === 'function') {
                nativeMicroTaskQueuePromise = NativePromise.resolve(0);
            }
        },
    };
    var _currentZoneFrame = { parent: null, zone: new Zone(null, null) };
    var _currentTask = null;
    var _numberOfNestedTaskFrames = 0;
    function noop() { }
    function __symbol__(name) {
        return '__zone_symbol__' + name;
    }
    performanceMeasure('Zone', 'Zone');
    return global['Zone'] = Zone;
})(typeof window !== 'undefined' && window || typeof self !== 'undefined' && self || global);

var __values = (undefined && undefined.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Zone.__load_patch('ZoneAwarePromise', function (global, Zone, api) {
    var ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var ObjectDefineProperty = Object.defineProperty;
    function readableObjectToString(obj) {
        if (obj && obj.toString === Object.prototype.toString) {
            var className = obj.constructor && obj.constructor.name;
            return (className ? className : '') + ': ' + JSON.stringify(obj);
        }
        return obj ? obj.toString() : Object.prototype.toString.call(obj);
    }
    var __symbol__ = api.symbol;
    var _uncaughtPromiseErrors = [];
    var symbolPromise = __symbol__('Promise');
    var symbolThen = __symbol__('then');
    var creationTrace = '__creationTrace__';
    api.onUnhandledError = function (e) {
        if (api.showUncaughtError()) {
            var rejection = e && e.rejection;
            if (rejection) {
                console.error('Unhandled Promise rejection:', rejection instanceof Error ? rejection.message : rejection, '; Zone:', e.zone.name, '; Task:', e.task && e.task.source, '; Value:', rejection, rejection instanceof Error ? rejection.stack : undefined);
            }
            else {
                console.error(e);
            }
        }
    };
    api.microtaskDrainDone = function () {
        while (_uncaughtPromiseErrors.length) {
            var _loop_1 = function () {
                var uncaughtPromiseError = _uncaughtPromiseErrors.shift();
                try {
                    uncaughtPromiseError.zone.runGuarded(function () {
                        throw uncaughtPromiseError;
                    });
                }
                catch (error) {
                    handleUnhandledRejection(error);
                }
            };
            while (_uncaughtPromiseErrors.length) {
                _loop_1();
            }
        }
    };
    var UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL = __symbol__('unhandledPromiseRejectionHandler');
    function handleUnhandledRejection(e) {
        api.onUnhandledError(e);
        try {
            var handler = Zone[UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL];
            if (handler && typeof handler === 'function') {
                handler.call(this, e);
            }
        }
        catch (err) {
        }
    }
    function isThenable(value) {
        return value && value.then;
    }
    function forwardResolution(value) {
        return value;
    }
    function forwardRejection(rejection) {
        return ZoneAwarePromise.reject(rejection);
    }
    var symbolState = __symbol__('state');
    var symbolValue = __symbol__('value');
    var symbolFinally = __symbol__('finally');
    var symbolParentPromiseValue = __symbol__('parentPromiseValue');
    var symbolParentPromiseState = __symbol__('parentPromiseState');
    var source = 'Promise.then';
    var UNRESOLVED = null;
    var RESOLVED = true;
    var REJECTED = false;
    var REJECTED_NO_CATCH = 0;
    function makeResolver(promise, state) {
        return function (v) {
            try {
                resolvePromise(promise, state, v);
            }
            catch (err) {
                resolvePromise(promise, false, err);
            }
            // Do not return value or you will break the Promise spec.
        };
    }
    var once = function () {
        var wasCalled = false;
        return function wrapper(wrappedFunction) {
            return function () {
                if (wasCalled) {
                    return;
                }
                wasCalled = true;
                wrappedFunction.apply(null, arguments);
            };
        };
    };
    var TYPE_ERROR = 'Promise resolved with itself';
    var CURRENT_TASK_TRACE_SYMBOL = __symbol__('currentTaskTrace');
    // Promise Resolution
    function resolvePromise(promise, state, value) {
        var onceWrapper = once();
        if (promise === value) {
            throw new TypeError(TYPE_ERROR);
        }
        if (promise[symbolState] === UNRESOLVED) {
            // should only get value.then once based on promise spec.
            var then = null;
            try {
                if (typeof value === 'object' || typeof value === 'function') {
                    then = value && value.then;
                }
            }
            catch (err) {
                onceWrapper(function () {
                    resolvePromise(promise, false, err);
                })();
                return promise;
            }
            // if (value instanceof ZoneAwarePromise) {
            if (state !== REJECTED && value instanceof ZoneAwarePromise &&
                value.hasOwnProperty(symbolState) && value.hasOwnProperty(symbolValue) &&
                value[symbolState] !== UNRESOLVED) {
                clearRejectedNoCatch(value);
                resolvePromise(promise, value[symbolState], value[symbolValue]);
            }
            else if (state !== REJECTED && typeof then === 'function') {
                try {
                    then.call(value, onceWrapper(makeResolver(promise, state)), onceWrapper(makeResolver(promise, false)));
                }
                catch (err) {
                    onceWrapper(function () {
                        resolvePromise(promise, false, err);
                    })();
                }
            }
            else {
                promise[symbolState] = state;
                var queue = promise[symbolValue];
                promise[symbolValue] = value;
                if (promise[symbolFinally] === symbolFinally) {
                    // the promise is generated by Promise.prototype.finally
                    if (state === RESOLVED) {
                        // the state is resolved, should ignore the value
                        // and use parent promise value
                        promise[symbolState] = promise[symbolParentPromiseState];
                        promise[symbolValue] = promise[symbolParentPromiseValue];
                    }
                }
                // record task information in value when error occurs, so we can
                // do some additional work such as render longStackTrace
                if (state === REJECTED && value instanceof Error) {
                    // check if longStackTraceZone is here
                    var trace = Zone.currentTask && Zone.currentTask.data &&
                        Zone.currentTask.data[creationTrace];
                    if (trace) {
                        // only keep the long stack trace into error when in longStackTraceZone
                        ObjectDefineProperty(value, CURRENT_TASK_TRACE_SYMBOL, { configurable: true, enumerable: false, writable: true, value: trace });
                    }
                }
                for (var i = 0; i < queue.length;) {
                    scheduleResolveOrReject(promise, queue[i++], queue[i++], queue[i++], queue[i++]);
                }
                if (queue.length == 0 && state == REJECTED) {
                    promise[symbolState] = REJECTED_NO_CATCH;
                    try {
                        // try to print more readable error log
                        throw new Error('Uncaught (in promise): ' + readableObjectToString(value) +
                            (value && value.stack ? '\n' + value.stack : ''));
                    }
                    catch (err) {
                        var error_1 = err;
                        error_1.rejection = value;
                        error_1.promise = promise;
                        error_1.zone = Zone.current;
                        error_1.task = Zone.currentTask;
                        _uncaughtPromiseErrors.push(error_1);
                        api.scheduleMicroTask(); // to make sure that it is running
                    }
                }
            }
        }
        // Resolving an already resolved promise is a noop.
        return promise;
    }
    var REJECTION_HANDLED_HANDLER = __symbol__('rejectionHandledHandler');
    function clearRejectedNoCatch(promise) {
        if (promise[symbolState] === REJECTED_NO_CATCH) {
            // if the promise is rejected no catch status
            // and queue.length > 0, means there is a error handler
            // here to handle the rejected promise, we should trigger
            // windows.rejectionhandled eventHandler or nodejs rejectionHandled
            // eventHandler
            try {
                var handler = Zone[REJECTION_HANDLED_HANDLER];
                if (handler && typeof handler === 'function') {
                    handler.call(this, { rejection: promise[symbolValue], promise: promise });
                }
            }
            catch (err) {
            }
            promise[symbolState] = REJECTED;
            for (var i = 0; i < _uncaughtPromiseErrors.length; i++) {
                if (promise === _uncaughtPromiseErrors[i].promise) {
                    _uncaughtPromiseErrors.splice(i, 1);
                }
            }
        }
    }
    function scheduleResolveOrReject(promise, zone, chainPromise, onFulfilled, onRejected) {
        clearRejectedNoCatch(promise);
        var promiseState = promise[symbolState];
        var delegate = promiseState ?
            (typeof onFulfilled === 'function') ? onFulfilled : forwardResolution :
            (typeof onRejected === 'function') ? onRejected : forwardRejection;
        zone.scheduleMicroTask(source, function () {
            try {
                var parentPromiseValue = promise[symbolValue];
                var isFinallyPromise = chainPromise && symbolFinally === chainPromise[symbolFinally];
                if (isFinallyPromise) {
                    // if the promise is generated from finally call, keep parent promise's state and value
                    chainPromise[symbolParentPromiseValue] = parentPromiseValue;
                    chainPromise[symbolParentPromiseState] = promiseState;
                }
                // should not pass value to finally callback
                var value = zone.run(delegate, undefined, isFinallyPromise && delegate !== forwardRejection && delegate !== forwardResolution ?
                    [] :
                    [parentPromiseValue]);
                resolvePromise(chainPromise, true, value);
            }
            catch (error) {
                // if error occurs, should always return this error
                resolvePromise(chainPromise, false, error);
            }
        }, chainPromise);
    }
    var ZONE_AWARE_PROMISE_TO_STRING = 'function ZoneAwarePromise() { [native code] }';
    var ZoneAwarePromise = /** @class */ (function () {
        function ZoneAwarePromise(executor) {
            var promise = this;
            if (!(promise instanceof ZoneAwarePromise)) {
                throw new Error('Must be an instanceof Promise.');
            }
            promise[symbolState] = UNRESOLVED;
            promise[symbolValue] = []; // queue;
            try {
                executor && executor(makeResolver(promise, RESOLVED), makeResolver(promise, REJECTED));
            }
            catch (error) {
                resolvePromise(promise, false, error);
            }
        }
        ZoneAwarePromise.toString = function () {
            return ZONE_AWARE_PROMISE_TO_STRING;
        };
        ZoneAwarePromise.resolve = function (value) {
            return resolvePromise(new this(null), RESOLVED, value);
        };
        ZoneAwarePromise.reject = function (error) {
            return resolvePromise(new this(null), REJECTED, error);
        };
        ZoneAwarePromise.race = function (values) {
            var e_1, _a;
            var resolve;
            var reject;
            var promise = new this(function (res, rej) {
                resolve = res;
                reject = rej;
            });
            function onResolve(value) {
                promise && (promise =  false || resolve(value));
            }
            function onReject(error) {
                promise && (promise =  false || reject(error));
            }
            try {
                for (var values_1 = __values(values), values_1_1 = values_1.next(); !values_1_1.done; values_1_1 = values_1.next()) {
                    var value = values_1_1.value;
                    if (!isThenable(value)) {
                        value = this.resolve(value);
                    }
                    value.then(onResolve, onReject);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (values_1_1 && !values_1_1.done && (_a = values_1.return)) _a.call(values_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return promise;
        };
        ZoneAwarePromise.all = function (values) {
            var e_2, _a;
            var resolve;
            var reject;
            var promise = new this(function (res, rej) {
                resolve = res;
                reject = rej;
            });
            // Start at 2 to prevent prematurely resolving if .then is called immediately.
            var unresolvedCount = 2;
            var valueIndex = 0;
            var resolvedValues = [];
            var _loop_2 = function (value) {
                if (!isThenable(value)) {
                    value = this_1.resolve(value);
                }
                var curValueIndex = valueIndex;
                value.then(function (value) {
                    resolvedValues[curValueIndex] = value;
                    unresolvedCount--;
                    if (unresolvedCount === 0) {
                        resolve(resolvedValues);
                    }
                }, reject);
                unresolvedCount++;
                valueIndex++;
            };
            var this_1 = this;
            try {
                for (var values_2 = __values(values), values_2_1 = values_2.next(); !values_2_1.done; values_2_1 = values_2.next()) {
                    var value = values_2_1.value;
                    _loop_2(value);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (values_2_1 && !values_2_1.done && (_a = values_2.return)) _a.call(values_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            // Make the unresolvedCount zero-based again.
            unresolvedCount -= 2;
            if (unresolvedCount === 0) {
                resolve(resolvedValues);
            }
            return promise;
        };
        ZoneAwarePromise.prototype.then = function (onFulfilled, onRejected) {
            var chainPromise = new this.constructor(null);
            var zone = Zone.current;
            if (this[symbolState] == UNRESOLVED) {
                this[symbolValue].push(zone, chainPromise, onFulfilled, onRejected);
            }
            else {
                scheduleResolveOrReject(this, zone, chainPromise, onFulfilled, onRejected);
            }
            return chainPromise;
        };
        ZoneAwarePromise.prototype.catch = function (onRejected) {
            return this.then(null, onRejected);
        };
        ZoneAwarePromise.prototype.finally = function (onFinally) {
            var chainPromise = new this.constructor(null);
            chainPromise[symbolFinally] = symbolFinally;
            var zone = Zone.current;
            if (this[symbolState] == UNRESOLVED) {
                this[symbolValue].push(zone, chainPromise, onFinally, onFinally);
            }
            else {
                scheduleResolveOrReject(this, zone, chainPromise, onFinally, onFinally);
            }
            return chainPromise;
        };
        return ZoneAwarePromise;
    }());
    // Protect against aggressive optimizers dropping seemingly unused properties.
    // E.g. Closure Compiler in advanced mode.
    ZoneAwarePromise['resolve'] = ZoneAwarePromise.resolve;
    ZoneAwarePromise['reject'] = ZoneAwarePromise.reject;
    ZoneAwarePromise['race'] = ZoneAwarePromise.race;
    ZoneAwarePromise['all'] = ZoneAwarePromise.all;
    var NativePromise = global[symbolPromise] = global['Promise'];
    var ZONE_AWARE_PROMISE = Zone.__symbol__('ZoneAwarePromise');
    var desc = ObjectGetOwnPropertyDescriptor(global, 'Promise');
    if (!desc || desc.configurable) {
        desc && delete desc.writable;
        desc && delete desc.value;
        if (!desc) {
            desc = { configurable: true, enumerable: true };
        }
        desc.get = function () {
            // if we already set ZoneAwarePromise, use patched one
            // otherwise return native one.
            return global[ZONE_AWARE_PROMISE] ? global[ZONE_AWARE_PROMISE] : global[symbolPromise];
        };
        desc.set = function (NewNativePromise) {
            if (NewNativePromise === ZoneAwarePromise) {
                // if the NewNativePromise is ZoneAwarePromise
                // save to global
                global[ZONE_AWARE_PROMISE] = NewNativePromise;
            }
            else {
                // if the NewNativePromise is not ZoneAwarePromise
                // for example: after load zone.js, some library just
                // set es6-promise to global, if we set it to global
                // directly, assertZonePatched will fail and angular
                // will not loaded, so we just set the NewNativePromise
                // to global[symbolPromise], so the result is just like
                // we load ES6 Promise before zone.js
                global[symbolPromise] = NewNativePromise;
                if (!NewNativePromise.prototype[symbolThen]) {
                    patchThen(NewNativePromise);
                }
                api.setNativePromise(NewNativePromise);
            }
        };
        ObjectDefineProperty(global, 'Promise', desc);
    }
    global['Promise'] = ZoneAwarePromise;
    var symbolThenPatched = __symbol__('thenPatched');
    function patchThen(Ctor) {
        var proto = Ctor.prototype;
        var prop = ObjectGetOwnPropertyDescriptor(proto, 'then');
        if (prop && (prop.writable === false || !prop.configurable)) {
            // check Ctor.prototype.then propertyDescriptor is writable or not
            // in meteor env, writable is false, we should ignore such case
            return;
        }
        var originalThen = proto.then;
        // Keep a reference to the original method.
        proto[symbolThen] = originalThen;
        Ctor.prototype.then = function (onResolve, onReject) {
            var _this = this;
            var wrapped = new ZoneAwarePromise(function (resolve, reject) {
                originalThen.call(_this, resolve, reject);
            });
            return wrapped.then(onResolve, onReject);
        };
        Ctor[symbolThenPatched] = true;
    }
    api.patchThen = patchThen;
    if (NativePromise) {
        patchThen(NativePromise);
    }
    // This is not part of public API, but it is useful for tests, so we expose it.
    Promise[Zone.__symbol__('uncaughtPromiseErrors')] = _uncaughtPromiseErrors;
    return ZoneAwarePromise;
});

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Zone.__load_patch('fetch', function (global, Zone, api) {
    var fetch = global['fetch'];
    var ZoneAwarePromise = global.Promise;
    var symbolThenPatched = api.symbol('thenPatched');
    var fetchTaskScheduling = api.symbol('fetchTaskScheduling');
    var fetchTaskAborting = api.symbol('fetchTaskAborting');
    if (typeof fetch !== 'function') {
        return;
    }
    var OriginalAbortController = global['AbortController'];
    var supportAbort = typeof OriginalAbortController === 'function';
    var abortNative = null;
    if (supportAbort) {
        global['AbortController'] = function () {
            var abortController = new OriginalAbortController();
            var signal = abortController.signal;
            signal.abortController = abortController;
            return abortController;
        };
        abortNative = api.patchMethod(OriginalAbortController.prototype, 'abort', function (delegate) { return function (self, args) {
            if (self.task) {
                return self.task.zone.cancelTask(self.task);
            }
            return delegate.apply(self, args);
        }; });
    }
    var placeholder = function () { };
    global['fetch'] = function () {
        var _this = this;
        var args = Array.prototype.slice.call(arguments);
        var options = args.length > 1 ? args[1] : null;
        var signal = options && options.signal;
        return new Promise(function (res, rej) {
            var task = Zone.current.scheduleMacroTask('fetch', placeholder, args, function () {
                var fetchPromise;
                var zone = Zone.current;
                try {
                    zone[fetchTaskScheduling] = true;
                    fetchPromise = fetch.apply(_this, args);
                }
                catch (error) {
                    rej(error);
                    return;
                }
                finally {
                    zone[fetchTaskScheduling] = false;
                }
                if (!(fetchPromise instanceof ZoneAwarePromise)) {
                    var ctor = fetchPromise.constructor;
                    if (!ctor[symbolThenPatched]) {
                        api.patchThen(ctor);
                    }
                }
                fetchPromise.then(function (resource) {
                    if (task.state !== 'notScheduled') {
                        task.invoke();
                    }
                    res(resource);
                }, function (error) {
                    if (task.state !== 'notScheduled') {
                        task.invoke();
                    }
                    rej(error);
                });
            }, function () {
                if (!supportAbort) {
                    rej('No AbortController supported, can not cancel fetch');
                    return;
                }
                if (signal && signal.abortController && !signal.aborted &&
                    typeof signal.abortController.abort === 'function' && abortNative) {
                    try {
                        Zone.current[fetchTaskAborting] = true;
                        abortNative.call(signal.abortController);
                    }
                    finally {
                        Zone.current[fetchTaskAborting] = false;
                    }
                }
                else {
                    rej('cancel fetch need a AbortController.signal');
                }
            });
            if (signal && signal.abortController) {
                signal.abortController.task = task;
            }
        });
    };
});

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Suppress closure compiler errors about unknown 'Zone' variable
 * @fileoverview
 * @suppress {undefinedVars,globalThis,missingRequire}
 */
// issue #989, to reduce bundle size, use short name
/** Object.getOwnPropertyDescriptor */
var ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
/** Object.defineProperty */
var ObjectDefineProperty = Object.defineProperty;
/** Object.getPrototypeOf */
var ObjectGetPrototypeOf = Object.getPrototypeOf;
/** Object.create */
var ObjectCreate = Object.create;
/** Array.prototype.slice */
var ArraySlice = Array.prototype.slice;
/** addEventListener string const */
var ADD_EVENT_LISTENER_STR = 'addEventListener';
/** removeEventListener string const */
var REMOVE_EVENT_LISTENER_STR = 'removeEventListener';
/** zoneSymbol addEventListener */
var ZONE_SYMBOL_ADD_EVENT_LISTENER = Zone.__symbol__(ADD_EVENT_LISTENER_STR);
/** zoneSymbol removeEventListener */
var ZONE_SYMBOL_REMOVE_EVENT_LISTENER = Zone.__symbol__(REMOVE_EVENT_LISTENER_STR);
/** true string const */
var TRUE_STR = 'true';
/** false string const */
var FALSE_STR = 'false';
/** __zone_symbol__ string const */
var ZONE_SYMBOL_PREFIX = '__zone_symbol__';
function wrapWithCurrentZone(callback, source) {
    return Zone.current.wrap(callback, source);
}
function scheduleMacroTaskWithCurrentZone(source, callback, data, customSchedule, customCancel) {
    return Zone.current.scheduleMacroTask(source, callback, data, customSchedule, customCancel);
}
var zoneSymbol = Zone.__symbol__;
var isWindowExists = typeof window !== 'undefined';
var internalWindow = isWindowExists ? window : undefined;
var _global = isWindowExists && internalWindow || typeof self === 'object' && self || global;
var REMOVE_ATTRIBUTE = 'removeAttribute';
var NULL_ON_PROP_VALUE = [null];
function bindArguments(args, source) {
    for (var i = args.length - 1; i >= 0; i--) {
        if (typeof args[i] === 'function') {
            args[i] = wrapWithCurrentZone(args[i], source + '_' + i);
        }
    }
    return args;
}
function patchPrototype(prototype, fnNames) {
    var source = prototype.constructor['name'];
    var _loop_1 = function (i) {
        var name_1 = fnNames[i];
        var delegate = prototype[name_1];
        if (delegate) {
            var prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, name_1);
            if (!isPropertyWritable(prototypeDesc)) {
                return "continue";
            }
            prototype[name_1] = (function (delegate) {
                var patched = function () {
                    return delegate.apply(this, bindArguments(arguments, source + '.' + name_1));
                };
                attachOriginToPatched(patched, delegate);
                return patched;
            })(delegate);
        }
    };
    for (var i = 0; i < fnNames.length; i++) {
        _loop_1(i);
    }
}
function isPropertyWritable(propertyDesc) {
    if (!propertyDesc) {
        return true;
    }
    if (propertyDesc.writable === false) {
        return false;
    }
    return !(typeof propertyDesc.get === 'function' && typeof propertyDesc.set === 'undefined');
}
var isWebWorker = (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope);
// Make sure to access `process` through `_global` so that WebPack does not accidentally browserify
// this code.
var isNode = (!('nw' in _global) && typeof _global.process !== 'undefined' &&
    {}.toString.call(_global.process) === '[object process]');
var isBrowser = !isNode && !isWebWorker && !!(isWindowExists && internalWindow['HTMLElement']);
// we are in electron of nw, so we are both browser and nodejs
// Make sure to access `process` through `_global` so that WebPack does not accidentally browserify
// this code.
var isMix = typeof _global.process !== 'undefined' &&
    {}.toString.call(_global.process) === '[object process]' && !isWebWorker &&
    !!(isWindowExists && internalWindow['HTMLElement']);
var zoneSymbolEventNames = {};
var wrapFn = function (event) {
    // https://github.com/angular/zone.js/issues/911, in IE, sometimes
    // event will be undefined, so we need to use window.event
    event = event || _global.event;
    if (!event) {
        return;
    }
    var eventNameSymbol = zoneSymbolEventNames[event.type];
    if (!eventNameSymbol) {
        eventNameSymbol = zoneSymbolEventNames[event.type] = zoneSymbol('ON_PROPERTY' + event.type);
    }
    var target = this || event.target || _global;
    var listener = target[eventNameSymbol];
    var result;
    if (isBrowser && target === internalWindow && event.type === 'error') {
        // window.onerror have different signiture
        // https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror#window.onerror
        // and onerror callback will prevent default when callback return true
        var errorEvent = event;
        result = listener &&
            listener.call(this, errorEvent.message, errorEvent.filename, errorEvent.lineno, errorEvent.colno, errorEvent.error);
        if (result === true) {
            event.preventDefault();
        }
    }
    else {
        result = listener && listener.apply(this, arguments);
        if (result != undefined && !result) {
            event.preventDefault();
        }
    }
    return result;
};
function patchProperty(obj, prop, prototype) {
    var desc = ObjectGetOwnPropertyDescriptor(obj, prop);
    if (!desc && prototype) {
        // when patch window object, use prototype to check prop exist or not
        var prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, prop);
        if (prototypeDesc) {
            desc = { enumerable: true, configurable: true };
        }
    }
    // if the descriptor not exists or is not configurable
    // just return
    if (!desc || !desc.configurable) {
        return;
    }
    var onPropPatchedSymbol = zoneSymbol('on' + prop + 'patched');
    if (obj.hasOwnProperty(onPropPatchedSymbol) && obj[onPropPatchedSymbol]) {
        return;
    }
    // A property descriptor cannot have getter/setter and be writable
    // deleting the writable and value properties avoids this error:
    //
    // TypeError: property descriptors must not specify a value or be writable when a
    // getter or setter has been specified
    delete desc.writable;
    delete desc.value;
    var originalDescGet = desc.get;
    var originalDescSet = desc.set;
    // substr(2) cuz 'onclick' -> 'click', etc
    var eventName = prop.substr(2);
    var eventNameSymbol = zoneSymbolEventNames[eventName];
    if (!eventNameSymbol) {
        eventNameSymbol = zoneSymbolEventNames[eventName] = zoneSymbol('ON_PROPERTY' + eventName);
    }
    desc.set = function (newValue) {
        // in some of windows's onproperty callback, this is undefined
        // so we need to check it
        var target = this;
        if (!target && obj === _global) {
            target = _global;
        }
        if (!target) {
            return;
        }
        var previousValue = target[eventNameSymbol];
        if (previousValue) {
            target.removeEventListener(eventName, wrapFn);
        }
        // issue #978, when onload handler was added before loading zone.js
        // we should remove it with originalDescSet
        if (originalDescSet) {
            originalDescSet.apply(target, NULL_ON_PROP_VALUE);
        }
        if (typeof newValue === 'function') {
            target[eventNameSymbol] = newValue;
            target.addEventListener(eventName, wrapFn, false);
        }
        else {
            target[eventNameSymbol] = null;
        }
    };
    // The getter would return undefined for unassigned properties but the default value of an
    // unassigned property is null
    desc.get = function () {
        // in some of windows's onproperty callback, this is undefined
        // so we need to check it
        var target = this;
        if (!target && obj === _global) {
            target = _global;
        }
        if (!target) {
            return null;
        }
        var listener = target[eventNameSymbol];
        if (listener) {
            return listener;
        }
        else if (originalDescGet) {
            // result will be null when use inline event attribute,
            // such as <button onclick="func();">OK</button>
            // because the onclick function is internal raw uncompiled handler
            // the onclick will be evaluated when first time event was triggered or
            // the property is accessed, https://github.com/angular/zone.js/issues/525
            // so we should use original native get to retrieve the handler
            var value = originalDescGet && originalDescGet.call(this);
            if (value) {
                desc.set.call(this, value);
                if (typeof target[REMOVE_ATTRIBUTE] === 'function') {
                    target.removeAttribute(prop);
                }
                return value;
            }
        }
        return null;
    };
    ObjectDefineProperty(obj, prop, desc);
    obj[onPropPatchedSymbol] = true;
}
function patchOnProperties(obj, properties, prototype) {
    if (properties) {
        for (var i = 0; i < properties.length; i++) {
            patchProperty(obj, 'on' + properties[i], prototype);
        }
    }
    else {
        var onProperties = [];
        for (var prop in obj) {
            if (prop.substr(0, 2) == 'on') {
                onProperties.push(prop);
            }
        }
        for (var j = 0; j < onProperties.length; j++) {
            patchProperty(obj, onProperties[j], prototype);
        }
    }
}
var originalInstanceKey = zoneSymbol('originalInstance');
// wrap some native API on `window`
function patchClass(className) {
    var OriginalClass = _global[className];
    if (!OriginalClass)
        return;
    // keep original class in global
    _global[zoneSymbol(className)] = OriginalClass;
    _global[className] = function () {
        var a = bindArguments(arguments, className);
        switch (a.length) {
            case 0:
                this[originalInstanceKey] = new OriginalClass();
                break;
            case 1:
                this[originalInstanceKey] = new OriginalClass(a[0]);
                break;
            case 2:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1]);
                break;
            case 3:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2]);
                break;
            case 4:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2], a[3]);
                break;
            default:
                throw new Error('Arg list too long.');
        }
    };
    // attach original delegate to patched function
    attachOriginToPatched(_global[className], OriginalClass);
    var instance = new OriginalClass(function () { });
    var prop;
    for (prop in instance) {
        // https://bugs.webkit.org/show_bug.cgi?id=44721
        if (className === 'XMLHttpRequest' && prop === 'responseBlob')
            continue;
        (function (prop) {
            if (typeof instance[prop] === 'function') {
                _global[className].prototype[prop] = function () {
                    return this[originalInstanceKey][prop].apply(this[originalInstanceKey], arguments);
                };
            }
            else {
                ObjectDefineProperty(_global[className].prototype, prop, {
                    set: function (fn) {
                        if (typeof fn === 'function') {
                            this[originalInstanceKey][prop] = wrapWithCurrentZone(fn, className + '.' + prop);
                            // keep callback in wrapped function so we can
                            // use it in Function.prototype.toString to return
                            // the native one.
                            attachOriginToPatched(this[originalInstanceKey][prop], fn);
                        }
                        else {
                            this[originalInstanceKey][prop] = fn;
                        }
                    },
                    get: function () {
                        return this[originalInstanceKey][prop];
                    }
                });
            }
        }(prop));
    }
    for (prop in OriginalClass) {
        if (prop !== 'prototype' && OriginalClass.hasOwnProperty(prop)) {
            _global[className][prop] = OriginalClass[prop];
        }
    }
}
function copySymbolProperties(src, dest) {
    if (typeof Object.getOwnPropertySymbols !== 'function') {
        return;
    }
    var symbols = Object.getOwnPropertySymbols(src);
    symbols.forEach(function (symbol) {
        var desc = Object.getOwnPropertyDescriptor(src, symbol);
        Object.defineProperty(dest, symbol, {
            get: function () {
                return src[symbol];
            },
            set: function (value) {
                if (desc && (!desc.writable || typeof desc.set !== 'function')) {
                    // if src[symbol] is not writable or not have a setter, just return
                    return;
                }
                src[symbol] = value;
            },
            enumerable: desc ? desc.enumerable : true,
            configurable: desc ? desc.configurable : true
        });
    });
}
var shouldCopySymbolProperties = false;

function patchMethod(target, name, patchFn) {
    var proto = target;
    while (proto && !proto.hasOwnProperty(name)) {
        proto = ObjectGetPrototypeOf(proto);
    }
    if (!proto && target[name]) {
        // somehow we did not find it, but we can see it. This happens on IE for Window properties.
        proto = target;
    }
    var delegateName = zoneSymbol(name);
    var delegate = null;
    if (proto && !(delegate = proto[delegateName])) {
        delegate = proto[delegateName] = proto[name];
        // check whether proto[name] is writable
        // some property is readonly in safari, such as HtmlCanvasElement.prototype.toBlob
        var desc = proto && ObjectGetOwnPropertyDescriptor(proto, name);
        if (isPropertyWritable(desc)) {
            var patchDelegate_1 = patchFn(delegate, delegateName, name);
            proto[name] = function () {
                return patchDelegate_1(this, arguments);
            };
            attachOriginToPatched(proto[name], delegate);
            if (shouldCopySymbolProperties) {
                copySymbolProperties(delegate, proto[name]);
            }
        }
    }
    return delegate;
}
// TODO: @JiaLiPassion, support cancel task later if necessary
function patchMacroTask(obj, funcName, metaCreator) {
    var setNative = null;
    function scheduleTask(task) {
        var data = task.data;
        data.args[data.cbIdx] = function () {
            task.invoke.apply(this, arguments);
        };
        setNative.apply(data.target, data.args);
        return task;
    }
    setNative = patchMethod(obj, funcName, function (delegate) { return function (self, args) {
        var meta = metaCreator(self, args);
        if (meta.cbIdx >= 0 && typeof args[meta.cbIdx] === 'function') {
            return scheduleMacroTaskWithCurrentZone(meta.name, args[meta.cbIdx], meta, scheduleTask);
        }
        else {
            // cause an error by calling it directly.
            return delegate.apply(self, args);
        }
    }; });
}

function attachOriginToPatched(patched, original) {
    patched[zoneSymbol('OriginalDelegate')] = original;
}
var isDetectedIEOrEdge = false;
var ieOrEdge = false;
function isIE() {
    try {
        var ua = internalWindow.navigator.userAgent;
        if (ua.indexOf('MSIE ') !== -1 || ua.indexOf('Trident/') !== -1) {
            return true;
        }
    }
    catch (error) {
    }
    return false;
}
function isIEOrEdge() {
    if (isDetectedIEOrEdge) {
        return ieOrEdge;
    }
    isDetectedIEOrEdge = true;
    try {
        var ua = internalWindow.navigator.userAgent;
        if (ua.indexOf('MSIE ') !== -1 || ua.indexOf('Trident/') !== -1 || ua.indexOf('Edge/') !== -1) {
            ieOrEdge = true;
        }
        return ieOrEdge;
    }
    catch (error) {
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// override Function.prototype.toString to make zone.js patched function
// look like native function
Zone.__load_patch('toString', function (global) {
    // patch Func.prototype.toString to let them look like native
    var originalFunctionToString = Function.prototype.toString;
    var ORIGINAL_DELEGATE_SYMBOL = zoneSymbol('OriginalDelegate');
    var PROMISE_SYMBOL = zoneSymbol('Promise');
    var ERROR_SYMBOL = zoneSymbol('Error');
    var newFunctionToString = function toString() {
        if (typeof this === 'function') {
            var originalDelegate = this[ORIGINAL_DELEGATE_SYMBOL];
            if (originalDelegate) {
                if (typeof originalDelegate === 'function') {
                    return originalFunctionToString.apply(this[ORIGINAL_DELEGATE_SYMBOL], arguments);
                }
                else {
                    return Object.prototype.toString.call(originalDelegate);
                }
            }
            if (this === Promise) {
                var nativePromise = global[PROMISE_SYMBOL];
                if (nativePromise) {
                    return originalFunctionToString.apply(nativePromise, arguments);
                }
            }
            if (this === Error) {
                var nativeError = global[ERROR_SYMBOL];
                if (nativeError) {
                    return originalFunctionToString.apply(nativeError, arguments);
                }
            }
        }
        return originalFunctionToString.apply(this, arguments);
    };
    newFunctionToString[ORIGINAL_DELEGATE_SYMBOL] = originalFunctionToString;
    Function.prototype.toString = newFunctionToString;
    // patch Object.prototype.toString to let them look like native
    var originalObjectToString = Object.prototype.toString;
    var PROMISE_OBJECT_TO_STRING = '[object Promise]';
    Object.prototype.toString = function () {
        if (this instanceof Promise) {
            return PROMISE_OBJECT_TO_STRING;
        }
        return originalObjectToString.apply(this, arguments);
    };
});

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {missingRequire}
 */
var passiveSupported = false;
if (typeof window !== 'undefined') {
    try {
        var options = Object.defineProperty({}, 'passive', {
            get: function () {
                passiveSupported = true;
            }
        });
        window.addEventListener('test', options, options);
        window.removeEventListener('test', options, options);
    }
    catch (err) {
        passiveSupported = false;
    }
}
// an identifier to tell ZoneTask do not create a new invoke closure
var OPTIMIZED_ZONE_EVENT_TASK_DATA = {
    useG: true
};
var zoneSymbolEventNames$1 = {};
var globalSources = {};
var EVENT_NAME_SYMBOL_REGX = /^__zone_symbol__(\w+)(true|false)$/;
var IMMEDIATE_PROPAGATION_SYMBOL = ('__zone_symbol__propagationStopped');
function patchEventTarget(_global, apis, patchOptions) {
    var ADD_EVENT_LISTENER = (patchOptions && patchOptions.add) || ADD_EVENT_LISTENER_STR;
    var REMOVE_EVENT_LISTENER = (patchOptions && patchOptions.rm) || REMOVE_EVENT_LISTENER_STR;
    var LISTENERS_EVENT_LISTENER = (patchOptions && patchOptions.listeners) || 'eventListeners';
    var REMOVE_ALL_LISTENERS_EVENT_LISTENER = (patchOptions && patchOptions.rmAll) || 'removeAllListeners';
    var zoneSymbolAddEventListener = zoneSymbol(ADD_EVENT_LISTENER);
    var ADD_EVENT_LISTENER_SOURCE = '.' + ADD_EVENT_LISTENER + ':';
    var PREPEND_EVENT_LISTENER = 'prependListener';
    var PREPEND_EVENT_LISTENER_SOURCE = '.' + PREPEND_EVENT_LISTENER + ':';
    var invokeTask = function (task, target, event) {
        // for better performance, check isRemoved which is set
        // by removeEventListener
        if (task.isRemoved) {
            return;
        }
        var delegate = task.callback;
        if (typeof delegate === 'object' && delegate.handleEvent) {
            // create the bind version of handleEvent when invoke
            task.callback = function (event) { return delegate.handleEvent(event); };
            task.originalDelegate = delegate;
        }
        // invoke static task.invoke
        task.invoke(task, target, [event]);
        var options = task.options;
        if (options && typeof options === 'object' && options.once) {
            // if options.once is true, after invoke once remove listener here
            // only browser need to do this, nodejs eventEmitter will cal removeListener
            // inside EventEmitter.once
            var delegate_1 = task.originalDelegate ? task.originalDelegate : task.callback;
            target[REMOVE_EVENT_LISTENER].call(target, event.type, delegate_1, options);
        }
    };
    // global shared zoneAwareCallback to handle all event callback with capture = false
    var globalZoneAwareCallback = function (event) {
        // https://github.com/angular/zone.js/issues/911, in IE, sometimes
        // event will be undefined, so we need to use window.event
        event = event || _global.event;
        if (!event) {
            return;
        }
        // event.target is needed for Samsung TV and SourceBuffer
        // || global is needed https://github.com/angular/zone.js/issues/190
        var target = this || event.target || _global;
        var tasks = target[zoneSymbolEventNames$1[event.type][FALSE_STR]];
        if (tasks) {
            // invoke all tasks which attached to current target with given event.type and capture = false
            // for performance concern, if task.length === 1, just invoke
            if (tasks.length === 1) {
                invokeTask(tasks[0], target, event);
            }
            else {
                // https://github.com/angular/zone.js/issues/836
                // copy the tasks array before invoke, to avoid
                // the callback will remove itself or other listener
                var copyTasks = tasks.slice();
                for (var i = 0; i < copyTasks.length; i++) {
                    if (event && event[IMMEDIATE_PROPAGATION_SYMBOL] === true) {
                        break;
                    }
                    invokeTask(copyTasks[i], target, event);
                }
            }
        }
    };
    // global shared zoneAwareCallback to handle all event callback with capture = true
    var globalZoneAwareCaptureCallback = function (event) {
        // https://github.com/angular/zone.js/issues/911, in IE, sometimes
        // event will be undefined, so we need to use window.event
        event = event || _global.event;
        if (!event) {
            return;
        }
        // event.target is needed for Samsung TV and SourceBuffer
        // || global is needed https://github.com/angular/zone.js/issues/190
        var target = this || event.target || _global;
        var tasks = target[zoneSymbolEventNames$1[event.type][TRUE_STR]];
        if (tasks) {
            // invoke all tasks which attached to current target with given event.type and capture = false
            // for performance concern, if task.length === 1, just invoke
            if (tasks.length === 1) {
                invokeTask(tasks[0], target, event);
            }
            else {
                // https://github.com/angular/zone.js/issues/836
                // copy the tasks array before invoke, to avoid
                // the callback will remove itself or other listener
                var copyTasks = tasks.slice();
                for (var i = 0; i < copyTasks.length; i++) {
                    if (event && event[IMMEDIATE_PROPAGATION_SYMBOL] === true) {
                        break;
                    }
                    invokeTask(copyTasks[i], target, event);
                }
            }
        }
    };
    function patchEventTargetMethods(obj, patchOptions) {
        if (!obj) {
            return false;
        }
        var useGlobalCallback = true;
        if (patchOptions && patchOptions.useG !== undefined) {
            useGlobalCallback = patchOptions.useG;
        }
        var validateHandler = patchOptions && patchOptions.vh;
        var checkDuplicate = true;
        if (patchOptions && patchOptions.chkDup !== undefined) {
            checkDuplicate = patchOptions.chkDup;
        }
        var returnTarget = false;
        if (patchOptions && patchOptions.rt !== undefined) {
            returnTarget = patchOptions.rt;
        }
        var proto = obj;
        while (proto && !proto.hasOwnProperty(ADD_EVENT_LISTENER)) {
            proto = ObjectGetPrototypeOf(proto);
        }
        if (!proto && obj[ADD_EVENT_LISTENER]) {
            // somehow we did not find it, but we can see it. This happens on IE for Window properties.
            proto = obj;
        }
        if (!proto) {
            return false;
        }
        if (proto[zoneSymbolAddEventListener]) {
            return false;
        }
        var eventNameToString = patchOptions && patchOptions.eventNameToString;
        // a shared global taskData to pass data for scheduleEventTask
        // so we do not need to create a new object just for pass some data
        var taskData = {};
        var nativeAddEventListener = proto[zoneSymbolAddEventListener] = proto[ADD_EVENT_LISTENER];
        var nativeRemoveEventListener = proto[zoneSymbol(REMOVE_EVENT_LISTENER)] =
            proto[REMOVE_EVENT_LISTENER];
        var nativeListeners = proto[zoneSymbol(LISTENERS_EVENT_LISTENER)] =
            proto[LISTENERS_EVENT_LISTENER];
        var nativeRemoveAllListeners = proto[zoneSymbol(REMOVE_ALL_LISTENERS_EVENT_LISTENER)] =
            proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER];
        var nativePrependEventListener;
        if (patchOptions && patchOptions.prepend) {
            nativePrependEventListener = proto[zoneSymbol(patchOptions.prepend)] =
                proto[patchOptions.prepend];
        }
        function checkIsPassive(task) {
            if (!passiveSupported && typeof taskData.options !== 'boolean' &&
                typeof taskData.options !== 'undefined' && taskData.options !== null) {
                // options is a non-null non-undefined object
                // passive is not supported
                // don't pass options as object
                // just pass capture as a boolean
                task.options = !!taskData.options.capture;
                taskData.options = task.options;
            }
        }
        var customScheduleGlobal = function (task) {
            // if there is already a task for the eventName + capture,
            // just return, because we use the shared globalZoneAwareCallback here.
            if (taskData.isExisting) {
                return;
            }
            checkIsPassive(task);
            return nativeAddEventListener.call(taskData.target, taskData.eventName, taskData.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, taskData.options);
        };
        var customCancelGlobal = function (task) {
            // if task is not marked as isRemoved, this call is directly
            // from Zone.prototype.cancelTask, we should remove the task
            // from tasksList of target first
            if (!task.isRemoved) {
                var symbolEventNames = zoneSymbolEventNames$1[task.eventName];
                var symbolEventName = void 0;
                if (symbolEventNames) {
                    symbolEventName = symbolEventNames[task.capture ? TRUE_STR : FALSE_STR];
                }
                var existingTasks = symbolEventName && task.target[symbolEventName];
                if (existingTasks) {
                    for (var i = 0; i < existingTasks.length; i++) {
                        var existingTask = existingTasks[i];
                        if (existingTask === task) {
                            existingTasks.splice(i, 1);
                            // set isRemoved to data for faster invokeTask check
                            task.isRemoved = true;
                            if (existingTasks.length === 0) {
                                // all tasks for the eventName + capture have gone,
                                // remove globalZoneAwareCallback and remove the task cache from target
                                task.allRemoved = true;
                                task.target[symbolEventName] = null;
                            }
                            break;
                        }
                    }
                }
            }
            // if all tasks for the eventName + capture have gone,
            // we will really remove the global event callback,
            // if not, return
            if (!task.allRemoved) {
                return;
            }
            return nativeRemoveEventListener.call(task.target, task.eventName, task.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, task.options);
        };
        var customScheduleNonGlobal = function (task) {
            checkIsPassive(task);
            return nativeAddEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
        };
        var customSchedulePrepend = function (task) {
            return nativePrependEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
        };
        var customCancelNonGlobal = function (task) {
            return nativeRemoveEventListener.call(task.target, task.eventName, task.invoke, task.options);
        };
        var customSchedule = useGlobalCallback ? customScheduleGlobal : customScheduleNonGlobal;
        var customCancel = useGlobalCallback ? customCancelGlobal : customCancelNonGlobal;
        var compareTaskCallbackVsDelegate = function (task, delegate) {
            var typeOfDelegate = typeof delegate;
            return (typeOfDelegate === 'function' && task.callback === delegate) ||
                (typeOfDelegate === 'object' && task.originalDelegate === delegate);
        };
        var compare = (patchOptions && patchOptions.diff) ? patchOptions.diff : compareTaskCallbackVsDelegate;
        var blackListedEvents = Zone[Zone.__symbol__('BLACK_LISTED_EVENTS')];
        var makeAddListener = function (nativeListener, addSource, customScheduleFn, customCancelFn, returnTarget, prepend) {
            if (returnTarget === void 0) { returnTarget = false; }
            if (prepend === void 0) { prepend = false; }
            return function () {
                var target = this || _global;
                var eventName = arguments[0];
                var delegate = arguments[1];
                if (!delegate) {
                    return nativeListener.apply(this, arguments);
                }
                if (isNode && eventName === 'uncaughtException') {
                    // don't patch uncaughtException of nodejs to prevent endless loop
                    return nativeListener.apply(this, arguments);
                }
                // don't create the bind delegate function for handleEvent
                // case here to improve addEventListener performance
                // we will create the bind delegate when invoke
                var isHandleEvent = false;
                if (typeof delegate !== 'function') {
                    if (!delegate.handleEvent) {
                        return nativeListener.apply(this, arguments);
                    }
                    isHandleEvent = true;
                }
                if (validateHandler && !validateHandler(nativeListener, delegate, target, arguments)) {
                    return;
                }
                var options = arguments[2];
                if (blackListedEvents) {
                    // check black list
                    for (var i = 0; i < blackListedEvents.length; i++) {
                        if (eventName === blackListedEvents[i]) {
                            return nativeListener.apply(this, arguments);
                        }
                    }
                }
                var capture;
                var once = false;
                if (options === undefined) {
                    capture = false;
                }
                else if (options === true) {
                    capture = true;
                }
                else if (options === false) {
                    capture = false;
                }
                else {
                    capture = options ? !!options.capture : false;
                    once = options ? !!options.once : false;
                }
                var zone = Zone.current;
                var symbolEventNames = zoneSymbolEventNames$1[eventName];
                var symbolEventName;
                if (!symbolEventNames) {
                    // the code is duplicate, but I just want to get some better performance
                    var falseEventName = (eventNameToString ? eventNameToString(eventName) : eventName) + FALSE_STR;
                    var trueEventName = (eventNameToString ? eventNameToString(eventName) : eventName) + TRUE_STR;
                    var symbol = ZONE_SYMBOL_PREFIX + falseEventName;
                    var symbolCapture = ZONE_SYMBOL_PREFIX + trueEventName;
                    zoneSymbolEventNames$1[eventName] = {};
                    zoneSymbolEventNames$1[eventName][FALSE_STR] = symbol;
                    zoneSymbolEventNames$1[eventName][TRUE_STR] = symbolCapture;
                    symbolEventName = capture ? symbolCapture : symbol;
                }
                else {
                    symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
                }
                var existingTasks = target[symbolEventName];
                var isExisting = false;
                if (existingTasks) {
                    // already have task registered
                    isExisting = true;
                    if (checkDuplicate) {
                        for (var i = 0; i < existingTasks.length; i++) {
                            if (compare(existingTasks[i], delegate)) {
                                // same callback, same capture, same event name, just return
                                return;
                            }
                        }
                    }
                }
                else {
                    existingTasks = target[symbolEventName] = [];
                }
                var source;
                var constructorName = target.constructor['name'];
                var targetSource = globalSources[constructorName];
                if (targetSource) {
                    source = targetSource[eventName];
                }
                if (!source) {
                    source = constructorName + addSource +
                        (eventNameToString ? eventNameToString(eventName) : eventName);
                }
                // do not create a new object as task.data to pass those things
                // just use the global shared one
                taskData.options = options;
                if (once) {
                    // if addEventListener with once options, we don't pass it to
                    // native addEventListener, instead we keep the once setting
                    // and handle ourselves.
                    taskData.options.once = false;
                }
                taskData.target = target;
                taskData.capture = capture;
                taskData.eventName = eventName;
                taskData.isExisting = isExisting;
                var data = useGlobalCallback ? OPTIMIZED_ZONE_EVENT_TASK_DATA : undefined;
                // keep taskData into data to allow onScheduleEventTask to access the task information
                if (data) {
                    data.taskData = taskData;
                }
                var task = zone.scheduleEventTask(source, delegate, data, customScheduleFn, customCancelFn);
                // should clear taskData.target to avoid memory leak
                // issue, https://github.com/angular/angular/issues/20442
                taskData.target = null;
                // need to clear up taskData because it is a global object
                if (data) {
                    data.taskData = null;
                }
                // have to save those information to task in case
                // application may call task.zone.cancelTask() directly
                if (once) {
                    options.once = true;
                }
                if (!(!passiveSupported && typeof task.options === 'boolean')) {
                    // if not support passive, and we pass an option object
                    // to addEventListener, we should save the options to task
                    task.options = options;
                }
                task.target = target;
                task.capture = capture;
                task.eventName = eventName;
                if (isHandleEvent) {
                    // save original delegate for compare to check duplicate
                    task.originalDelegate = delegate;
                }
                if (!prepend) {
                    existingTasks.push(task);
                }
                else {
                    existingTasks.unshift(task);
                }
                if (returnTarget) {
                    return target;
                }
            };
        };
        proto[ADD_EVENT_LISTENER] = makeAddListener(nativeAddEventListener, ADD_EVENT_LISTENER_SOURCE, customSchedule, customCancel, returnTarget);
        if (nativePrependEventListener) {
            proto[PREPEND_EVENT_LISTENER] = makeAddListener(nativePrependEventListener, PREPEND_EVENT_LISTENER_SOURCE, customSchedulePrepend, customCancel, returnTarget, true);
        }
        proto[REMOVE_EVENT_LISTENER] = function () {
            var target = this || _global;
            var eventName = arguments[0];
            var options = arguments[2];
            var capture;
            if (options === undefined) {
                capture = false;
            }
            else if (options === true) {
                capture = true;
            }
            else if (options === false) {
                capture = false;
            }
            else {
                capture = options ? !!options.capture : false;
            }
            var delegate = arguments[1];
            if (!delegate) {
                return nativeRemoveEventListener.apply(this, arguments);
            }
            if (validateHandler &&
                !validateHandler(nativeRemoveEventListener, delegate, target, arguments)) {
                return;
            }
            var symbolEventNames = zoneSymbolEventNames$1[eventName];
            var symbolEventName;
            if (symbolEventNames) {
                symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
            }
            var existingTasks = symbolEventName && target[symbolEventName];
            if (existingTasks) {
                for (var i = 0; i < existingTasks.length; i++) {
                    var existingTask = existingTasks[i];
                    if (compare(existingTask, delegate)) {
                        existingTasks.splice(i, 1);
                        // set isRemoved to data for faster invokeTask check
                        existingTask.isRemoved = true;
                        if (existingTasks.length === 0) {
                            // all tasks for the eventName + capture have gone,
                            // remove globalZoneAwareCallback and remove the task cache from target
                            existingTask.allRemoved = true;
                            target[symbolEventName] = null;
                        }
                        existingTask.zone.cancelTask(existingTask);
                        if (returnTarget) {
                            return target;
                        }
                        return;
                    }
                }
            }
            // issue 930, didn't find the event name or callback
            // from zone kept existingTasks, the callback maybe
            // added outside of zone, we need to call native removeEventListener
            // to try to remove it.
            return nativeRemoveEventListener.apply(this, arguments);
        };
        proto[LISTENERS_EVENT_LISTENER] = function () {
            var target = this || _global;
            var eventName = arguments[0];
            var listeners = [];
            var tasks = findEventTasks(target, eventNameToString ? eventNameToString(eventName) : eventName);
            for (var i = 0; i < tasks.length; i++) {
                var task = tasks[i];
                var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                listeners.push(delegate);
            }
            return listeners;
        };
        proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER] = function () {
            var target = this || _global;
            var eventName = arguments[0];
            if (!eventName) {
                var keys = Object.keys(target);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var match = EVENT_NAME_SYMBOL_REGX.exec(prop);
                    var evtName = match && match[1];
                    // in nodejs EventEmitter, removeListener event is
                    // used for monitoring the removeListener call,
                    // so just keep removeListener eventListener until
                    // all other eventListeners are removed
                    if (evtName && evtName !== 'removeListener') {
                        this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, evtName);
                    }
                }
                // remove removeListener listener finally
                this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, 'removeListener');
            }
            else {
                var symbolEventNames = zoneSymbolEventNames$1[eventName];
                if (symbolEventNames) {
                    var symbolEventName = symbolEventNames[FALSE_STR];
                    var symbolCaptureEventName = symbolEventNames[TRUE_STR];
                    var tasks = target[symbolEventName];
                    var captureTasks = target[symbolCaptureEventName];
                    if (tasks) {
                        var removeTasks = tasks.slice();
                        for (var i = 0; i < removeTasks.length; i++) {
                            var task = removeTasks[i];
                            var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                            this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
                        }
                    }
                    if (captureTasks) {
                        var removeTasks = captureTasks.slice();
                        for (var i = 0; i < removeTasks.length; i++) {
                            var task = removeTasks[i];
                            var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                            this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
                        }
                    }
                }
            }
            if (returnTarget) {
                return this;
            }
        };
        // for native toString patch
        attachOriginToPatched(proto[ADD_EVENT_LISTENER], nativeAddEventListener);
        attachOriginToPatched(proto[REMOVE_EVENT_LISTENER], nativeRemoveEventListener);
        if (nativeRemoveAllListeners) {
            attachOriginToPatched(proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER], nativeRemoveAllListeners);
        }
        if (nativeListeners) {
            attachOriginToPatched(proto[LISTENERS_EVENT_LISTENER], nativeListeners);
        }
        return true;
    }
    var results = [];
    for (var i = 0; i < apis.length; i++) {
        results[i] = patchEventTargetMethods(apis[i], patchOptions);
    }
    return results;
}
function findEventTasks(target, eventName) {
    var foundTasks = [];
    for (var prop in target) {
        var match = EVENT_NAME_SYMBOL_REGX.exec(prop);
        var evtName = match && match[1];
        if (evtName && (!eventName || evtName === eventName)) {
            var tasks = target[prop];
            if (tasks) {
                for (var i = 0; i < tasks.length; i++) {
                    foundTasks.push(tasks[i]);
                }
            }
        }
    }
    return foundTasks;
}
function patchEventPrototype(global, api) {
    var Event = global['Event'];
    if (Event && Event.prototype) {
        api.patchMethod(Event.prototype, 'stopImmediatePropagation', function (delegate) { return function (self, args) {
            self[IMMEDIATE_PROPAGATION_SYMBOL] = true;
            // we need to call the native stopImmediatePropagation
            // in case in some hybrid application, some part of
            // application will be controlled by zone, some are not
            delegate && delegate.apply(self, args);
        }; });
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {missingRequire}
 */
var taskSymbol = zoneSymbol('zoneTask');
function patchTimer(window, setName, cancelName, nameSuffix) {
    var setNative = null;
    var clearNative = null;
    setName += nameSuffix;
    cancelName += nameSuffix;
    var tasksByHandleId = {};
    function scheduleTask(task) {
        var data = task.data;
        function timer() {
            try {
                task.invoke.apply(this, arguments);
            }
            finally {
                // issue-934, task will be cancelled
                // even it is a periodic task such as
                // setInterval
                if (!(task.data && task.data.isPeriodic)) {
                    if (typeof data.handleId === 'number') {
                        // in non-nodejs env, we remove timerId
                        // from local cache
                        delete tasksByHandleId[data.handleId];
                    }
                    else if (data.handleId) {
                        // Node returns complex objects as handleIds
                        // we remove task reference from timer object
                        data.handleId[taskSymbol] = null;
                    }
                }
            }
        }
        data.args[0] = timer;
        data.handleId = setNative.apply(window, data.args);
        return task;
    }
    function clearTask(task) {
        return clearNative(task.data.handleId);
    }
    setNative =
        patchMethod(window, setName, function (delegate) { return function (self, args) {
            if (typeof args[0] === 'function') {
                var options = {
                    isPeriodic: nameSuffix === 'Interval',
                    delay: (nameSuffix === 'Timeout' || nameSuffix === 'Interval') ? args[1] || 0 :
                        undefined,
                    args: args
                };
                var task = scheduleMacroTaskWithCurrentZone(setName, args[0], options, scheduleTask, clearTask);
                if (!task) {
                    return task;
                }
                // Node.js must additionally support the ref and unref functions.
                var handle = task.data.handleId;
                if (typeof handle === 'number') {
                    // for non nodejs env, we save handleId: task
                    // mapping in local cache for clearTimeout
                    tasksByHandleId[handle] = task;
                }
                else if (handle) {
                    // for nodejs env, we save task
                    // reference in timerId Object for clearTimeout
                    handle[taskSymbol] = task;
                }
                // check whether handle is null, because some polyfill or browser
                // may return undefined from setTimeout/setInterval/setImmediate/requestAnimationFrame
                if (handle && handle.ref && handle.unref && typeof handle.ref === 'function' &&
                    typeof handle.unref === 'function') {
                    task.ref = handle.ref.bind(handle);
                    task.unref = handle.unref.bind(handle);
                }
                if (typeof handle === 'number' || handle) {
                    return handle;
                }
                return task;
            }
            else {
                // cause an error by calling it directly.
                return delegate.apply(window, args);
            }
        }; });
    clearNative =
        patchMethod(window, cancelName, function (delegate) { return function (self, args) {
            var id = args[0];
            var task;
            if (typeof id === 'number') {
                // non nodejs env.
                task = tasksByHandleId[id];
            }
            else {
                // nodejs env.
                task = id && id[taskSymbol];
                // other environments.
                if (!task) {
                    task = id;
                }
            }
            if (task && typeof task.type === 'string') {
                if (task.state !== 'notScheduled' &&
                    (task.cancelFn && task.data.isPeriodic || task.runCount === 0)) {
                    if (typeof id === 'number') {
                        delete tasksByHandleId[id];
                    }
                    else if (id) {
                        id[taskSymbol] = null;
                    }
                    // Do not cancel already canceled functions
                    task.zone.cancelTask(task);
                }
            }
            else {
                // cause an error by calling it directly.
                delegate.apply(window, args);
            }
        }; });
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/*
 * This is necessary for Chrome and Chrome mobile, to enable
 * things like redefining `createdCallback` on an element.
 */
var _defineProperty = Object[zoneSymbol('defineProperty')] = Object.defineProperty;
var _getOwnPropertyDescriptor = Object[zoneSymbol('getOwnPropertyDescriptor')] =
    Object.getOwnPropertyDescriptor;
var _create = Object.create;
var unconfigurablesKey = zoneSymbol('unconfigurables');
function propertyPatch() {
    Object.defineProperty = function (obj, prop, desc) {
        if (isUnconfigurable(obj, prop)) {
            throw new TypeError('Cannot assign to read only property \'' + prop + '\' of ' + obj);
        }
        var originalConfigurableFlag = desc.configurable;
        if (prop !== 'prototype') {
            desc = rewriteDescriptor(obj, prop, desc);
        }
        return _tryDefineProperty(obj, prop, desc, originalConfigurableFlag);
    };
    Object.defineProperties = function (obj, props) {
        Object.keys(props).forEach(function (prop) {
            Object.defineProperty(obj, prop, props[prop]);
        });
        return obj;
    };
    Object.create = function (obj, proto) {
        if (typeof proto === 'object' && !Object.isFrozen(proto)) {
            Object.keys(proto).forEach(function (prop) {
                proto[prop] = rewriteDescriptor(obj, prop, proto[prop]);
            });
        }
        return _create(obj, proto);
    };
    Object.getOwnPropertyDescriptor = function (obj, prop) {
        var desc = _getOwnPropertyDescriptor(obj, prop);
        if (desc && isUnconfigurable(obj, prop)) {
            desc.configurable = false;
        }
        return desc;
    };
}
function _redefineProperty(obj, prop, desc) {
    var originalConfigurableFlag = desc.configurable;
    desc = rewriteDescriptor(obj, prop, desc);
    return _tryDefineProperty(obj, prop, desc, originalConfigurableFlag);
}
function isUnconfigurable(obj, prop) {
    return obj && obj[unconfigurablesKey] && obj[unconfigurablesKey][prop];
}
function rewriteDescriptor(obj, prop, desc) {
    // issue-927, if the desc is frozen, don't try to change the desc
    if (!Object.isFrozen(desc)) {
        desc.configurable = true;
    }
    if (!desc.configurable) {
        // issue-927, if the obj is frozen, don't try to set the desc to obj
        if (!obj[unconfigurablesKey] && !Object.isFrozen(obj)) {
            _defineProperty(obj, unconfigurablesKey, { writable: true, value: {} });
        }
        if (obj[unconfigurablesKey]) {
            obj[unconfigurablesKey][prop] = true;
        }
    }
    return desc;
}
function _tryDefineProperty(obj, prop, desc, originalConfigurableFlag) {
    try {
        return _defineProperty(obj, prop, desc);
    }
    catch (error) {
        if (desc.configurable) {
            // In case of errors, when the configurable flag was likely set by rewriteDescriptor(), let's
            // retry with the original flag value
            if (typeof originalConfigurableFlag == 'undefined') {
                delete desc.configurable;
            }
            else {
                desc.configurable = originalConfigurableFlag;
            }
            try {
                return _defineProperty(obj, prop, desc);
            }
            catch (error) {
                var descJson = null;
                try {
                    descJson = JSON.stringify(desc);
                }
                catch (error) {
                    descJson = desc.toString();
                }
                console.log("Attempting to configure '" + prop + "' with descriptor '" + descJson + "' on object '" + obj + "' and got error, giving up: " + error);
            }
        }
        else {
            throw error;
        }
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// we have to patch the instance since the proto is non-configurable
function apply(api, _global) {
    var WS = _global.WebSocket;
    // On Safari window.EventTarget doesn't exist so need to patch WS add/removeEventListener
    // On older Chrome, no need since EventTarget was already patched
    if (!_global.EventTarget) {
        patchEventTarget(_global, [WS.prototype]);
    }
    _global.WebSocket = function (x, y) {
        var socket = arguments.length > 1 ? new WS(x, y) : new WS(x);
        var proxySocket;
        var proxySocketProto;
        // Safari 7.0 has non-configurable own 'onmessage' and friends properties on the socket instance
        var onmessageDesc = ObjectGetOwnPropertyDescriptor(socket, 'onmessage');
        if (onmessageDesc && onmessageDesc.configurable === false) {
            proxySocket = ObjectCreate(socket);
            // socket have own property descriptor 'onopen', 'onmessage', 'onclose', 'onerror'
            // but proxySocket not, so we will keep socket as prototype and pass it to
            // patchOnProperties method
            proxySocketProto = socket;
            [ADD_EVENT_LISTENER_STR, REMOVE_EVENT_LISTENER_STR, 'send', 'close'].forEach(function (propName) {
                proxySocket[propName] = function () {
                    var args = ArraySlice.call(arguments);
                    if (propName === ADD_EVENT_LISTENER_STR || propName === REMOVE_EVENT_LISTENER_STR) {
                        var eventName = args.length > 0 ? args[0] : undefined;
                        if (eventName) {
                            var propertySymbol = Zone.__symbol__('ON_PROPERTY' + eventName);
                            socket[propertySymbol] = proxySocket[propertySymbol];
                        }
                    }
                    return socket[propName].apply(socket, args);
                };
            });
        }
        else {
            // we can patch the real socket
            proxySocket = socket;
        }
        patchOnProperties(proxySocket, ['close', 'error', 'message', 'open'], proxySocketProto);
        return proxySocket;
    };
    var globalWebSocket = _global['WebSocket'];
    for (var prop in WS) {
        globalWebSocket[prop] = WS[prop];
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {globalThis}
 */
var globalEventHandlersEventNames = [
    'abort',
    'animationcancel',
    'animationend',
    'animationiteration',
    'auxclick',
    'beforeinput',
    'blur',
    'cancel',
    'canplay',
    'canplaythrough',
    'change',
    'compositionstart',
    'compositionupdate',
    'compositionend',
    'cuechange',
    'click',
    'close',
    'contextmenu',
    'curechange',
    'dblclick',
    'drag',
    'dragend',
    'dragenter',
    'dragexit',
    'dragleave',
    'dragover',
    'drop',
    'durationchange',
    'emptied',
    'ended',
    'error',
    'focus',
    'focusin',
    'focusout',
    'gotpointercapture',
    'input',
    'invalid',
    'keydown',
    'keypress',
    'keyup',
    'load',
    'loadstart',
    'loadeddata',
    'loadedmetadata',
    'lostpointercapture',
    'mousedown',
    'mouseenter',
    'mouseleave',
    'mousemove',
    'mouseout',
    'mouseover',
    'mouseup',
    'mousewheel',
    'orientationchange',
    'pause',
    'play',
    'playing',
    'pointercancel',
    'pointerdown',
    'pointerenter',
    'pointerleave',
    'pointerlockchange',
    'mozpointerlockchange',
    'webkitpointerlockerchange',
    'pointerlockerror',
    'mozpointerlockerror',
    'webkitpointerlockerror',
    'pointermove',
    'pointout',
    'pointerover',
    'pointerup',
    'progress',
    'ratechange',
    'reset',
    'resize',
    'scroll',
    'seeked',
    'seeking',
    'select',
    'selectionchange',
    'selectstart',
    'show',
    'sort',
    'stalled',
    'submit',
    'suspend',
    'timeupdate',
    'volumechange',
    'touchcancel',
    'touchmove',
    'touchstart',
    'touchend',
    'transitioncancel',
    'transitionend',
    'waiting',
    'wheel'
];
var documentEventNames = [
    'afterscriptexecute', 'beforescriptexecute', 'DOMContentLoaded', 'freeze', 'fullscreenchange',
    'mozfullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange', 'fullscreenerror',
    'mozfullscreenerror', 'webkitfullscreenerror', 'msfullscreenerror', 'readystatechange',
    'visibilitychange', 'resume'
];
var windowEventNames = [
    'absolutedeviceorientation',
    'afterinput',
    'afterprint',
    'appinstalled',
    'beforeinstallprompt',
    'beforeprint',
    'beforeunload',
    'devicelight',
    'devicemotion',
    'deviceorientation',
    'deviceorientationabsolute',
    'deviceproximity',
    'hashchange',
    'languagechange',
    'message',
    'mozbeforepaint',
    'offline',
    'online',
    'paint',
    'pageshow',
    'pagehide',
    'popstate',
    'rejectionhandled',
    'storage',
    'unhandledrejection',
    'unload',
    'userproximity',
    'vrdisplyconnected',
    'vrdisplaydisconnected',
    'vrdisplaypresentchange'
];
var htmlElementEventNames = [
    'beforecopy', 'beforecut', 'beforepaste', 'copy', 'cut', 'paste', 'dragstart', 'loadend',
    'animationstart', 'search', 'transitionrun', 'transitionstart', 'webkitanimationend',
    'webkitanimationiteration', 'webkitanimationstart', 'webkittransitionend'
];
var mediaElementEventNames = ['encrypted', 'waitingforkey', 'msneedkey', 'mozinterruptbegin', 'mozinterruptend'];
var ieElementEventNames = [
    'activate',
    'afterupdate',
    'ariarequest',
    'beforeactivate',
    'beforedeactivate',
    'beforeeditfocus',
    'beforeupdate',
    'cellchange',
    'controlselect',
    'dataavailable',
    'datasetchanged',
    'datasetcomplete',
    'errorupdate',
    'filterchange',
    'layoutcomplete',
    'losecapture',
    'move',
    'moveend',
    'movestart',
    'propertychange',
    'resizeend',
    'resizestart',
    'rowenter',
    'rowexit',
    'rowsdelete',
    'rowsinserted',
    'command',
    'compassneedscalibration',
    'deactivate',
    'help',
    'mscontentzoom',
    'msmanipulationstatechanged',
    'msgesturechange',
    'msgesturedoubletap',
    'msgestureend',
    'msgesturehold',
    'msgesturestart',
    'msgesturetap',
    'msgotpointercapture',
    'msinertiastart',
    'mslostpointercapture',
    'mspointercancel',
    'mspointerdown',
    'mspointerenter',
    'mspointerhover',
    'mspointerleave',
    'mspointermove',
    'mspointerout',
    'mspointerover',
    'mspointerup',
    'pointerout',
    'mssitemodejumplistitemremoved',
    'msthumbnailclick',
    'stop',
    'storagecommit'
];
var webglEventNames = ['webglcontextrestored', 'webglcontextlost', 'webglcontextcreationerror'];
var formEventNames = ['autocomplete', 'autocompleteerror'];
var detailEventNames = ['toggle'];
var frameEventNames = ['load'];
var frameSetEventNames = ['blur', 'error', 'focus', 'load', 'resize', 'scroll', 'messageerror'];
var marqueeEventNames = ['bounce', 'finish', 'start'];
var XMLHttpRequestEventNames = [
    'loadstart', 'progress', 'abort', 'error', 'load', 'progress', 'timeout', 'loadend',
    'readystatechange'
];
var IDBIndexEventNames = ['upgradeneeded', 'complete', 'abort', 'success', 'error', 'blocked', 'versionchange', 'close'];
var websocketEventNames = ['close', 'error', 'open', 'message'];
var workerEventNames = ['error', 'message'];
var eventNames = globalEventHandlersEventNames.concat(webglEventNames, formEventNames, detailEventNames, documentEventNames, windowEventNames, htmlElementEventNames, ieElementEventNames);
function filterProperties(target, onProperties, ignoreProperties) {
    if (!ignoreProperties || ignoreProperties.length === 0) {
        return onProperties;
    }
    var tip = ignoreProperties.filter(function (ip) { return ip.target === target; });
    if (!tip || tip.length === 0) {
        return onProperties;
    }
    var targetIgnoreProperties = tip[0].ignoreProperties;
    return onProperties.filter(function (op) { return targetIgnoreProperties.indexOf(op) === -1; });
}
function patchFilteredProperties(target, onProperties, ignoreProperties, prototype) {
    // check whether target is available, sometimes target will be undefined
    // because different browser or some 3rd party plugin.
    if (!target) {
        return;
    }
    var filteredProperties = filterProperties(target, onProperties, ignoreProperties);
    patchOnProperties(target, filteredProperties, prototype);
}
function propertyDescriptorPatch(api, _global) {
    if (isNode && !isMix) {
        return;
    }
    var supportsWebSocket = typeof WebSocket !== 'undefined';
    if (canPatchViaPropertyDescriptor()) {
        var ignoreProperties = _global['__Zone_ignore_on_properties'];
        // for browsers that we can patch the descriptor:  Chrome & Firefox
        if (isBrowser) {
            var internalWindow = window;
            var ignoreErrorProperties = isIE ? [{ target: internalWindow, ignoreProperties: ['error'] }] : [];
            // in IE/Edge, onProp not exist in window object, but in WindowPrototype
            // so we need to pass WindowPrototype to check onProp exist or not
            patchFilteredProperties(internalWindow, eventNames.concat(['messageerror']), ignoreProperties ? ignoreProperties.concat(ignoreErrorProperties) : ignoreProperties, ObjectGetPrototypeOf(internalWindow));
            patchFilteredProperties(Document.prototype, eventNames, ignoreProperties);
            if (typeof internalWindow['SVGElement'] !== 'undefined') {
                patchFilteredProperties(internalWindow['SVGElement'].prototype, eventNames, ignoreProperties);
            }
            patchFilteredProperties(Element.prototype, eventNames, ignoreProperties);
            patchFilteredProperties(HTMLElement.prototype, eventNames, ignoreProperties);
            patchFilteredProperties(HTMLMediaElement.prototype, mediaElementEventNames, ignoreProperties);
            patchFilteredProperties(HTMLFrameSetElement.prototype, windowEventNames.concat(frameSetEventNames), ignoreProperties);
            patchFilteredProperties(HTMLBodyElement.prototype, windowEventNames.concat(frameSetEventNames), ignoreProperties);
            patchFilteredProperties(HTMLFrameElement.prototype, frameEventNames, ignoreProperties);
            patchFilteredProperties(HTMLIFrameElement.prototype, frameEventNames, ignoreProperties);
            var HTMLMarqueeElement_1 = internalWindow['HTMLMarqueeElement'];
            if (HTMLMarqueeElement_1) {
                patchFilteredProperties(HTMLMarqueeElement_1.prototype, marqueeEventNames, ignoreProperties);
            }
            var Worker_1 = internalWindow['Worker'];
            if (Worker_1) {
                patchFilteredProperties(Worker_1.prototype, workerEventNames, ignoreProperties);
            }
        }
        patchFilteredProperties(XMLHttpRequest.prototype, XMLHttpRequestEventNames, ignoreProperties);
        var XMLHttpRequestEventTarget_1 = _global['XMLHttpRequestEventTarget'];
        if (XMLHttpRequestEventTarget_1) {
            patchFilteredProperties(XMLHttpRequestEventTarget_1 && XMLHttpRequestEventTarget_1.prototype, XMLHttpRequestEventNames, ignoreProperties);
        }
        if (typeof IDBIndex !== 'undefined') {
            patchFilteredProperties(IDBIndex.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBRequest.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBOpenDBRequest.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBDatabase.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBTransaction.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBCursor.prototype, IDBIndexEventNames, ignoreProperties);
        }
        if (supportsWebSocket) {
            patchFilteredProperties(WebSocket.prototype, websocketEventNames, ignoreProperties);
        }
    }
    else {
        // Safari, Android browsers (Jelly Bean)
        patchViaCapturingAllTheEvents();
        patchClass('XMLHttpRequest');
        if (supportsWebSocket) {
            apply(api, _global);
        }
    }
}
function canPatchViaPropertyDescriptor() {
    if ((isBrowser || isMix) && !ObjectGetOwnPropertyDescriptor(HTMLElement.prototype, 'onclick') &&
        typeof Element !== 'undefined') {
        // WebKit https://bugs.webkit.org/show_bug.cgi?id=134364
        // IDL interface attributes are not configurable
        var desc = ObjectGetOwnPropertyDescriptor(Element.prototype, 'onclick');
        if (desc && !desc.configurable)
            return false;
    }
    var ON_READY_STATE_CHANGE = 'onreadystatechange';
    var XMLHttpRequestPrototype = XMLHttpRequest.prototype;
    var xhrDesc = ObjectGetOwnPropertyDescriptor(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE);
    // add enumerable and configurable here because in opera
    // by default XMLHttpRequest.prototype.onreadystatechange is undefined
    // without adding enumerable and configurable will cause onreadystatechange
    // non-configurable
    // and if XMLHttpRequest.prototype.onreadystatechange is undefined,
    // we should set a real desc instead a fake one
    if (xhrDesc) {
        ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, {
            enumerable: true,
            configurable: true,
            get: function () {
                return true;
            }
        });
        var req = new XMLHttpRequest();
        var result = !!req.onreadystatechange;
        // restore original desc
        ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, xhrDesc || {});
        return result;
    }
    else {
        var SYMBOL_FAKE_ONREADYSTATECHANGE_1 = zoneSymbol('fake');
        ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, {
            enumerable: true,
            configurable: true,
            get: function () {
                return this[SYMBOL_FAKE_ONREADYSTATECHANGE_1];
            },
            set: function (value) {
                this[SYMBOL_FAKE_ONREADYSTATECHANGE_1] = value;
            }
        });
        var req = new XMLHttpRequest();
        var detectFunc = function () { };
        req.onreadystatechange = detectFunc;
        var result = req[SYMBOL_FAKE_ONREADYSTATECHANGE_1] === detectFunc;
        req.onreadystatechange = null;
        return result;
    }
}
var unboundKey = zoneSymbol('unbound');
// Whenever any eventListener fires, we check the eventListener target and all parents
// for `onwhatever` properties and replace them with zone-bound functions
// - Chrome (for now)
function patchViaCapturingAllTheEvents() {
    var _loop_1 = function (i) {
        var property = eventNames[i];
        var onproperty = 'on' + property;
        self.addEventListener(property, function (event) {
            var elt = event.target, bound, source;
            if (elt) {
                source = elt.constructor['name'] + '.' + onproperty;
            }
            else {
                source = 'unknown.' + onproperty;
            }
            while (elt) {
                if (elt[onproperty] && !elt[onproperty][unboundKey]) {
                    bound = wrapWithCurrentZone(elt[onproperty], source);
                    bound[unboundKey] = elt[onproperty];
                    elt[onproperty] = bound;
                }
                elt = elt.parentElement;
            }
        }, true);
    };
    for (var i = 0; i < eventNames.length; i++) {
        _loop_1(i);
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function eventTargetPatch(_global, api) {
    var WTF_ISSUE_555 = 'Anchor,Area,Audio,BR,Base,BaseFont,Body,Button,Canvas,Content,DList,Directory,Div,Embed,FieldSet,Font,Form,Frame,FrameSet,HR,Head,Heading,Html,IFrame,Image,Input,Keygen,LI,Label,Legend,Link,Map,Marquee,Media,Menu,Meta,Meter,Mod,OList,Object,OptGroup,Option,Output,Paragraph,Pre,Progress,Quote,Script,Select,Source,Span,Style,TableCaption,TableCell,TableCol,Table,TableRow,TableSection,TextArea,Title,Track,UList,Unknown,Video';
    var NO_EVENT_TARGET = 'ApplicationCache,EventSource,FileReader,InputMethodContext,MediaController,MessagePort,Node,Performance,SVGElementInstance,SharedWorker,TextTrack,TextTrackCue,TextTrackList,WebKitNamedFlow,Window,Worker,WorkerGlobalScope,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload,IDBRequest,IDBOpenDBRequest,IDBDatabase,IDBTransaction,IDBCursor,DBIndex,WebSocket'
        .split(',');
    var EVENT_TARGET = 'EventTarget';
    var apis = [];
    var isWtf = _global['wtf'];
    var WTF_ISSUE_555_ARRAY = WTF_ISSUE_555.split(',');
    if (isWtf) {
        // Workaround for: https://github.com/google/tracing-framework/issues/555
        apis = WTF_ISSUE_555_ARRAY.map(function (v) { return 'HTML' + v + 'Element'; }).concat(NO_EVENT_TARGET);
    }
    else if (_global[EVENT_TARGET]) {
        apis.push(EVENT_TARGET);
    }
    else {
        // Note: EventTarget is not available in all browsers,
        // if it's not available, we instead patch the APIs in the IDL that inherit from EventTarget
        apis = NO_EVENT_TARGET;
    }
    var isDisableIECheck = _global['__Zone_disable_IE_check'] || false;
    var isEnableCrossContextCheck = _global['__Zone_enable_cross_context_check'] || false;
    var ieOrEdge = isIEOrEdge();
    var ADD_EVENT_LISTENER_SOURCE = '.addEventListener:';
    var FUNCTION_WRAPPER = '[object FunctionWrapper]';
    var BROWSER_TOOLS = 'function __BROWSERTOOLS_CONSOLE_SAFEFUNC() { [native code] }';
    //  predefine all __zone_symbol__ + eventName + true/false string
    for (var i = 0; i < eventNames.length; i++) {
        var eventName = eventNames[i];
        var falseEventName = eventName + FALSE_STR;
        var trueEventName = eventName + TRUE_STR;
        var symbol = ZONE_SYMBOL_PREFIX + falseEventName;
        var symbolCapture = ZONE_SYMBOL_PREFIX + trueEventName;
        zoneSymbolEventNames$1[eventName] = {};
        zoneSymbolEventNames$1[eventName][FALSE_STR] = symbol;
        zoneSymbolEventNames$1[eventName][TRUE_STR] = symbolCapture;
    }
    //  predefine all task.source string
    for (var i = 0; i < WTF_ISSUE_555.length; i++) {
        var target = WTF_ISSUE_555_ARRAY[i];
        var targets = globalSources[target] = {};
        for (var j = 0; j < eventNames.length; j++) {
            var eventName = eventNames[j];
            targets[eventName] = target + ADD_EVENT_LISTENER_SOURCE + eventName;
        }
    }
    var checkIEAndCrossContext = function (nativeDelegate, delegate, target, args) {
        if (!isDisableIECheck && ieOrEdge) {
            if (isEnableCrossContextCheck) {
                try {
                    var testString = delegate.toString();
                    if ((testString === FUNCTION_WRAPPER || testString == BROWSER_TOOLS)) {
                        nativeDelegate.apply(target, args);
                        return false;
                    }
                }
                catch (error) {
                    nativeDelegate.apply(target, args);
                    return false;
                }
            }
            else {
                var testString = delegate.toString();
                if ((testString === FUNCTION_WRAPPER || testString == BROWSER_TOOLS)) {
                    nativeDelegate.apply(target, args);
                    return false;
                }
            }
        }
        else if (isEnableCrossContextCheck) {
            try {
                delegate.toString();
            }
            catch (error) {
                nativeDelegate.apply(target, args);
                return false;
            }
        }
        return true;
    };
    var apiTypes = [];
    for (var i = 0; i < apis.length; i++) {
        var type = _global[apis[i]];
        apiTypes.push(type && type.prototype);
    }
    // vh is validateHandler to check event handler
    // is valid or not(for security check)
    patchEventTarget(_global, apiTypes, { vh: checkIEAndCrossContext });
    api.patchEventTarget = patchEventTarget;
    return true;
}
function patchEvent(global, api) {
    patchEventPrototype(global, api);
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function patchCallbacks(target, targetName, method, callbacks) {
    var symbol = Zone.__symbol__(method);
    if (target[symbol]) {
        return;
    }
    var nativeDelegate = target[symbol] = target[method];
    target[method] = function (name, opts, options) {
        if (opts && opts.prototype) {
            callbacks.forEach(function (callback) {
                var source = targetName + "." + method + "::" + callback;
                var prototype = opts.prototype;
                if (prototype.hasOwnProperty(callback)) {
                    var descriptor = ObjectGetOwnPropertyDescriptor(prototype, callback);
                    if (descriptor && descriptor.value) {
                        descriptor.value = wrapWithCurrentZone(descriptor.value, source);
                        _redefineProperty(opts.prototype, callback, descriptor);
                    }
                    else if (prototype[callback]) {
                        prototype[callback] = wrapWithCurrentZone(prototype[callback], source);
                    }
                }
                else if (prototype[callback]) {
                    prototype[callback] = wrapWithCurrentZone(prototype[callback], source);
                }
            });
        }
        return nativeDelegate.call(target, name, opts, options);
    };
    attachOriginToPatched(target[method], nativeDelegate);
}
function registerElementPatch(_global) {
    if ((!isBrowser && !isMix) || !('registerElement' in _global.document)) {
        return;
    }
    var callbacks = ['createdCallback', 'attachedCallback', 'detachedCallback', 'attributeChangedCallback'];
    patchCallbacks(document, 'Document', 'registerElement', callbacks);
}
function patchCustomElements(_global) {
    if ((!isBrowser && !isMix) || !('customElements' in _global)) {
        return;
    }
    var callbacks = ['connectedCallback', 'disconnectedCallback', 'adoptedCallback', 'attributeChangedCallback'];
    patchCallbacks(_global.customElements, 'customElements', 'define', callbacks);
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {missingRequire}
 */
Zone.__load_patch('util', function (global, Zone, api) {
    api.patchOnProperties = patchOnProperties;
    api.patchMethod = patchMethod;
    api.bindArguments = bindArguments;
});
Zone.__load_patch('timers', function (global) {
    var set = 'set';
    var clear = 'clear';
    patchTimer(global, set, clear, 'Timeout');
    patchTimer(global, set, clear, 'Interval');
    patchTimer(global, set, clear, 'Immediate');
});
Zone.__load_patch('requestAnimationFrame', function (global) {
    patchTimer(global, 'request', 'cancel', 'AnimationFrame');
    patchTimer(global, 'mozRequest', 'mozCancel', 'AnimationFrame');
    patchTimer(global, 'webkitRequest', 'webkitCancel', 'AnimationFrame');
});
Zone.__load_patch('blocking', function (global, Zone) {
    var blockingMethods = ['alert', 'prompt', 'confirm'];
    for (var i = 0; i < blockingMethods.length; i++) {
        var name_1 = blockingMethods[i];
        patchMethod(global, name_1, function (delegate, symbol, name) {
            return function (s, args) {
                return Zone.current.run(delegate, global, args, name);
            };
        });
    }
});
Zone.__load_patch('EventTarget', function (global, Zone, api) {
    // load blackListEvents from global
    var SYMBOL_BLACK_LISTED_EVENTS = Zone.__symbol__('BLACK_LISTED_EVENTS');
    if (global[SYMBOL_BLACK_LISTED_EVENTS]) {
        Zone[SYMBOL_BLACK_LISTED_EVENTS] = global[SYMBOL_BLACK_LISTED_EVENTS];
    }
    patchEvent(global, api);
    eventTargetPatch(global, api);
    // patch XMLHttpRequestEventTarget's addEventListener/removeEventListener
    var XMLHttpRequestEventTarget = global['XMLHttpRequestEventTarget'];
    if (XMLHttpRequestEventTarget && XMLHttpRequestEventTarget.prototype) {
        api.patchEventTarget(global, [XMLHttpRequestEventTarget.prototype]);
    }
    patchClass('MutationObserver');
    patchClass('WebKitMutationObserver');
    patchClass('IntersectionObserver');
    patchClass('FileReader');
});
Zone.__load_patch('on_property', function (global, Zone, api) {
    propertyDescriptorPatch(api, global);
    propertyPatch();
});
Zone.__load_patch('customElements', function (global, Zone, api) {
    registerElementPatch(global);
    patchCustomElements(global);
});
Zone.__load_patch('canvas', function (global) {
    var HTMLCanvasElement = global['HTMLCanvasElement'];
    if (typeof HTMLCanvasElement !== 'undefined' && HTMLCanvasElement.prototype &&
        HTMLCanvasElement.prototype.toBlob) {
        patchMacroTask(HTMLCanvasElement.prototype, 'toBlob', function (self, args) {
            return { name: 'HTMLCanvasElement.toBlob', target: self, cbIdx: 0, args: args };
        });
    }
});
Zone.__load_patch('XHR', function (global, Zone) {
    // Treat XMLHttpRequest as a macrotask.
    patchXHR(global);
    var XHR_TASK = zoneSymbol('xhrTask');
    var XHR_SYNC = zoneSymbol('xhrSync');
    var XHR_LISTENER = zoneSymbol('xhrListener');
    var XHR_SCHEDULED = zoneSymbol('xhrScheduled');
    var XHR_URL = zoneSymbol('xhrURL');
    var XHR_ERROR_BEFORE_SCHEDULED = zoneSymbol('xhrErrorBeforeScheduled');
    function patchXHR(window) {
        var XMLHttpRequestPrototype = XMLHttpRequest.prototype;
        function findPendingTask(target) {
            return target[XHR_TASK];
        }
        var oriAddListener = XMLHttpRequestPrototype[ZONE_SYMBOL_ADD_EVENT_LISTENER];
        var oriRemoveListener = XMLHttpRequestPrototype[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
        if (!oriAddListener) {
            var XMLHttpRequestEventTarget_1 = window['XMLHttpRequestEventTarget'];
            if (XMLHttpRequestEventTarget_1) {
                var XMLHttpRequestEventTargetPrototype = XMLHttpRequestEventTarget_1.prototype;
                oriAddListener = XMLHttpRequestEventTargetPrototype[ZONE_SYMBOL_ADD_EVENT_LISTENER];
                oriRemoveListener = XMLHttpRequestEventTargetPrototype[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
            }
        }
        var READY_STATE_CHANGE = 'readystatechange';
        var SCHEDULED = 'scheduled';
        function scheduleTask(task) {
            var data = task.data;
            var target = data.target;
            target[XHR_SCHEDULED] = false;
            target[XHR_ERROR_BEFORE_SCHEDULED] = false;
            // remove existing event listener
            var listener = target[XHR_LISTENER];
            if (!oriAddListener) {
                oriAddListener = target[ZONE_SYMBOL_ADD_EVENT_LISTENER];
                oriRemoveListener = target[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
            }
            if (listener) {
                oriRemoveListener.call(target, READY_STATE_CHANGE, listener);
            }
            var newListener = target[XHR_LISTENER] = function () {
                if (target.readyState === target.DONE) {
                    // sometimes on some browsers XMLHttpRequest will fire onreadystatechange with
                    // readyState=4 multiple times, so we need to check task state here
                    if (!data.aborted && target[XHR_SCHEDULED] && task.state === SCHEDULED) {
                        // check whether the xhr has registered onload listener
                        // if that is the case, the task should invoke after all
                        // onload listeners finish.
                        var loadTasks = target['__zone_symbol__loadfalse'];
                        if (loadTasks && loadTasks.length > 0) {
                            var oriInvoke_1 = task.invoke;
                            task.invoke = function () {
                                // need to load the tasks again, because in other
                                // load listener, they may remove themselves
                                var loadTasks = target['__zone_symbol__loadfalse'];
                                for (var i = 0; i < loadTasks.length; i++) {
                                    if (loadTasks[i] === task) {
                                        loadTasks.splice(i, 1);
                                    }
                                }
                                if (!data.aborted && task.state === SCHEDULED) {
                                    oriInvoke_1.call(task);
                                }
                            };
                            loadTasks.push(task);
                        }
                        else {
                            task.invoke();
                        }
                    }
                    else if (!data.aborted && target[XHR_SCHEDULED] === false) {
                        // error occurs when xhr.send()
                        target[XHR_ERROR_BEFORE_SCHEDULED] = true;
                    }
                }
            };
            oriAddListener.call(target, READY_STATE_CHANGE, newListener);
            var storedTask = target[XHR_TASK];
            if (!storedTask) {
                target[XHR_TASK] = task;
            }
            sendNative.apply(target, data.args);
            target[XHR_SCHEDULED] = true;
            return task;
        }
        function placeholderCallback() { }
        function clearTask(task) {
            var data = task.data;
            // Note - ideally, we would call data.target.removeEventListener here, but it's too late
            // to prevent it from firing. So instead, we store info for the event listener.
            data.aborted = true;
            return abortNative.apply(data.target, data.args);
        }
        var openNative = patchMethod(XMLHttpRequestPrototype, 'open', function () { return function (self, args) {
            self[XHR_SYNC] = args[2] == false;
            self[XHR_URL] = args[1];
            return openNative.apply(self, args);
        }; });
        var XMLHTTPREQUEST_SOURCE = 'XMLHttpRequest.send';
        var fetchTaskAborting = zoneSymbol('fetchTaskAborting');
        var fetchTaskScheduling = zoneSymbol('fetchTaskScheduling');
        var sendNative = patchMethod(XMLHttpRequestPrototype, 'send', function () { return function (self, args) {
            if (Zone.current[fetchTaskScheduling] === true) {
                // a fetch is scheduling, so we are using xhr to polyfill fetch
                // and because we already schedule macroTask for fetch, we should
                // not schedule a macroTask for xhr again
                return sendNative.apply(self, args);
            }
            if (self[XHR_SYNC]) {
                // if the XHR is sync there is no task to schedule, just execute the code.
                return sendNative.apply(self, args);
            }
            else {
                var options = { target: self, url: self[XHR_URL], isPeriodic: false, args: args, aborted: false };
                var task = scheduleMacroTaskWithCurrentZone(XMLHTTPREQUEST_SOURCE, placeholderCallback, options, scheduleTask, clearTask);
                if (self && self[XHR_ERROR_BEFORE_SCHEDULED] === true && !options.aborted &&
                    task.state === SCHEDULED) {
                    // xhr request throw error when send
                    // we should invoke task instead of leaving a scheduled
                    // pending macroTask
                    task.invoke();
                }
            }
        }; });
        var abortNative = patchMethod(XMLHttpRequestPrototype, 'abort', function () { return function (self, args) {
            var task = findPendingTask(self);
            if (task && typeof task.type == 'string') {
                // If the XHR has already completed, do nothing.
                // If the XHR has already been aborted, do nothing.
                // Fix #569, call abort multiple times before done will cause
                // macroTask task count be negative number
                if (task.cancelFn == null || (task.data && task.data.aborted)) {
                    return;
                }
                task.zone.cancelTask(task);
            }
            else if (Zone.current[fetchTaskAborting] === true) {
                // the abort is called from fetch polyfill, we need to call native abort of XHR.
                return abortNative.apply(self, args);
            }
            // Otherwise, we are trying to abort an XHR which has not yet been sent, so there is no
            // task
            // to cancel. Do nothing.
        }; });
    }
});
Zone.__load_patch('geolocation', function (global) {
    /// GEO_LOCATION
    if (global['navigator'] && global['navigator'].geolocation) {
        patchPrototype(global['navigator'].geolocation, ['getCurrentPosition', 'watchPosition']);
    }
});
Zone.__load_patch('PromiseRejectionEvent', function (global, Zone) {
    // handle unhandled promise rejection
    function findPromiseRejectionHandler(evtName) {
        return function (e) {
            var eventTasks = findEventTasks(global, evtName);
            eventTasks.forEach(function (eventTask) {
                // windows has added unhandledrejection event listener
                // trigger the event listener
                var PromiseRejectionEvent = global['PromiseRejectionEvent'];
                if (PromiseRejectionEvent) {
                    var evt = new PromiseRejectionEvent(evtName, { promise: e.promise, reason: e.rejection });
                    eventTask.invoke(evt);
                }
            });
        };
    }
    if (global['PromiseRejectionEvent']) {
        Zone[zoneSymbol('unhandledPromiseRejectionHandler')] =
            findPromiseRejectionHandler('unhandledrejection');
        Zone[zoneSymbol('rejectionHandledHandler')] =
            findPromiseRejectionHandler('rejectionhandled');
    }
});

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

})));


/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/*! exports provided: name, version, engines, license, scripts, private, dependencies, devDependencies, default */
/***/ (function(module) {

module.exports = {"name":"project_image_editor","version":"0.0.0","engines":{"node":"10.15.0","npm":"6.4.1"},"license":"MIT","scripts":{"ng":"ng","start":"node server.js","build":"ng build","build:prod":"ng build --prod","build:both":"npm run build && npm run build:prod","test":"ng test","lint":"ng lint","e2e":"ng e2e","heroku-postbuild":"ng build --output-path=dist --prod --build-optimizer"},"private":true,"dependencies":{"@angular/animations":"^7.2.8","@angular/cdk":"^7.3.4","@angular/common":"~7.2.5","@angular/compiler":"~7.2.5","@angular/core":"~7.2.5","@angular/forms":"~7.2.5","@angular/http":"~7.2.5","@angular/material":"^7.3.4","@angular/platform-browser":"~7.2.5","@angular/platform-browser-dynamic":"~7.2.5","@angular/router":"~7.2.5","bcryptjs":"^2.4.3","body-parser":"^1.18.3","bootstrap":"^4.3.1","cookie":"^0.3.1","core-js":"^2.6.5","cors":"^2.8.4","crypto":"^1.0.1","express":"^4.16.3","express-jwt":"^5.3.1","express-longpoll":"0.0.4","express-session":"^1.15.6","fs":"0.0.1-security","hammerjs":"^2.0.8","jquery":"^1.9.1","jsonwebtoken":"^8.2.2","mongodb":"^3.2.2","mongoose":"^5.1.4","morgan":"^1.9.1","ngx-color-picker":"^7.4.0","path":"^0.12.7","popper.js":"^1.14.7","rootpath":"^0.1.2","rxjs":"^6.4.0","save-svg-as-png":"^1.4.12","serve-favicon":"^2.5.0","snapsvg":"^0.5.1","snapsvg-cjs":"0.0.6","spdy":"^4.0.0","svg-to-dataurl":"^1.0.0","three":"^0.101.1","three-full":"^17.1.0","types-save-svg-as-png":"^1.0.1","validator":"^10.11.0","zone.js":"^0.8.29","typescript":"~3.2.4"},"devDependencies":{"@angular-devkit/build-angular":"^0.13.1","@angular/cli":"~7.3.1","@angular/compiler-cli":"~7.2.5","@angular/language-service":"~7.2.5","@types/jasmine":"^2.8.16","@types/jasminewd2":"~2.0.2","@types/node":"^10.12.26","@types/three":"^0.93.26","codelyzer":"~4.5.0","enhanced-resolve":"^3.3.0","jasmine-core":"~2.99.1","jasmine-spec-reporter":"~4.2.1","karma":"~3.1.4","karma-chrome-launcher":"~2.2.0","karma-coverage-istanbul-reporter":"^2.0.1","karma-jasmine":"^1.1.2","karma-jasmine-html-reporter":"^0.2.2","nodemon":"^1.17.5","protractor":"^5.4.2","ts-node":"~7.0.0","tslint":"~5.11.0","typescript":"~3.2.4"}};

/***/ }),

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/_components/alert.component.html":
/*!**************************************************!*\
  !*** ./src/app/_components/alert.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"message\" [ngClass]=\"{ 'alert': message, 'alert-success': message.type === 'success', 'alert-danger': message.type === 'error' }\">{{message.text}}</div>"

/***/ }),

/***/ "./src/app/_components/alert.component.ts":
/*!************************************************!*\
  !*** ./src/app/_components/alert.component.ts ***!
  \************************************************/
/*! exports provided: AlertComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AlertComponent", function() { return AlertComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_services */ "./src/app/_services/index.ts");



var AlertComponent = /** @class */ (function () {
    function AlertComponent(alertService) {
        this.alertService = alertService;
    }
    AlertComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscription = this.alertService.getMessage().subscribe(function (message) {
            _this.message = message;
        });
    };
    AlertComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    AlertComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'alert',
            template: __webpack_require__(/*! ./alert.component.html */ "./src/app/_components/alert.component.html")
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services__WEBPACK_IMPORTED_MODULE_2__["AlertService"]])
    ], AlertComponent);
    return AlertComponent;
}());



/***/ }),

/***/ "./src/app/_components/index.ts":
/*!**************************************!*\
  !*** ./src/app/_components/index.ts ***!
  \**************************************/
/*! exports provided: AlertComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _alert_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./alert.component */ "./src/app/_components/alert.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AlertComponent", function() { return _alert_component__WEBPACK_IMPORTED_MODULE_0__["AlertComponent"]; });




/***/ }),

/***/ "./src/app/_guards/auth.guard.ts":
/*!***************************************!*\
  !*** ./src/app/_guards/auth.guard.ts ***!
  \***************************************/
/*! exports provided: AuthGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthGuard", function() { return AuthGuard; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../_services */ "./src/app/_services/index.ts");




var AuthGuard = /** @class */ (function () {
    function AuthGuard(router, authenticationService) {
        this.router = router;
        this.authenticationService = authenticationService;
    }
    AuthGuard.prototype.canActivate = function (route, state) {
        var currentUser = this.authenticationService.currentUserValue;
        if (currentUser) {
            // authorised so return true
            return true;
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    };
    AuthGuard = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({ providedIn: 'root' }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _services__WEBPACK_IMPORTED_MODULE_3__["AuthenticationService"]])
    ], AuthGuard);
    return AuthGuard;
}());



/***/ }),

/***/ "./src/app/_guards/index.ts":
/*!**********************************!*\
  !*** ./src/app/_guards/index.ts ***!
  \**********************************/
/*! exports provided: AuthGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _auth_guard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./auth.guard */ "./src/app/_guards/auth.guard.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AuthGuard", function() { return _auth_guard__WEBPACK_IMPORTED_MODULE_0__["AuthGuard"]; });




/***/ }),

/***/ "./src/app/_helpers/error.interceptor.ts":
/*!***********************************************!*\
  !*** ./src/app/_helpers/error.interceptor.ts ***!
  \***********************************************/
/*! exports provided: ErrorInterceptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ErrorInterceptor", function() { return ErrorInterceptor; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../_services */ "./src/app/_services/index.ts");





var ErrorInterceptor = /** @class */ (function () {
    function ErrorInterceptor(authenticationService) {
        this.authenticationService = authenticationService;
    }
    ErrorInterceptor.prototype.intercept = function (request, next) {
        var _this = this;
        return next.handle(request).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(function (err) {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                _this.authenticationService.logout();
                location.reload(true);
            }
            var error = err.error.message || err.statusText;
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["throwError"])(error);
        }));
    };
    ErrorInterceptor = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services__WEBPACK_IMPORTED_MODULE_4__["AuthenticationService"]])
    ], ErrorInterceptor);
    return ErrorInterceptor;
}());



/***/ }),

/***/ "./src/app/_helpers/fake-backend.ts":
/*!******************************************!*\
  !*** ./src/app/_helpers/fake-backend.ts ***!
  \******************************************/
/*! exports provided: FakeBackendInterceptor, fakeBackendProvider */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FakeBackendInterceptor", function() { return FakeBackendInterceptor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fakeBackendProvider", function() { return fakeBackendProvider; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");





var FakeBackendInterceptor = /** @class */ (function () {
    function FakeBackendInterceptor() {
    }
    FakeBackendInterceptor.prototype.intercept = function (request, next) {
        // array in local storage for registered users
        var users = JSON.parse(localStorage.getItem('users')) || [];
        // wrap in delayed observable to simulate server api call
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(null).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["mergeMap"])(function () {
            // authenticate
            if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {
                // find if any user matches login credentials
                var filteredUsers = users.filter(function (user) {
                    return user.username === request.body.username && user.password === request.body.password;
                });
                if (filteredUsers.length) {
                    // if login details are valid return 200 OK with user details and fake jwt token
                    var user = filteredUsers[0];
                    var body = {
                        id: user.id,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        token: 'fake-jwt-token'
                    };
                    return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpResponse"]({ status: 200, body: body }));
                }
                else {
                    // else return 400 bad request
                    return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["throwError"])({ error: { message: 'Username or password is incorrect' } });
                }
            }
            // get users
            if (request.url.endsWith('/users') && request.method === 'GET') {
                // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpResponse"]({ status: 200, body: users }));
                }
                else {
                    // return 401 not authorised if token is null or invalid
                    return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["throwError"])({ status: 401, error: { message: 'Unauthorised' } });
                }
            }
            // get user by id
            if (request.url.match(/\/users\/\d+$/) && request.method === 'GET') {
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find user by id in users array
                    var urlParts = request.url.split('/');
                    var id_1 = parseInt(urlParts[urlParts.length - 1]);
                    var matchedUsers = users.filter(function (user) { return user.id === id_1; });
                    var user = matchedUsers.length ? matchedUsers[0] : null;
                    return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpResponse"]({ status: 200, body: user }));
                }
                else {
                    // return 401 not authorised if token is null or invalid
                    return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["throwError"])({ status: 401, error: { message: 'Unauthorised' } });
                }
            }
            // register user
            if (request.url.endsWith('/users/register') && request.method === 'POST') {
                // get new user object from post body
                var newUser_1 = request.body;
                // validation
                var duplicateUser = users.filter(function (user) { return user.username === newUser_1.username; }).length;
                if (duplicateUser) {
                    return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["throwError"])({ error: { message: 'Username "' + newUser_1.username + '" is already taken' } });
                }
                // save new user
                newUser_1.id = users.length + 1;
                users.push(newUser_1);
                localStorage.setItem('users', JSON.stringify(users));
                // respond 200 OK
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpResponse"]({ status: 200 }));
            }
            // delete user
            if (request.url.match(/\/users\/\d+$/) && request.method === 'DELETE') {
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find user by id in users array
                    var urlParts = request.url.split('/');
                    var id = parseInt(urlParts[urlParts.length - 1]);
                    for (var i = 0; i < users.length; i++) {
                        var user = users[i];
                        if (user.id === id) {
                            // delete user
                            users.splice(i, 1);
                            localStorage.setItem('users', JSON.stringify(users));
                            break;
                        }
                    }
                    // respond 200 OK
                    return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpResponse"]({ status: 200 }));
                }
                else {
                    // return 401 not authorised if token is null or invalid
                    return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["throwError"])({ status: 401, error: { message: 'Unauthorised' } });
                }
            }
            // pass through any requests not handled above
            return next.handle(request);
        }))
            // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["materialize"])())
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["delay"])(500))
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["dematerialize"])());
    };
    FakeBackendInterceptor = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], FakeBackendInterceptor);
    return FakeBackendInterceptor;
}());

var fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HTTP_INTERCEPTORS"],
    useClass: FakeBackendInterceptor,
    multi: true
};


/***/ }),

/***/ "./src/app/_helpers/index.ts":
/*!***********************************!*\
  !*** ./src/app/_helpers/index.ts ***!
  \***********************************/
/*! exports provided: ErrorInterceptor, JwtInterceptor, FakeBackendInterceptor, fakeBackendProvider */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _error_interceptor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./error.interceptor */ "./src/app/_helpers/error.interceptor.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ErrorInterceptor", function() { return _error_interceptor__WEBPACK_IMPORTED_MODULE_0__["ErrorInterceptor"]; });

/* harmony import */ var _jwt_interceptor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./jwt.interceptor */ "./src/app/_helpers/jwt.interceptor.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "JwtInterceptor", function() { return _jwt_interceptor__WEBPACK_IMPORTED_MODULE_1__["JwtInterceptor"]; });

/* harmony import */ var _fake_backend__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fake-backend */ "./src/app/_helpers/fake-backend.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FakeBackendInterceptor", function() { return _fake_backend__WEBPACK_IMPORTED_MODULE_2__["FakeBackendInterceptor"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "fakeBackendProvider", function() { return _fake_backend__WEBPACK_IMPORTED_MODULE_2__["fakeBackendProvider"]; });






/***/ }),

/***/ "./src/app/_helpers/jwt.interceptor.ts":
/*!*********************************************!*\
  !*** ./src/app/_helpers/jwt.interceptor.ts ***!
  \*********************************************/
/*! exports provided: JwtInterceptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JwtInterceptor", function() { return JwtInterceptor; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_services */ "./src/app/_services/index.ts");



var JwtInterceptor = /** @class */ (function () {
    function JwtInterceptor(authenticationService) {
        this.authenticationService = authenticationService;
    }
    JwtInterceptor.prototype.intercept = function (request, next) {
        // add authorization header with jwt token if available
        var currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: "Bearer " + currentUser.token
                }
            });
        }
        return next.handle(request);
    };
    JwtInterceptor = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services__WEBPACK_IMPORTED_MODULE_2__["AuthenticationService"]])
    ], JwtInterceptor);
    return JwtInterceptor;
}());



/***/ }),

/***/ "./src/app/_services/alert.service.ts":
/*!********************************************!*\
  !*** ./src/app/_services/alert.service.ts ***!
  \********************************************/
/*! exports provided: AlertService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AlertService", function() { return AlertService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");




var AlertService = /** @class */ (function () {
    function AlertService(router) {
        var _this = this;
        this.router = router;
        this.subject = new rxjs__WEBPACK_IMPORTED_MODULE_3__["Subject"]();
        this.keepAfterNavigationChange = false;
        // clear alert message on route change
        router.events.subscribe(function (event) {
            if (event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_2__["NavigationStart"]) {
                if (_this.keepAfterNavigationChange) {
                    // only keep for a single location change
                    _this.keepAfterNavigationChange = false;
                }
                else {
                    // clear alert
                    _this.subject.next();
                }
            }
        });
    }
    AlertService.prototype.success = function (message, keepAfterNavigationChange) {
        if (keepAfterNavigationChange === void 0) { keepAfterNavigationChange = false; }
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'success', text: message });
    };
    AlertService.prototype.error = function (message, keepAfterNavigationChange) {
        if (keepAfterNavigationChange === void 0) { keepAfterNavigationChange = false; }
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'error', text: message });
    };
    AlertService.prototype.getMessage = function () {
        return this.subject.asObservable();
    };
    AlertService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({ providedIn: 'root' }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], AlertService);
    return AlertService;
}());



/***/ }),

/***/ "./src/app/_services/authentication.service.ts":
/*!*****************************************************!*\
  !*** ./src/app/_services/authentication.service.ts ***!
  \*****************************************************/
/*! exports provided: AuthenticationService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthenticationService", function() { return AuthenticationService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");





var AuthenticationService = /** @class */ (function () {
    function AuthenticationService(http) {
        this.http = http;
        this.currentUserSubject = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"](JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }
    Object.defineProperty(AuthenticationService.prototype, "currentUserValue", {
        get: function () {
            return this.currentUserSubject.value;
        },
        enumerable: true,
        configurable: true
    });
    AuthenticationService.prototype.login = function (username, password) {
        var _this = this;
        return this.http.post("/users/authenticate", { username: username, password: password })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (user) {
            // login successful if there's a jwt token in the response
            if (user && user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                _this.currentUserSubject.next(user);
            }
            return user;
        }));
    };
    AuthenticationService.prototype.logout = function () {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    };
    AuthenticationService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({ providedIn: 'root' }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], AuthenticationService);
    return AuthenticationService;
}());



/***/ }),

/***/ "./src/app/_services/index.ts":
/*!************************************!*\
  !*** ./src/app/_services/index.ts ***!
  \************************************/
/*! exports provided: AlertService, AuthenticationService, UserService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _alert_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./alert.service */ "./src/app/_services/alert.service.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AlertService", function() { return _alert_service__WEBPACK_IMPORTED_MODULE_0__["AlertService"]; });

/* harmony import */ var _authentication_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./authentication.service */ "./src/app/_services/authentication.service.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AuthenticationService", function() { return _authentication_service__WEBPACK_IMPORTED_MODULE_1__["AuthenticationService"]; });

/* harmony import */ var _user_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./user.service */ "./src/app/_services/user.service.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UserService", function() { return _user_service__WEBPACK_IMPORTED_MODULE_2__["UserService"]; });






/***/ }),

/***/ "./src/app/_services/user.service.ts":
/*!*******************************************!*\
  !*** ./src/app/_services/user.service.ts ***!
  \*******************************************/
/*! exports provided: UserService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserService", function() { return UserService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");



var UserService = /** @class */ (function () {
    function UserService(http) {
        this.http = http;
    }
    UserService.prototype.getAll = function () {
        return this.http.get("/users");
    };
    UserService.prototype.getById = function (id) {
        return this.http.get("/users/" + id);
    };
    UserService.prototype.register = function (user) {
        return this.http.post("/users/register", user);
    };
    UserService.prototype.update = function (user) {
        return this.http.put("/users/" + user.id, user);
    };
    UserService.prototype.delete = function (id) {
        return this.http.delete("/users/" + id);
    };
    UserService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({ providedIn: 'root' }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], UserService);
    return UserService;
}());



/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n<!-- nav -->\r\n\r\n<!-- main app container -->\r\n\r\n<alert></alert>\r\n<router-outlet></router-outlet>\r\n"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_services */ "./src/app/_services/index.ts");




var AppComponent = /** @class */ (function () {
    function AppComponent(router, authenticationService, vcRef) {
        var _this = this;
        this.router = router;
        this.authenticationService = authenticationService;
        this.vcRef = vcRef;
        this.title = 'app';
        this.authenticationService.currentUser.subscribe(function (x) { return _this.currentUser = x; });
    }
    AppComponent.prototype.logout = function () {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    };
    AppComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({ selector: 'app', template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html") }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _services__WEBPACK_IMPORTED_MODULE_3__["AuthenticationService"],
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _engine_engine_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./engine/engine.component */ "./src/app/engine/engine.component.ts");
/* harmony import */ var _engine2d_engine2d_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./engine2d/engine2d.component */ "./src/app/engine2d/engine2d.component.ts");
/* harmony import */ var _top_tool_bar_top_tool_bar_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./top-tool-bar/top-tool-bar.component */ "./src/app/top-tool-bar/top-tool-bar.component.ts");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/toolbar */ "./node_modules/@angular/material/esm5/toolbar.es5.js");
/* harmony import */ var _right_side_menu_right_side_menu_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./right-side-menu/right-side-menu.component */ "./src/app/right-side-menu/right-side-menu.component.ts");
/* harmony import */ var _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/cdk/layout */ "./node_modules/@angular/cdk/esm5/layout.es5.js");
/* harmony import */ var ngx_color_picker__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ngx-color-picker */ "./node_modules/ngx-color-picker/dist/ngx-color-picker.es5.js");
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/select */ "./node_modules/@angular/material/esm5/select.es5.js");
/* harmony import */ var _angular_material_slider__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/slider */ "./node_modules/@angular/material/esm5/slider.es5.js");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/input */ "./node_modules/@angular/material/esm5/input.es5.js");
/* harmony import */ var _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/slide-toggle */ "./node_modules/@angular/material/esm5/slide-toggle.es5.js");
/* harmony import */ var _angular_material_radio__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/radio */ "./node_modules/@angular/material/esm5/radio.es5.js");
/* harmony import */ var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/checkbox */ "./node_modules/@angular/material/esm5/checkbox.es5.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _app_routing__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./app.routing */ "./src/app/app.routing.ts");
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./_components */ "./src/app/_components/index.ts");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./_helpers */ "./src/app/_helpers/index.ts");
/* harmony import */ var _home__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./home */ "./src/app/home/index.ts");
/* harmony import */ var _login__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./login */ "./src/app/login/index.ts");
/* harmony import */ var _register__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./register */ "./src/app/register/index.ts");
/* harmony import */ var _angular_cdk_table__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! @angular/cdk/table */ "./node_modules/@angular/cdk/esm5/table.es5.js");
/* harmony import */ var _angular_cdk_tree__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! @angular/cdk/tree */ "./node_modules/@angular/cdk/esm5/tree.es5.js");
/* harmony import */ var _angular_cdk_scrolling__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! @angular/cdk/scrolling */ "./node_modules/@angular/cdk/esm5/scrolling.es5.js");
/* harmony import */ var _angular_cdk_stepper__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! @angular/cdk/stepper */ "./node_modules/@angular/cdk/esm5/stepper.es5.js");
/* harmony import */ var _angular_material_tree__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! @angular/material/tree */ "./node_modules/@angular/material/esm5/tree.es5.js");
/* harmony import */ var _engine2d_side_menu2d_side_menu2d_component__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./engine2d/side-menu2d/side-menu2d.component */ "./src/app/engine2d/side-menu2d/side-menu2d.component.ts");
/* harmony import */ var _angular_material_button_toggle__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! @angular/material/button-toggle */ "./node_modules/@angular/material/esm5/button-toggle.es5.js");
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! @angular/material/card */ "./node_modules/@angular/material/esm5/card.es5.js");




































var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"],
                _engine2d_engine2d_component__WEBPACK_IMPORTED_MODULE_5__["Engine2DComponent"],
                _engine_engine_component__WEBPACK_IMPORTED_MODULE_4__["EngineComponent"],
                _top_tool_bar_top_tool_bar_component__WEBPACK_IMPORTED_MODULE_6__["TopToolBarComponent"],
                _right_side_menu_right_side_menu_component__WEBPACK_IMPORTED_MODULE_10__["RightSideMenuComponent"],
                _components__WEBPACK_IMPORTED_MODULE_22__["AlertComponent"],
                _home__WEBPACK_IMPORTED_MODULE_24__["HomeComponent"],
                _login__WEBPACK_IMPORTED_MODULE_25__["LoginComponent"],
                _register__WEBPACK_IMPORTED_MODULE_26__["RegisterComponent"],
                _engine2d_side_menu2d_side_menu2d_component__WEBPACK_IMPORTED_MODULE_32__["SideMenu2dComponent"]
            ],
            imports: [
                _angular_material_card__WEBPACK_IMPORTED_MODULE_34__["MatCardModule"],
                _angular_material_button_toggle__WEBPACK_IMPORTED_MODULE_33__["MatButtonToggleModule"],
                _angular_material_tree__WEBPACK_IMPORTED_MODULE_31__["MatTreeModule"],
                _angular_cdk_scrolling__WEBPACK_IMPORTED_MODULE_29__["ScrollingModule"],
                _angular_cdk_stepper__WEBPACK_IMPORTED_MODULE_30__["CdkStepperModule"],
                _angular_cdk_table__WEBPACK_IMPORTED_MODULE_27__["CdkTableModule"],
                _angular_cdk_tree__WEBPACK_IMPORTED_MODULE_28__["CdkTreeModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_19__["FormsModule"],
                _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_18__["MatCheckboxModule"],
                _angular_material_radio__WEBPACK_IMPORTED_MODULE_17__["MatRadioModule"],
                _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_16__["MatSlideToggleModule"],
                _angular_material_input__WEBPACK_IMPORTED_MODULE_15__["MatInputModule"],
                _angular_material_slider__WEBPACK_IMPORTED_MODULE_14__["MatSliderModule"],
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["BrowserModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_7__["MatMenuModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_7__["MatButtonModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_7__["MatIconModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_8__["BrowserAnimationsModule"],
                _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_9__["MatToolbarModule"],
                _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_11__["LayoutModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_7__["MatSidenavModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_7__["MatListModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_7__["MatTabsModule"],
                ngx_color_picker__WEBPACK_IMPORTED_MODULE_12__["ColorPickerModule"],
                _angular_material_select__WEBPACK_IMPORTED_MODULE_13__["MatSelectModule"],
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["BrowserModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_19__["ReactiveFormsModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_20__["HttpClientModule"],
                _app_routing__WEBPACK_IMPORTED_MODULE_21__["routing"]
            ],
            providers: [
                { provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_20__["HTTP_INTERCEPTORS"], useClass: _helpers__WEBPACK_IMPORTED_MODULE_23__["JwtInterceptor"], multi: true },
                { provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_20__["HTTP_INTERCEPTORS"], useClass: _helpers__WEBPACK_IMPORTED_MODULE_23__["ErrorInterceptor"], multi: true },
                { provide: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["HAMMER_GESTURE_CONFIG"], useClass: _angular_material__WEBPACK_IMPORTED_MODULE_7__["GestureConfig"] },
            ],
            bootstrap: [
                _app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]
            ]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/app.routing.ts":
/*!********************************!*\
  !*** ./src/app/app.routing.ts ***!
  \********************************/
/*! exports provided: routing */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "routing", function() { return routing; });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _login__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./login */ "./src/app/login/index.ts");
/* harmony import */ var _register__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./register */ "./src/app/register/index.ts");
/* harmony import */ var _guards__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_guards */ "./src/app/_guards/index.ts");
/* harmony import */ var _engine__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./engine */ "./src/app/engine/index.ts");
/* harmony import */ var _engine2d_engine2d_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./engine2d/engine2d.component */ "./src/app/engine2d/engine2d.component.ts");






var appRoutes = [
    { path: '', component: _engine__WEBPACK_IMPORTED_MODULE_4__["EngineComponent"], canActivate: [_guards__WEBPACK_IMPORTED_MODULE_3__["AuthGuard"]] },
    { path: 'login', component: _login__WEBPACK_IMPORTED_MODULE_1__["LoginComponent"] },
    { path: 'register', component: _register__WEBPACK_IMPORTED_MODULE_2__["RegisterComponent"] },
    { path: 'engine2d', component: _engine2d_engine2d_component__WEBPACK_IMPORTED_MODULE_5__["Engine2DComponent"] },
    // otherwise redirect to home
    { path: '**', redirectTo: 'login' }
];
var routing = _angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forRoot(appRoutes);


/***/ }),

/***/ "./src/app/engine/engine.component.css":
/*!*********************************************!*\
  !*** ./src/app/engine/engine.component.css ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".engine-wrapper {\r\n    top: 64px;\r\n    position: absolute;\r\n}\r\n\r\n#renderCanvas {\r\n    left: 300px;\r\n    position: absolute;\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvZW5naW5lL2VuZ2luZS5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksU0FBUztJQUNULGtCQUFrQjtBQUN0Qjs7QUFFQTtJQUNJLFdBQVc7SUFDWCxrQkFBa0I7QUFDdEIiLCJmaWxlIjoic3JjL2FwcC9lbmdpbmUvZW5naW5lLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuZW5naW5lLXdyYXBwZXIge1xyXG4gICAgdG9wOiA2NHB4O1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG59XHJcblxyXG4jcmVuZGVyQ2FudmFzIHtcclxuICAgIGxlZnQ6IDMwMHB4O1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG59Il19 */"

/***/ }),

/***/ "./src/app/engine/engine.component.html":
/*!**********************************************!*\
  !*** ./src/app/engine/engine.component.html ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<nav>\r\n<app-top-tool-bar></app-top-tool-bar>\r\n</nav>\r\n<div class=\"engine-wrapper\">\r\n  <canvas id=\"renderCanvas\"></canvas>\r\n</div>\r\n<nav>\r\n    <app-right-side-menu></app-right-side-menu>\r\n</nav>\r\n"

/***/ }),

/***/ "./src/app/engine/engine.component.ts":
/*!********************************************!*\
  !*** ./src/app/engine/engine.component.ts ***!
  \********************************************/
/*! exports provided: EngineComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EngineComponent", function() { return EngineComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _engine_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./engine.service */ "./src/app/engine/engine.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");



var EngineComponent = /** @class */ (function () {
    function EngineComponent(engServ, elementRef) {
        this.engServ = engServ;
        this.elementRef = elementRef;
        this.canEleId = 'renderCanvas';
    }
    EngineComponent.prototype.ngOnInit = function () {
        this.engServ.createScene(this.canEleId, this.elementRef.nativeElement);
        this.engServ.animate();
    };
    EngineComponent.prototype.getEngineService = function () {
        return (this.engServ);
    };
    EngineComponent.prototype.ngOnDestroy = function () {
        // removes added event listeners
        document.removeEventListener("keydown", this.engServ.onKeyDown);
        document.removeEventListener("keyup", this.engServ.onKeyUp);
        document.removeEventListener("DOMContentLoaded", this.engServ.onDOMContentLoaded);
        document.removeEventListener("resize", this.engServ.resize);
    };
    EngineComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'app-engine',
            template: __webpack_require__(/*! ./engine.component.html */ "./src/app/engine/engine.component.html"),
            styles: [__webpack_require__(/*! ./engine.component.css */ "./src/app/engine/engine.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_engine_service__WEBPACK_IMPORTED_MODULE_1__["EngineService"], _angular_core__WEBPACK_IMPORTED_MODULE_2__["ElementRef"]])
    ], EngineComponent);
    return EngineComponent;
}());



/***/ }),

/***/ "./src/app/engine/engine.service.ts":
/*!******************************************!*\
  !*** ./src/app/engine/engine.service.ts ***!
  \******************************************/
/*! exports provided: EngineService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EngineService", function() { return EngineService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var three_full__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three-full */ "./node_modules/three-full/builds/Three.es.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");



var EngineService = /** @class */ (function () {
    function EngineService() {
        var _this = this;
        this.controls = { orbit: null, transformControl: null };
        this.mouse = new three_full__WEBPACK_IMPORTED_MODULE_1__["Vector2"]();
        this.onDownPosition = new three_full__WEBPACK_IMPORTED_MODULE_1__["Vector2"]();
        this.onUpPosition = new three_full__WEBPACK_IMPORTED_MODULE_1__["Vector2"]();
        this.contW = window.innerWidth - 300;
        this.contH = window.innerHeight - 64;
        this.raycaster = new three_full__WEBPACK_IMPORTED_MODULE_1__["Raycaster"]();
        this.selected = null;
        this.materials = {};
        this.geometries = {};
        this.textures = {};
        this.models = {};
        this.objects = [];
        this.helpers = {};
        this.selectionBox = new three_full__WEBPACK_IMPORTED_MODULE_1__["BoxHelper"]();
        this.box = new three_full__WEBPACK_IMPORTED_MODULE_1__["Box3"]();
        // sets default camera
        this.DEFAULT_CAMERA1 = new three_full__WEBPACK_IMPORTED_MODULE_1__["PerspectiveCamera"](50, this.contW / this.contH, 1, 3000);
        this.DEFAULT_BACKGROUND_COLOR = 0xcccccc;
        this.DEFAULT_BACKGROUND_COLOR2 = 0x000000;
        // -----------------------------------
        // Event listeners
        // -----------------------------------
        this.onDocumentMouseMove = function (event) {
            event.preventDefault();
            // gets bounding box parameters of canvas
            // this.canvas = <HTMLCanvasElement>document.getElementById('renderCanvas');
            var rect = _this.canvas.getBoundingClientRect();
            // computes normalized mouse positions
            _this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            _this.mouse.y = (-(event.clientY - rect.top) / rect.height) * 2 + 1;
        };
        this.onDocumentMouseDown = function (event) {
            // https://github.com/mrdoob/three.js/blob/master/editor/js/Viewport.js
            event.preventDefault();
            // gets mouse down position
            _this.onDownPosition.x = _this.mouse.x;
            _this.onDownPosition.y = _this.mouse.y;
            // adds event listener for mousedown
            _this.canvas.addEventListener('mouseup', _this.onMouseUp, false);
        };
        this.onMouseUp = function (event) {
            // https://stackoverflow.com/questions/33142079/three-js-transformcontrols
            // https://github.com/mrdoob/three.js/blob/master/editor/js/Viewport.js
            event.preventDefault();
            // gets mouse up position
            _this.onUpPosition.x = _this.mouse.x;
            _this.onUpPosition.y = _this.mouse.y;
            // selects object iff mouse down position = downposition
            if (_this.onDownPosition.distanceTo(_this.onUpPosition) === 0) {
                var intersects = _this.getIntersects(_this.objects);
                // an object is selected
                if (intersects.length > 0) {
                    // Updates transform controls if object selected is Mesh
                    var object = intersects[0].object;
                    if (object.userData.object !== undefined) {
                        // selects helper
                        _this.select(object.userData.object);
                    }
                    else {
                        // selects object
                        _this.select(object);
                    }
                }
                else {
                    // deselect
                    _this.select(null);
                }
                _this.renderUpdate();
            }
            // removes event listener for mouseup
            _this.canvas.removeEventListener('mouseup', _this.onMouseUp, false);
        };
        // returns function for adding helper to an object
        // https://github.com/mrdoob/three.js/blob/master/editor/js/Editor.js
        this.addHelper = ((function () {
            var geometry = new three_full__WEBPACK_IMPORTED_MODULE_1__["SphereBufferGeometry"](4, 4, 2);
            var material = new three_full__WEBPACK_IMPORTED_MODULE_1__["MeshBasicMaterial"]({ color: 0xff0000, visible: false });
            return function (object) {
                var helper;
                if (object.isCamera) {
                    helper = new three_full__WEBPACK_IMPORTED_MODULE_1__["CameraHelper"](object, 1);
                }
                else if (object.isPointLight) {
                    helper = new three_full__WEBPACK_IMPORTED_MODULE_1__["PointLightHelper"](object, 1);
                }
                else if (object.isDirectionalLight) {
                    helper = new three_full__WEBPACK_IMPORTED_MODULE_1__["DirectionalLightHelper"](object, 1);
                }
                else if (object.isSpotLight) {
                    helper = new three_full__WEBPACK_IMPORTED_MODULE_1__["SpotLightHelper"](object, 1);
                }
                else if (object.isHemisphereLight) {
                    helper = new three_full__WEBPACK_IMPORTED_MODULE_1__["HemisphereLightHelper"](object, 1);
                }
                else if (object.isSkinnedMesh) {
                    helper = new three_full__WEBPACK_IMPORTED_MODULE_1__["SkeletonHelper"](object);
                }
                else {
                    // no helper for this object type
                    return;
                }
                // adds picker box
                var picker = new three_full__WEBPACK_IMPORTED_MODULE_1__["Mesh"](geometry, material);
                picker.name = 'picker';
                picker.userData.object = object;
                helper.add(picker);
                _this.scene.add(helper);
                _this.helpers[object.id] = helper;
                _this.objects.push(helper.getObjectByName('picker'));
            };
        })());
        // removes helper given object
        // https://github.com/mrdoob/three.js/blob/master/editor/js/Editor.js
        this.removeHelper = function (object) {
            if (_this.helpers[object.id] !== undefined) {
                var helper = _this.helpers[object.id];
                var parent_1 = (helper.parent == null) ? _this.scene : helper.parent;
                parent_1.remove(helper);
                // removes picker
                delete _this.helpers[object.id];
                _this.objects.splice(_this.objects.indexOf(helper.getObjectByName('picker')), 1);
            }
        };
        // adds fog to scene
        this.addFog = function (color, near, far) {
            _this.scene.fog = new three_full__WEBPACK_IMPORTED_MODULE_1__["Fog"](new three_full__WEBPACK_IMPORTED_MODULE_1__["Color"](color), near, far);
        };
        // removes fog from scene
        this.removeFog = function () {
            _this.scene.fog = null;
        };
        // adds FogExp2 to scene
        this.addFogExp2 = function (color, density) {
            _this.scene.fog = new three_full__WEBPACK_IMPORTED_MODULE_1__["FogExp2"](new three_full__WEBPACK_IMPORTED_MODULE_1__["Color"](color), density);
        };
        // dom content loaded event handler
        this.onDOMContentLoaded = function (event) {
            event.preventDefault();
            _this.render();
        };
        // key up event handler
        this.onKeyUp = function (event) {
            event.preventDefault();
            switch (event.keyCode) {
                case 17: // Ctrl key up
                    // disables translation / rotation snap
                    _this.controls.transformControl.setTranslationSnap(null);
                    _this.controls.transformControl.setRotationSnap(null);
                    break;
            }
        };
        // key down event handler
        this.onKeyDown = function (event) {
            event.preventDefault();
            switch (event.keyCode) {
                case 81: // Q
                    _this.controls.transformControl.setSpace(_this.controls.transformControl.space === "local" ? "world" : "local");
                    break;
                case 17: // Ctrl
                    // enables translation / rotational snap
                    _this.controls.transformControl.setTranslationSnap(100);
                    _this.controls.transformControl.setRotationSnap(three_full__WEBPACK_IMPORTED_MODULE_1__["_Math"].degToRad(15));
                    break;
                case 87: // W
                    _this.controls.transformControl.setMode("translate");
                    break;
                case 69: // E
                    _this.controls.transformControl.setMode("rotate");
                    break;
                case 82: // R
                    _this.controls.transformControl.setMode("scale");
                    break;
                case 187:
                case 107: // +, =, num+
                    _this.controls.transformControl.setSize(_this.controls.transformControl.size + 0.1);
                    break;
                case 189:
                case 109: // -, _, num-
                    _this.controls.transformControl.setSize(Math.max(_this.controls.transformControl.size - 0.1, 0.1));
                    break;
                case 88: // X
                    _this.controls.transformControl.showX = !_this.controls.transformControl.showX;
                    break;
                case 89: // Y
                    _this.controls.transformControl.showY = !_this.controls.transformControl.showY;
                    break;
                case 90: // Z
                    _this.controls.transformControl.showZ = !_this.controls.transformControl.showZ;
                    break;
                case 32: // Spacebar
                    _this.controls.transformControl.enabled = !_this.controls.transformControl.enabled;
                    break;
                case 46: // Del
                    if (_this.selected) {
                        _this.selectionBox.visible = false;
                        _this.removeObject(_this.selected);
                    }
                    break;
            }
        };
        // updates rendering
        this.renderUpdate = function () {
            _this.scene.updateMatrixWorld();
            _this.renderer.render(_this.scene, _this.camera);
        };
        // resizes window
        this.resize = function (event) {
            event.preventDefault();
            _this.contW = window.innerWidth - 300;
            _this.contH = window.innerHeight - 64;
            _this.camera.aspect = _this.contW / _this.contH;
            _this.camera.updateProjectionMatrix();
            _this.renderer.setSize(_this.contW, _this.contH);
            _this.renderUpdate();
        };
        this.saveFile = function (strData, filename) {
            var link = document.createElement('a');
            if (typeof link.download === 'string') {
                document.body.appendChild(link); //Firefox requires the link to be in the body
                link.download = filename;
                link.href = strData;
                link.click();
                document.body.removeChild(link); //remove the link when done
            }
        };
        // https://stackoverflow.com/questions/20693405/user-uploaded-textures-in-three-js
        // Uploads image and inserts image
        this.insertImage = function () {
            var _this = this;
            // creates form for upload
            var link = document.createElement('input');
            link.type = "file";
            // adds event listener to upload form
            link.addEventListener('change', function () {
                // sets image upload element and texture
                var image = document.createElement('img');
                var texture = new three_full__WEBPACK_IMPORTED_MODULE_1__["Texture"](image);
                texture.anisotropy = _this.renderer.capabilities.getMaxAnisotropy();
                image.onload = function () {
                    texture.needsUpdate = true;
                };
                // uploads image and assigns to image
                if (link.files && link.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        image.src = e.target.result;
                    };
                    reader.readAsDataURL(link.files[0]);
                    // removes upload form
                    document.body.removeChild(link);
                }
                else {
                    return;
                }
                // prepares and adds image mesh to scene
                var geometry = new three_full__WEBPACK_IMPORTED_MODULE_1__["PlaneGeometry"](100, 100 * 0.75);
                var material = new three_full__WEBPACK_IMPORTED_MODULE_1__["MeshLambertMaterial"]({
                    color: "white",
                    map: texture,
                    side: three_full__WEBPACK_IMPORTED_MODULE_1__["DoubleSide"]
                });
                var mesh = new three_full__WEBPACK_IMPORTED_MODULE_1__["Mesh"](geometry, material);
                mesh.position.set(1, 1, 1);
                _this.addObject(mesh);
            });
            document.body.appendChild(link);
            link.click();
        };
        // getters and setters
        this.getBackgroundColor = function () {
            if (!_this.scene)
                return null;
            return _this.scene.background.getHexString();
        };
        this.setBackgroundColor = function (color) {
            _this.scene.background = new three_full__WEBPACK_IMPORTED_MODULE_1__["Color"](color);
        };
        this.getFog = function () {
            if (!_this.scene)
                return null;
            return (_this.scene.fog);
        };
        this.getSelected = function () {
            return (_this.selected);
        };
        this.getObjects = function () {
            return (_this.objects);
        };
    }
    EngineService.prototype.createScene = function (elementId, nativeElement) {
        this.nativeElement = nativeElement;
        this.DEFAULT_CAMERA1.name = 'Camera';
        this.DEFAULT_CAMERA1.position.set(0, 0, 3000);
        this.DEFAULT_CAMERA1.lookAt(0, 0, 0);
        // The first step is to get the reference of the canvas element from our HTML document
        this.canvas = document.getElementById(elementId);
        // this.contW = this.canvas.clientWidt;
        this.contW = window.innerWidth - 300;
        this.contH = window.innerHeight - 64;
        this.renderer = new three_full__WEBPACK_IMPORTED_MODULE_1__["WebGLRenderer"]({
            canvas: this.canvas,
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: true // allows taking screenshots
        });
        this.renderer.setSize(this.contW, this.contH);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        // create the scene
        this.scene = new three_full__WEBPACK_IMPORTED_MODULE_1__["Scene"]();
        // Camera
        this.camera = new three_full__WEBPACK_IMPORTED_MODULE_1__["PerspectiveCamera"](50, this.contW / this.contH, 1, 3000);
        this.camera.position.set(0, 1000, 300);
        this.camera.lookAt(0, 0, 0);
        // Grid Helper
        var gridHelper = new three_full__WEBPACK_IMPORTED_MODULE_1__["GridHelper"](1000, 10);
        this.scene.add(gridHelper);
        this.objects.push(gridHelper);
        // soft white light
        this.scene.background = new three_full__WEBPACK_IMPORTED_MODULE_1__["Color"](this.DEFAULT_BACKGROUND_COLOR);
        // Ligthing
        var light = new three_full__WEBPACK_IMPORTED_MODULE_1__["PointLight"](0xFFFFFF, 1, 1000000);
        // Specify the light's position
        light.position.set(1, 1, 100);
        this.addObject(light);
        light = new three_full__WEBPACK_IMPORTED_MODULE_1__["PointLight"](0xFFFFFF, 1, 1000000);
        // // Specify the light's position
        light.position.set(1, 1, -100);
        this.addObject(light);
        var loader = new three_full__WEBPACK_IMPORTED_MODULE_1__["TextureLoader"]();
        // create a plane geometry for the image with a width of 10
        // and a height that preserves the image's aspect ratio
        // var geometry = new THREE.BoxBufferGeometry( 10, 7.5, 1 );
        var geometry = new three_full__WEBPACK_IMPORTED_MODULE_1__["PlaneGeometry"](100, 100 * 0.75);
        var texture = new three_full__WEBPACK_IMPORTED_MODULE_1__["TextureLoader"]().load('./assets/img/test.jpg', this.renderUpdate);
        this.textures[texture.uuid] = texture;
        texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        // Load an image file into a custom material
        var material = new three_full__WEBPACK_IMPORTED_MODULE_1__["MeshLambertMaterial"]({
            color: "white",
            map: texture,
            side: three_full__WEBPACK_IMPORTED_MODULE_1__["DoubleSide"]
        });
        var material2 = new three_full__WEBPACK_IMPORTED_MODULE_1__["MeshLambertMaterial"]({
            color: "white",
            map: texture,
            side: three_full__WEBPACK_IMPORTED_MODULE_1__["DoubleSide"]
        });
        // Controls
        // orbit
        this.controls.orbit = new three_full__WEBPACK_IMPORTED_MODULE_1__["OrbitControls"](this.camera, this.renderer.domElement);
        this.controls.orbit.update();
        // transform controls
        this.controls.transformControl = new three_full__WEBPACK_IMPORTED_MODULE_1__["TransformControls"](this.camera, this.renderer.domElement);
        // combines our image geometry and material into a mesh
        var mesh = new three_full__WEBPACK_IMPORTED_MODULE_1__["Mesh"](geometry, material);
        var mesh2 = new three_full__WEBPACK_IMPORTED_MODULE_1__["Mesh"](geometry, material2);
        // set the position of the image mesh in the x,y,z dimensions
        mesh.position.set(1, 1, 1);
        mesh2.position.set(100, 100, 100);
        this.objects.push(this.controls.transformControl);
        // add the image to the scene
        this.addObject(mesh);
        this.addObject(mesh2);
        this.scene.add(this.controls.transformControl);
        this.addSelectionBox();
    };
    // gets objects intersecting with mouse position
    EngineService.prototype.getIntersects = function (objs) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        return this.raycaster.intersectObjects(objs);
    };
    // removes mesh given mesh
    // https://stackoverflow.com/questions/40694372/what-is-the-right-way-to-remove-a-mesh-completely-from-the-scene-in-three-js?rq=1
    EngineService.prototype.removeMesh = function (mesh) {
        this.scene.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
        mesh = null;
        this.renderUpdate();
    };
    // selects an object
    // https://github.com/mrdoob/three.js/blob/master/editor/js/Editor.js
    EngineService.prototype.select = function (object) {
        // returns if object is already selected
        if (this.selected === object)
            return;
        this.selectionBox.visible = false;
        this.controls.transformControl.detach();
        // prevents selection of camera or scene
        if (object !== null && object !== this.scene && object !== this.camera) {
            this.box.setFromObject(object);
            // sets selection box if box is not empty
            if (this.box.isEmpty() === false) {
                this.selectionBox.setFromObject(object);
                this.selectionBox.visible = true;
            }
            // sets selected object and attaches transform controls
            this.selected = object;
            this.controls.transformControl.attach(object);
        }
        else {
            this.selected = null;
        }
        this.renderUpdate();
    };
    // -----------------------------------
    // Updates
    // -----------------------------------
    // sets scene given scene 1
    // https://github.com/mrdoob/three.js/blob/master/editor/js/Editor.js
    EngineService.prototype.setScene = function (scene1) {
        var _this = this;
        // sets scene uuid and name
        this.scene.uuid = scene1.uuid;
        this.scene.name = scene1.name;
        // deselects objects
        this.select(null);
        // sets scene background and fog if they exist
        if (scene1.background !== null)
            this.scene.background = scene1.background.clone();
        if (scene1.fog !== null)
            this.scene.fog = scene1.fog.clone();
        // sets scene user data
        this.scene.userData = JSON.parse(JSON.stringify(scene1.userData));
        // adds objects to new scene
        var object_list = [];
        scene1.children.forEach(function (ele) {
            object_list.push(ele);
        });
        object_list.forEach(function (ele) {
            if (_this.isNotSceneHelper(ele))
                _this.addObject(ele);
        });
        this.renderUpdate();
    };
    ;
    // Returns True iff object is not a scene helper or controls
    EngineService.prototype.isNotSceneHelper = function (ele) {
        // checks object is not a scene helper
        if (!(ele instanceof three_full__WEBPACK_IMPORTED_MODULE_1__["TransformControls"]) && !(ele instanceof three_full__WEBPACK_IMPORTED_MODULE_1__["GridHelper"]) &&
            !(ele instanceof three_full__WEBPACK_IMPORTED_MODULE_1__["BoxHelper"]) && !(ele instanceof three_full__WEBPACK_IMPORTED_MODULE_1__["Box3"]) && !(ele instanceof three_full__WEBPACK_IMPORTED_MODULE_1__["Object3D"])
            && !(ele instanceof three_full__WEBPACK_IMPORTED_MODULE_1__["LineSegments"]) || (ele.isMesh || ele.isLight)) {
            // checks object is not a helper with a picker
            if (!(ele.isMesh && ele.children.length > 0 && ele.children[0].name == 'picker')) {
                return true;
            }
        }
        return false;
    };
    // adds object given object obj
    // https://github.com/mrdoob/three.js/blob/master/editor/js/Editor.js
    EngineService.prototype.addObject = function (obj) {
        var _this = this;
        obj.traverse(function (child) {
            // adds geometries and materials of object
            if (child.geometry !== undefined)
                _this.addGeometry(child.geometry);
            if (child.material !== undefined)
                _this.addMaterial(child.material);
            _this.addHelper(child);
        });
        // adds children of object
        this.scene.add(obj);
        obj.traverse(function (child) {
            _this.objects.push(child);
        });
        this.renderUpdate();
    };
    ;
    // adds selection box
    EngineService.prototype.addSelectionBox = function () {
        this.selectionBox.material.depthTest = false;
        this.selectionBox.material.transparent = true;
        this.selectionBox.visible = false;
        this.scene.add(this.selectionBox);
    };
    ;
    // Generates particles given path, range, and particle size
    // https://github.com/mrdoob/three.js/blob/master/examples/webgl_points_sprites.html
    EngineService.prototype.addParticles = function (sprite_path, range, particle_size) {
        var vertices = [];
        var textureLoader = new three_full__WEBPACK_IMPORTED_MODULE_1__["TextureLoader"]();
        var sprite1 = textureLoader.load(sprite_path);
        for (var i = 0; i < 100000; i++) {
            var x = Math.random() * range * 2 - range;
            var y = Math.random() * range * 2 - range;
            var z = Math.random() * range * 2 - range;
            vertices.push(new three_full__WEBPACK_IMPORTED_MODULE_1__["Vector3"](x, y, z));
        }
        var geometry1 = new three_full__WEBPACK_IMPORTED_MODULE_1__["BufferGeometry"]().setFromPoints(vertices);
        geometry1.setDrawRange(0, range);
        var points = new three_full__WEBPACK_IMPORTED_MODULE_1__["Points"](geometry1, new three_full__WEBPACK_IMPORTED_MODULE_1__["PointsMaterial"]({
            size: particle_size,
            map: sprite1,
            transparent: false,
            color: "yellow"
        }));
        points.rotation.x = Math.random() * 6;
        points.rotation.y = Math.random() * 6;
        points.rotation.z = Math.random() * 6;
        this.scene.add(points);
        this.objects.push(points);
    };
    // removes object given object obj
    // https://github.com/mrdoob/three.js/blob/master/editor/js/Editor.js
    EngineService.prototype.removeObject = function (obj) {
        var _this = this;
        // removes helper of object
        obj.traverse(function (child) {
            _this.removeHelper(child);
        });
        // removes object from scene
        var parent = (obj.parent == null) ? this.scene : obj.parent;
        parent.remove(obj);
        // detaches control
        if (this.selected == this.controls.transformControl.object) {
            this.selected = null;
            this.controls.transformControl.detach();
        }
        // removes object and its children
        obj.traverse(function (child) {
            _this.objects.splice(_this.objects.indexOf(child), 1);
        });
        this.renderUpdate();
    };
    EngineService.prototype.isLight = function (obj) {
        return (obj instanceof three_full__WEBPACK_IMPORTED_MODULE_1__["Light"]);
    };
    // clears editor
    // https://github.com/mrdoob/three.js/blob/master/editor/js/Editor.js
    EngineService.prototype.clear = function () {
        // sets camera to deafult camera and clears fog
        this.camera.copy(this.DEFAULT_CAMERA1);
        this.scene.background = new three_full__WEBPACK_IMPORTED_MODULE_1__["Color"](this.DEFAULT_BACKGROUND_COLOR);
        this.scene.fog = null;
        // clears selection
        this.select(null);
        var objs = this.scene.children;
        // removes objects in scene except for transform control
        while (objs.length > 0) {
            this.removeObject(objs[0]);
        }
        // clears editor
        this.geometries = {};
        this.materials = {};
        this.textures = {};
        this.objects = [];
        // adds transform Controls
        this.scene.add(this.controls.transformControl);
        this.objects.push(this.controls.transformControl);
        // adds gridHelper
        var gridHelper = new three_full__WEBPACK_IMPORTED_MODULE_1__["GridHelper"](1000, 10);
        this.scene.add(gridHelper);
        this.objects.push(gridHelper);
        this.addSelectionBox();
        // sets camera
        this.camera.position.set(0, 1000, 300);
        this.camera.lookAt(0, 0, 0);
        this.renderUpdate();
    };
    // adds geometry given geometry geom
    // https://github.com/mrdoob/three.js/blob/master/editor/js/Editor.js
    EngineService.prototype.addGeometry = function (geom) {
        // adds geometry
        this.geometries[geom.uuid] = geom;
    };
    // adds material given material material1
    // https://github.com/mrdoob/three.js/blob/master/editor/js/Editor.js
    EngineService.prototype.addMaterial = function (material1) {
        this.materials[material1.uuid] = material1;
    };
    // json
    // https://github.com/mrdoob/three.js/blob/master/editor/js/Editor.js
    // loads from json
    // Note: scene is not cleared
    EngineService.prototype.fromJSON = function (json) {
        var loader = new three_full__WEBPACK_IMPORTED_MODULE_1__["ObjectLoader"]();
        // backwards; json is scene
        if (json.scene === undefined) {
            this.setScene(loader.parse(json));
            return;
        }
        // sets camera
        this.camera = this.camera.copy(loader.parse(json.camera));
        this.camera.aspect = this.DEFAULT_CAMERA1.aspect;
        this.camera.updateProjectionMatrix();
        // sets scene
        this.setScene(loader.parse(json.scene));
    };
    // converts to json
    EngineService.prototype.toJSON = function () {
        return {
            metadata: {},
            camera: this.camera.toJSON(),
            scene: this.scene.toJSON(),
        };
    };
    // initializes periodic rendering and adds event listeners
    EngineService.prototype.animate = function () {
        var _this = this;
        window.addEventListener('DOMContentLoaded', this.onDOMContentLoaded);
        window.addEventListener('resize', this.resize);
        // adds events for controls
        this.controls.orbit.addEventListener('change', this.renderUpdate);
        this.controls.transformControl.addEventListener('change', function () {
            // updates helper of object if helper is defined
            var object = _this.controls.transformControl.object;
            if (object !== undefined) {
                _this.selectionBox.setFromObject(object);
                if (_this.helpers[object.id] !== undefined) {
                    _this.helpers[object.id].update();
                }
            }
            _this.renderUpdate();
        });
        this.controls.transformControl.addEventListener('dragging-changed', function (event) {
            _this.controls.orbit.enabled = !event.value;
        });
        // // adds event listeners
        this.canvas.addEventListener('mousemove', this.onDocumentMouseMove, false);
        this.canvas.addEventListener('mousedown', this.onDocumentMouseDown, false);
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
    };
    // render function
    EngineService.prototype.render = function () {
        var _this = this;
        var time = Date.now() * 0.00005;
        requestAnimationFrame(function () {
            _this.render();
        });
        this.renderUpdate();
    };
    // https://stackoverflow.com/questions/26193702/three-js-how-can-i-make-a-2d-snapshot-of-a-scene-as-a-jpg-image
    // saves screenshot
    EngineService.prototype.saveAsImage = function () {
        var imgData, imgNode;
        var strDownloadMime = "image/octet-stream";
        try {
            var strMime = "image/jpeg";
            imgData = this.renderer.domElement.toDataURL(strMime);
            this.saveFile(imgData.replace(strMime, strDownloadMime), "test.jpg");
        }
        catch (e) {
            console.log(e);
            return;
        }
    };
    // Updates selectionbox and helpers of selected object
    EngineService.prototype.updateSelection = function () {
        var object = this.controls.transformControl.object;
        if (object !== undefined) {
            this.selectionBox.setFromObject(object);
            if (this.helpers[object.id] !== undefined) {
                this.helpers[object.id].update();
            }
        }
        this.renderUpdate();
    };
    EngineService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Injectable"])({
            providedIn: 'root'
        })
    ], EngineService);
    return EngineService;
}());



/***/ }),

/***/ "./src/app/engine/index.ts":
/*!*********************************!*\
  !*** ./src/app/engine/index.ts ***!
  \*********************************/
/*! exports provided: EngineComponent, EngineService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _engine_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./engine.component */ "./src/app/engine/engine.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "EngineComponent", function() { return _engine_component__WEBPACK_IMPORTED_MODULE_0__["EngineComponent"]; });

/* harmony import */ var _engine_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./engine.service */ "./src/app/engine/engine.service.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "EngineService", function() { return _engine_service__WEBPACK_IMPORTED_MODULE_1__["EngineService"]; });





/***/ }),

/***/ "./src/app/engine2d/engine2d.component.css":
/*!*************************************************!*\
  !*** ./src/app/engine2d/engine2d.component.css ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#svg {\r\n  background-color: white;\r\n  width: 100vw;\r\n  height: 100vh;\r\n  left: 300px;\r\n  position: absolute;\r\n}\r\n\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvZW5naW5lMmQvZW5naW5lMmQuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLHVCQUF1QjtFQUN2QixZQUFZO0VBQ1osYUFBYTtFQUNiLFdBQVc7RUFDWCxrQkFBa0I7QUFDcEIiLCJmaWxlIjoic3JjL2FwcC9lbmdpbmUyZC9lbmdpbmUyZC5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiI3N2ZyB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XHJcbiAgd2lkdGg6IDEwMHZ3O1xyXG4gIGhlaWdodDogMTAwdmg7XHJcbiAgbGVmdDogMzAwcHg7XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG59XHJcbiJdfQ== */"

/***/ }),

/***/ "./src/app/engine2d/engine2d.component.html":
/*!**************************************************!*\
  !*** ./src/app/engine2d/engine2d.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!-- <app-side-menu2d></app-side-menu2d> -->\r\n<svg id=\"svg\"></svg>\r\n<nav>\r\n    <app-side-menu2d></app-side-menu2d>\r\n</nav>\r\n"

/***/ }),

/***/ "./src/app/engine2d/engine2d.component.ts":
/*!************************************************!*\
  !*** ./src/app/engine2d/engine2d.component.ts ***!
  \************************************************/
/*! exports provided: Engine2DComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Engine2DComponent", function() { return Engine2DComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _engine2d_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./engine2d.service */ "./src/app/engine2d/engine2d.service.ts");



var Engine2DComponent = /** @class */ (function () {
    function Engine2DComponent(engServ, elementRef) {
        this.engServ = engServ;
        this.elementRef = elementRef;
    }
    Engine2DComponent.prototype.ngOnInit = function () {
        this.engServ.createSvg();
    };
    Engine2DComponent.prototype.getEngineService = function () {
        return this.engServ;
    };
    Engine2DComponent.prototype.ngOnDestroy = function () {
        // removes added event listeners
        document.removeEventListener("keydown", this.engServ.onKeyDown);
    };
    Engine2DComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-engine',
            template: __webpack_require__(/*! ./engine2d.component.html */ "./src/app/engine2d/engine2d.component.html"),
            styles: [__webpack_require__(/*! ./engine2d.component.css */ "./src/app/engine2d/engine2d.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_engine2d_service__WEBPACK_IMPORTED_MODULE_2__["Engine2DService"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"]])
    ], Engine2DComponent);
    return Engine2DComponent;
}());



/***/ }),

/***/ "./src/app/engine2d/engine2d.service.ts":
/*!**********************************************!*\
  !*** ./src/app/engine2d/engine2d.service.ts ***!
  \**********************************************/
/*! exports provided: Engine2DService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Engine2DService", function() { return Engine2DService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var snapsvg_cjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! snapsvg-cjs */ "./node_modules/snapsvg-cjs/dist/snap.svg-cjs.js");
/* harmony import */ var snapsvg_cjs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(snapsvg_cjs__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _js_snap_svg_free_transform_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./js/snap.svg.free_transform.js */ "./src/app/engine2d/js/snap.svg.free_transform.js");
/* harmony import */ var _js_snap_svg_free_transform_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_js_snap_svg_free_transform_js__WEBPACK_IMPORTED_MODULE_3__);




var Engine2DService = /** @class */ (function () {
    function Engine2DService() {
        var _this = this;
        // defines snap.g object
        this.selected_objects = [];
        this.mouse = { x: 0, y: 0 };
        // onmouse move event
        this.onSVGMouseMove = function (event) {
            event.preventDefault();
            // gets bounding box parameters of canvas
            var rect = _this.svgElement.getBoundingClientRect();
            // computes normalized mouse positions
            _this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            _this.mouse.y = (-(event.clientY - rect.top) / rect.height) * 2 + 1;
        };
        this.onKeyDown = function (event) {
            event.preventDefault();
            switch (event.keyCode) {
                case 46: // Del
                    // removes each selected object
                    _this.getSelectedObjects().forEach(function (ele) {
                        ele.freeTransform.unplug();
                        ele.remove();
                    });
                    // clears selected object list
                    _this.getSelectedObjects().length = 0;
                    break;
            }
        };
    }
    //Create svg
    Engine2DService.prototype.createSvg = function () {
        // gets svg canvas element and snap canvas object
        this.svgElement = document.getElementById('svg');
        this.svgCanvas = Snap("#svg");
        this.svgCanvasGroup = this.svgCanvas.group();
        this.svgCanvas.mousemove(this.onSVGMouseMove);
        document.addEventListener('keydown', this.onKeyDown);
    };
    // inserts image given path
    // returns inserted image object
    Engine2DService.prototype.insertImage = function (path) {
        return (this.svgCanvasGroup.image(path, 280, 80, 200, 200));
    };
    // adds double click event to element given element
    // double click enables free transform tool on element
    // returns free transform tool object of element
    // Source: https://github.com/ibrierley/Snap.svg.FreeTransform/blob/master/index.html
    // Updates selection list on click
    // https://stackoverflow.com/questions/21337329/get-id-of-clicked-element-in-snap-svg
    Engine2DService.prototype.addSelectionEvent = function (myEl) {
        var _this = this;
        var ft = this.svgCanvas.freeTransform(myEl, { snap: { rotate: 1 }, size: 8, draw: 'bbox' });
        // sets properties of free transformer
        ft.attrs.rotate = 0;
        ft.apply();
        myEl.data('ftStatus', 0);
        // hides handles
        ft.hideHandles();
        // adds double click event of element
        myEl.dblclick(function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (myEl.data('ftStatus')) {
                ft.hideHandles();
                _this.selected_objects.splice(_this.selected_objects.indexOf(myEl), 1);
                myEl.data('ftStatus', 0);
            }
            else {
                ft.showHandles();
                _this.selected_objects.push(myEl);
                myEl.data('ftStatus', 1);
            }
        });
        return ft;
    };
    // generates event for adding filter to an element
    Engine2DService.prototype.addFilter = function (f) {
        return (function () { this.attr({ filter: f }); });
    };
    Engine2DService.prototype.clearSVGCanvas = function () {
        this.svgCanvas.clear();
    };
    // getters and setters
    Engine2DService.prototype.getSelectedObjects = function () {
        return this.selected_objects;
    };
    Engine2DService.prototype.getSVGCanvas = function () {
        return this.svgCanvas;
    };
    Engine2DService.prototype.getSVGCanvasGroup = function () {
        return this.svgCanvasGroup;
    };
    Engine2DService.prototype.getSVGElement = function () {
        return this.svgElement;
    };
    // exports svg
    Engine2DService.prototype.export_svg = function () {
    };
    Engine2DService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        })
    ], Engine2DService);
    return Engine2DService;
}());



/***/ }),

/***/ "./src/app/engine2d/js/snap.svg.free_transform.js":
/*!********************************************************!*\
  !*** ./src/app/engine2d/js/snap.svg.free_transform.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function(elem) {
        return elem.getScreenCTM().inverse().multiply(this.getScreenCTM());
    };

Snap.plugin(function(Snap, Element, Paper, global, Fragment) {
    Element.prototype.show = function() {
        this.attr('display', '');
    };

    Element.prototype.hide = function() {
        this.attr('display', 'none');
    };

    Element.prototype.globalToLocal = function( globalPoint ) {
        var globalToLocal = this.node.getTransformToElement( this.paper.node ).inverse();
        globalToLocal.e = globalToLocal.f = 0;
        return globalPoint.matrixTransform( globalToLocal );
    };

    // Get a cursor point accounting for the screen matrix conversion, eg zoomed in scrolled etc
    Element.prototype.getCursorPoint = function( x, y ) {
        var pt = this.paper.node.createSVGPoint();      
        pt.x = x; pt.y = y;
        return pt.matrixTransform( this.paper.node.getScreenCTM().inverse()); 
    }

    // This is for dragging, pass in the element with the transform, eg a rotate dragger/handlers
    // Get a new x,y for the cursor, then subtract from the original point accounting also for its matrix
    // Hmm I feel like this could be simplified! Check through globalToLocal and see if some is redundant
    // Superceded, but leaving in case of use 
//    Element.prototype.getTransformedDx = function( el, ox, oy, x, y ) {
//        var cursorPoint = this.getCursorPoint( x, y );
//        var pt = this.paper.node.createSVGPoint();
//        pt.x = cursorPoint.x - ox;
//        pt.y = cursorPoint.y - oy;
//        var matrix = el.node.getScreenCTM().inverse();
//        matrix.e = matrix.f = 0;		// remove the transform part. I can't quite remember now the logic of this anymore! see S.O
//        return pt.matrixTransform( matrix );
//    }

    // otx, oty are already transformed to the correct coord space, x,y aren't, may want to change to be consistent
    Element.prototype.getTransformedDrag = function( ft, otx, oty, x, y ) {
        var xy = this.getCursorPoint( x, y );
        var tdx = {};
        var snapInvMatrix = ft.origGlobalMatrix.invert();

        snapInvMatrix.e = snapInvMatrix.f = 0;
        tdx.x = snapInvMatrix.x( xy.x - otx, xy.y - oty );
        tdx.y = snapInvMatrix.y( xy.x - otx, xy.y - oty );
        return tdx;
    }


    Paper.prototype.freeTransform = function(subject, options, callback) {
        // Enable method chaining. #### This causes conflicts with group elements, as it thinks a group is a paper
        if (subject.freeTransformxxxxxxxxxxxxxxx) {
            return subject.freeTransform;
        }
        // Add Array.map if the browser doesn't support it.
        if (!Array.prototype.hasOwnProperty('map')) {
            Array.prototype.map = function(callback, arg) {
                var i, mapped = [];
                for (i in this) {
                    if (this.hasOwnProperty(i)) {
                        mapped[i] = callback.call(arg, this[i], i, this);
                    }
                    return mapped;
                }
            };
        }
        // Add Array.indexOf if not builtin.
        if (!Array.prototype.hasOwnProperty('indexOf')) {
            Array.prototype.indexOf = function(obj, start) {
                for (var i = (start || 0), j = this.length; i < j; i++) {
                    if (this[i] === obj) {
                        return i;
                    }
                }
                return -1;
            };
        }

        var paper = this,
            bbox = subject.getBBox(true);

        var ft = subject.freeTransform = {
            // Keep track of transformations.
            attrs: {
                x: bbox.x,
                y: bbox.y,
                size: {
                    x: bbox.width,
                    y: bbox.height
                },
                center: {
                    x: bbox.x + bbox.width / 2,
                    y: bbox.y + bbox.height / 2
                },
                rotate: 0,
                scale: {
                    x: 1,
                    y: 1
                },
                translate: {
                    x: 0,
                    y: 0
                },
                ratio: 1
            },
            axes: null,
            bbox: null,
            callback: null,
            items: [],
            handles: {
                center: null,
                x: null,
                y: null
            },
            offset: {
                rotate: 0,
                scale: {
                    x: 1,
                    y: 1
                },
                translate: {
                    x: 0,
                    y: 0
                }
            },
            opts: {
                attrs: {
                    fill: '#fff',
                    stroke: '#1e609d'
                },
                axisLineClass: 'ftaxisline',
                bboxClass: 'ftbbox',
                centerDiscClass: 'ftcenterdisc',
                centerCircleClass: 'ftcentercircle', 
                distance: 1.2,
                discDistance: 45,
                discClass: 'ftdisc',
                drag: true,
                draw: ['bbox'],
                keepRatio: false,
                handleClass: 'fthandle',
                range: {
                    rotate: [-180, 180],
                    scale: [-99999, 99999]
                },
                rotate: true,
                scale: true,
                snap: {
                    rotate: 0,
                    scale: 0,
                    drag: 0
                },
                snapDist: {
                    rotate: 0,
                    scale: 0,
                    drag: 7
                },
                size: 4
            },
            subject: subject,
            origTransform: subject.transform().localMatrix,
            origGlobalMatrix: subject.transform().globalMatrix,
            origDiffMatrix:   subject.transform().diffMatrix,
            origLocalMatrix:  subject.transform().localMatrix,
        };
        /**
         * Update handles based on the element's transformations.
         */
        ft.updateHandles = function() {
            if (ft.handles.bbox || ft.opts.rotate.indexOf('self') >= 0) {
                var corners = getBBox();
            }

            // Get the element's rotation.
            var rad = {
                x: Snap.rad(ft.attrs.rotate),
                y: Snap.rad(ft.attrs.rotate + 90)
            };

            var radius = {
                x: ft.attrs.size.x / 2 * ft.attrs.scale.x,
                y: ft.attrs.size.y / 2 * ft.attrs.scale.y
            };

            // If the rotation is disabled, hide the handle.
            if (ft.opts.rotate.length) {
                ft.axes.map(function(axis) {
                    if (!ft.handles[axis]) {
                        return;
                    }
                    var cx = ft.attrs.center.x + ft.attrs.translate.x + (radius[axis] + ft.opts.discDistance) * Math.cos(rad[axis]),
                        cy = ft.attrs.center.y + ft.attrs.translate.y + (radius[axis] + ft.opts.discDistance) * Math.sin(rad[axis]);

                    ft.handles[axis].disc.attr({
                        cx: cx,
                        cy: cy
                    });

                    var end_x = ft.attrs.center.x + ft.attrs.translate.x + radius[axis] * Math.cos(rad[axis]),
                        end_y = ft.attrs.center.y + ft.attrs.translate.y + radius[axis] * Math.sin(rad[axis]);

                    ft.handles[axis].line.attr({
                        path: [
                            ['M', end_x, end_y],
                            ['L', cx, cy]
                        ]
                    });
                });
            }

            if (ft.bbox) {
                ft.bbox.attr({
                    path: [
                        ['M', corners[0].x, corners[0].y],
                        ['L', corners[1].x, corners[1].y],
                        ['L', corners[2].x, corners[2].y],
                        ['L', corners[3].x, corners[3].y],
                        ['L', corners[0].x, corners[0].y]
                    ]
                });

                // Allowed x, y scaling directions for bbox handles.
                var bboxHandleDirection = [
                    [-1, -1], [1, -1], [1, 1], [-1, 1],
                    [0, -1], [1,  0], [0, 1], [-1, 0]
                ];

                if (ft.handles.bbox) {
                    ft.handles.bbox.map(function(handle, i) {
                        var cx, cy, j, k;

                        if (handle.isCorner) {
                            cx = corners[i].x;
                            cy = corners[i].y;
                        } else {
                            j  = i % 4;
                            k  = (j + 1) % corners.length;
                            cx = (corners[j].x + corners[k].x) / 2;
                            cy = (corners[j].y + corners[k].y) / 2;
                        }

                        handle.element.attr({
                            x: cx - (handle.isCorner ? ft.opts.size.bboxCorners : ft.opts.size.bboxSides),
                            y: cy - (handle.isCorner ? ft.opts.size.bboxCorners : ft.opts.size.bboxSides),
                            transform: 'R' + ft.attrs.rotate
                        });

                        handle.x = bboxHandleDirection[i][0];
                        handle.y = bboxHandleDirection[i][1];
                    });
                }
            }

            if (ft.circle) {
                ft.circle.attr({
                    cx: ft.attrs.center.x + ft.attrs.translate.x,
                    cy: ft.attrs.center.y + ft.attrs.translate.y,
                    r:  Math.max(radius.x, radius.y) * ft.opts.distance
                });
            }

            if (ft.handles.center) {
                ft.handles.center.disc.attr({
                    cx: ft.attrs.center.x + ft.attrs.translate.x,
                    cy: ft.attrs.center.y + ft.attrs.translate.y
                });
            }

            return ft;
        };

        /**
         * Add handles.
         */
        ft.showHandles = function() {
            ft.hideHandles();
//test!!
            ft.group = paper.g().transform( ft.origGlobalMatrix );

            ft.axes.map(function(axis) {
                ft.handles[axis] = {};

                ft.handles[axis].line = ft.group
                    .path([
                        ['M', ft.attrs.center.x + ft.attrs.size.x / 2, ft.attrs.center.y]
                    ])
                    .attr({
                        stroke: ft.opts.attrs.stroke,
                        'stroke-dasharray': '4,3',
                        opacity: .5
                    })
                    .addClass( ft.opts.axisLineClass );

                ft.handles[axis].disc = ft.group
                    .circle(ft.attrs.center.x, ft.attrs.center.y, ft.opts.size.axes)
                    .attr(ft.opts.attrs)
                    .attr('cursor', 'crosshair')
                    .addClass( ft.opts.discClass ) ;

                // If the rotation is disabled, hide the handle.
                if (!ft.opts.rotate.length) {
                    ft.handles[axis].disc.hide();
                }
            });

            if (ft.opts.draw.indexOf('bbox') >= 0) {
                ft.bbox = ft.group
                    .path('')
                    .attr({
                        stroke: ft.opts.attrs.stroke,
                        'stroke-dasharray': '4,3',
                        fill: 'none',
                        opacity: .5
                    })
                    .addClass( ft.opts.bboxClass );

                ft.handles.bbox = [];

                var i, handle, cursor;

                for (i = (ft.opts.scale.indexOf('bboxCorners') >= 0 ? 0 : 4); i < (ft.opts.scale.indexOf('bboxSides') === -1 ? 4 : 8); i ++) {
                    handle = {
                        axis: i % 2 ? 'x' : 'y',
                        isCorner: i < 4
                    };

                    if (!handle.isCorner) {
                        cursor = (handle.axis == 'x') ? 'e-resize' : 'n-resize';
                    } else {
                        cursor = (handle.axis == 'x') ? 'sw-resize' : 'nw-resize';
                    }

                    handle.element = ft.group
                        .rect(ft.attrs.center.x, ft.attrs.center.y, ft.opts.size[handle.isCorner ? 'bboxCorners' : 'bboxSides'] * 2, ft.opts.size[handle.isCorner ? 'bboxCorners' : 'bboxSides'] * 2)
                        .attr(ft.opts.attrs)
                        .attr('cursor', cursor)
                        .addClass( ft.opts.handleClass);

                    ft.handles.bbox[i] = handle;
                }
            }

            if (ft.opts.draw.indexOf('circle') !== -1) {
                ft.circle = ft.group
                    .circle(0, 0, 0)
                    .attr({
                        stroke: ft.opts.attrs.stroke,
                        'stroke-dasharray': '4,3',
                        opacity: .3
                    })
                    .addClass( ft.opts.centerCircleClass );
            }

            if (ft.opts.drag.indexOf('center') !== -1) {
                ft.handles.center = {};

                ft.handles.center.disc = ft.group
                    .circle(ft.attrs.center.x, ft.attrs.center.y, ft.opts.size.center)
                    .attr(ft.opts.attrs)
                    .addClass( ft.opts.centerDiscClass );
            }

            // Drag x, y handles.
            ft.axes.map(function(axis) {
                if (!ft.handles[axis]) {
                    return;
                }

                var rotate = ft.opts.rotate.indexOf('axis' + axis.toUpperCase()) !== -1,
                    scale  = ft.opts.scale .indexOf('axis' + axis.toUpperCase()) !== -1;

                ft.handles[axis].disc.drag(function(dx, dy, x, y) {
                    // var localPt = this.getTransformedDx( ft.group, this.data('op').x, this.data('op').y, x, y );
                    var tdx = this.getTransformedDrag( ft, this.data('op').x, this.data('op').y, x, y );

                    var cx = tdx.x + ft.handles[axis].disc.ox,
                        cy = tdx.y + ft.handles[axis].disc.oy;

                    var mirrored = {
                        x: ft.o.scale.x < 0,
                        y: ft.o.scale.y < 0
                    };

                    if (rotate) {
                        var rad = Math.atan2(cy - ft.o.center.y - ft.o.translate.y, cx - ft.o.center.x - ft.o.translate.x);

                        ft.attrs.rotate = Snap.deg(rad) - (axis === 'y' ? 90 : 0);

                        if (mirrored[axis]) {
                            ft.attrs.rotate -= 180;
                        }
                    }

                    var radius = Math.sqrt(Math.pow(cx - ft.o.center.x - ft.o.translate.x, 2) + Math.pow(cy - ft.o.center.y - ft.o.translate.y, 2));

                    applyLimits();

                    // Maintain aspect ratio.
                    if (ft.opts.keepRatio.indexOf('axis' + axis.toUpperCase()) !== -1) {
                        keepRatio(axis);
                    } else {
                        ft.attrs.ratio = ft.attrs.scale.x / ft.attrs.scale.y;
                    }

                    if (ft.attrs.scale.x && ft.attrs.scale.y) {
                        ft.apply();
                    }

                    asyncCallback([rotate ? 'rotate' : null, scale ? 'scale' : null]);
                }, function( x, y ) {

                    this.data('op', this.getCursorPoint( x, y ));

                    // Offset values.
                    ft.o = cloneObj(ft.attrs);

                    ft.handles[axis].disc.ox = parseInt(this.attr('cx'));
                    ft.handles[axis].disc.oy = parseInt(this.attr('cy'));

                    asyncCallback([rotate ? 'rotate start' : null, scale ? 'scale start' : null]);
                }, function() {
                    asyncCallback([rotate ? 'rotate end' : null, scale ? 'scale end' : null]);
                });
            });

            // Drag bbox handles.
            if (ft.opts.draw.indexOf('bbox') >= 0 && (ft.opts.scale.indexOf('bboxCorners') !== -1 || ft.opts.scale.indexOf('bboxSides') !== -1)) {
                ft.handles.bbox.map(function(handle) {
                    handle.element.drag(function(dx, dy, x, y) {

                        var tdx = this.getTransformedDrag( ft, this.data('op').x, this.data('op').y, x, y );
                        // var localPt = this.getTransformedDx( ft.group, this.data('op').x, this.data('op').y, x, y );
                        var sin, cos, rx, ry, rdx, rdy, mx, my, sx, sy,
                            previous = cloneObj(ft.attrs);

                        sin = ft.o.rotate.sin;
                        cos = ft.o.rotate.cos;

                        // First rotate dx, dy to element alignment.
                        rx = tdx.x * cos - tdx.y * sin;
                        ry = tdx.x * sin + tdx.y * cos;

                        rx *= Math.abs(handle.x);
                        ry *= Math.abs(handle.y);

                        // And finally rotate back to canvas alignment.
                        rdx = rx * cos + ry * sin;
                        rdy = rx * -sin + ry * cos;

                        ft.attrs.translate = {
                            x: ft.o.translate.x + rdx / 2,
                            y: ft.o.translate.y + rdy / 2
                        };

                        // Mouse position, relative to element center after translation.
                        mx = ft.o.handlePos.cx + tdx.x - ft.attrs.center.x - ft.attrs.translate.x;
                        my = ft.o.handlePos.cy + tdx.y - ft.attrs.center.y - ft.attrs.translate.y;
                        // Position rotated to align with element.
                        rx = mx * cos - my * sin;
                        ry = mx * sin + my * cos;

                        // Maintain aspect ratio.
                        if (handle.isCorner && ft.opts.keepRatio.indexOf('bboxCorners') !== -1) {
                            var ratio = (ft.attrs.size.x * ft.attrs.scale.x) / (ft.attrs.size.y * ft.attrs.scale.y),
                                tdy = rx * handle.x * ( 1 / ratio ),
                                tdx = ry * handle.y * ratio;

                            if (tdx > tdy * ratio) {
                                rx = tdx * handle.x;
                            } else {
                                ry = tdy * handle.y;
                            }
                        }

                        // Scale element so that handle is at mouse position
                        sx = rx * 2 * handle.x / ft.o.size.x;
                        sy = ry * 2 * handle.y / ft.o.size.y;

                        ft.attrs.scale = {
                            x: sx || ft.attrs.scale.x,
                            y: sy || ft.attrs.scale.y
                        };

                        // Check boundaries.
                        if (!isWithinBoundaries().x || !isWithinBoundaries().y) {
                            ft.attrs = previous;
                        }

                        applyLimits();

                        // Maintain aspect ratio.
                        if ((handle.isCorner && ft.opts.keepRatio.indexOf('bboxCorners') !== -1) || (!handle.isCorner && ft.opts.keepRatio.indexOf('bboxSides') !== -1)) {
                            keepRatio(handle.axis);

                            var trans = {
                                x: (ft.attrs.scale.x - ft.o.scale.x) * ft.o.size.x * handle.x,
                                y: (ft.attrs.scale.y - ft.o.scale.y) * ft.o.size.y * handle.y
                            };

                            rx = trans.x * cos + trans.y * sin;
                            ry = -trans.x * sin + trans.y * cos;

                            ft.attrs.translate.x = ft.o.translate.x + rx / 2;
                            ft.attrs.translate.y = ft.o.translate.y + ry / 2;
                        }

                        ft.attrs.ratio = ft.attrs.scale.x / ft.attrs.scale.y;

                        asyncCallback(['scale']);

                        ft.apply();
                    }, function( x, y ) {
                       this.data('op', this.getCursorPoint( x, y ));

                        var rotate = Snap.rad((360 - ft.attrs.rotate) % 360),
                            handlePos = {
                                x: parseInt(handle.element.attr('x')),
                                y: parseInt(handle.element.attr('y'))
                            };

                        // Offset values.
                        ft.o = cloneObj(ft.attrs);

                        ft.o.handlePos = {
                            cx: handlePos.x + ft.opts.size[handle.isCorner ? 'bboxCorners' : 'bboxSides'],
                            cy: handlePos.y + ft.opts.size[handle.isCorner ? 'bboxCorners' : 'bboxSides']
                        };

                        // Pre-compute rotation sin & cos for efficiency.
                        ft.o.rotate = {
                            sin: Math.sin(rotate),
                            cos: Math.cos(rotate)
                        };

                        asyncCallback(['scale start']);
                    }, function() {
                        asyncCallback(['scale end']);
                    });
                });
            }

            // Drag element and center handle.
            var draggables = [];

            if (ft.opts.drag.indexOf('self') >= 0 && ft.opts.scale.indexOf('self') === -1 && ft.opts.rotate.indexOf('self') === -1) {
                draggables.push(subject);
            }

            if (ft.opts.drag.indexOf('center') >= 0) {
                draggables.push(ft.handles.center.disc);
            }

            ft.attachHandlers(draggables);

            var rotate = ft.opts.rotate.indexOf('self') >= 0,
                scale  = ft.opts.scale.indexOf('self') >= 0;

            if (rotate || scale) {
                subject.drag(function(dx, dy, x, y) {

                    // var localPt = this.getTransformedDx( ft.group, this.data('op').x, this.data('op').y, x, y );
                    var tdx = this.getTransformedDrag( ft, this.data('op').x, this.data('op').y, x, y );

                    if (rotate) {
                        var rad = Math.atan2(tdx.y - ft.o.center.y - ft.o.translate.y, tdx.x - ft.o.center.x - ft.o.translate.x);
                        ft.attrs.rotate = ft.o.rotate + Snap.deg(rad) - ft.o.deg;
                    }

                    var mirrored = {
                        x: ft.o.scale.x < 0,
                        y: ft.o.scale.y < 0
                    };

                    if (scale) {
                        var radius = Math.sqrt(Math.pow(x - ft.o.center.x - ft.o.translate.x, 2) + Math.pow(y - ft.o.center.y - ft.o.translate.y, 2));

                        ft.attrs.scale.x = ft.attrs.scale.y = (mirrored.x ? -1 : 1) * ft.o.scale.x + (radius - ft.o.radius) / (ft.o.size.x / 2);

                        if (mirrored.x) {
                            ft.attrs.scale.x *= -1;
                        }
                        if (mirrored.y) {
                            t.attrs.scale.y *= -1;
                        }
                    }

                    applyLimits();

                    ft.apply();

                    asyncCallback([rotate ? 'rotate' : null, scale ? 'scale' : null]);
                }, function(x, y) {

                    this.data('op', this.getCursorPoint( x, y ));

                    // Offset values
                    ft.o = cloneObj(ft.attrs);

                    ft.o.deg = Math.atan2(y - ft.o.center.y - ft.o.translate.y, x - ft.o.center.x - ft.o.translate.x) * 180 / Math.PI;

                    ft.o.radius = Math.sqrt(Math.pow(x - ft.o.center.x - ft.o.translate.x, 2) + Math.pow(y - ft.o.center.y - ft.o.translate.y, 2));

                    asyncCallback([rotate ? 'rotate start' : null, scale ? 'scale start' : null]);
                }, function() {
                    asyncCallback([rotate ? 'rotate end' : null, scale ? 'scale end' : null]);
                });
            }

            ft.updateHandles();

            return ft;
        };

        /**
         * Remove handles.
         */
        ft.hideHandles = function(opts) {
            var opts = opts || {}

            if (opts.undrag === undefined) {
                opts.undrag = true;
            }

            if (opts.undrag) {
                ft.items.map(function(item) {
                    item.el.undrag();
                });
            }

            if (ft.handles.center) {
                ft.handles.center.disc.remove();
                ft.handles.center = null;
            }

            ['x', 'y'].map(function(axis) {
                if (ft.handles[axis]) {
                    ft.handles[axis].disc.remove();
                    ft.handles[axis].line.remove();
                    ft.handles[axis] = null;
                }
            });

            if (ft.bbox) {
                ft.bbox.remove();
                ft.bbox = null;

                if (ft.handles.bbox) {
                    ft.handles.bbox.map(function(handle) {
                        handle.element.remove();
                    });
                    ft.handles.bbox = null;
                }
            }

            if (ft.circle) {
                ft.circle.remove();
                ft.circle = null;
            }

            if (ft.group) {
                ft.group.remove();
                ft.group = null;
            }

            return ft;
        };

        // Drag main element
        ft.attachHandlers = function(draggables) {
            draggables.map(function (draggable) {
                draggable.drag(function (dx, dy, ax, ay) {

                    var tdx = this.getTransformedDrag( ft, this.data('op').x, this.data('op').y, ax, ay );

                    ft.attrs.translate.x = ft.o.translate.x + tdx.x;
                    ft.attrs.translate.y = ft.o.translate.y + tdx.y;

                    var bbox = cloneObj(ft.o.bbox);
                    bbox.x += tdx.x;
                    bbox.y += tdx.y;

                    applyLimits(bbox);

                    asyncCallback(['drag']);
                    ft.apply();
                }, function( x, y, ev ) {
                    this.data('op', this.getCursorPoint( x, y ));

                    // Offset values.
                    ft.o = cloneObj(ft.attrs);

                    if (ft.opts.snap.drag) {
                        ft.o.bbox = subject.getBBox();
                    }

                    ft.axes.map(function(axis) {
                        if (ft.handles[axis]) {
                            ft.handles[axis].disc.ox = parseInt(ft.handles[axis].disc.attr('cx'));
                            ft.handles[axis].disc.oy = parseInt(ft.handles[axis].disc.attr('cy'));
                        }
                    });

                    asyncCallback(['drag start']);
                }, function() {
                    asyncCallback(['drag end']);
                });
            });
        };

        /**
         * Override defaults.
         */
        ft.setOpts = function(options, callback) {
            if (callback !== undefined) {
                ft.callback = typeof callback === 'function' ? callback : false;
            }

            var i, j;

            for (i in options) {
                if (options[i] && options[i].constructor === Object) {
                    if (ft.opts[i] === false) {
                        ft.opts[i] = {};
                    }
                    for (j in options[i]) {
                        if (options[i].hasOwnProperty(j)) {
                            ft.opts[i][j] = options[i][j];
                        }
                    }
                } else {
                    ft.opts[i] = options[i];
                }
            }

            if (ft.opts.drag === true) {
                ft.opts.drag = ['self'];
            }
            if (ft.opts.keepRatio === true) {
                ft.opts.keepRatio = ['bboxCorners', 'bboxSides'];
            }
            if (ft.opts.rotate === true) {
                ft.opts.rotate = ['axisX', 'axisY'];
            }
            if (ft.opts.scale === true) {
                ft.opts.scale = ['axisX', 'axisY', 'bboxCorners', 'bboxSides'];
            }

            ['drag', 'draw', 'keepRatio', 'rotate', 'scale'].map(function (option) {
                if (ft.opts[option] === false) {
                    ft.opts[option] = [];
                }
            });

            ft.axes = [];

            if (ft.opts.rotate.indexOf('axisX') >= 0 || ft.opts.scale.indexOf('axisX') >= 0) {
                ft.axes.push('x');
            }
            if (ft.opts.rotate.indexOf('axisY') >= 0 || ft.opts.scale.indexOf('axisY') >= 0) {
                ft.axes.push('y');
            }


            ['drag', 'rotate', 'scale'].map(function (option) {
                if (!ft.opts.snapDist[option]) {
                    ft.opts.snapDist[option] = ft.opts.snap[option];
                }
            });

            // Force numbers.
            ft.opts.range = {
                rotate: [parseFloat(ft.opts.range.rotate[0]), parseFloat(ft.opts.range.rotate[1])],
                scale:  [parseFloat(ft.opts.range.scale[0]), parseFloat(ft.opts.range.scale[1])]
            };

            ft.opts.snap = {
                drag: parseFloat(ft.opts.snap.drag),
                rotate: parseFloat(ft.opts.snap.rotate),
                scale: parseFloat(ft.opts.snap.scale)
            };

            ft.opts.snapDist = {
                drag: parseFloat(ft.opts.snapDist.drag),
                rotate: parseFloat(ft.opts.snapDist.rotate),
                scale: parseFloat(ft.opts.snapDist.scale)
            };

            if (typeof ft.opts.size === 'string') {
                ft.opts.size = parseFloat(ft.opts.size);
            }

            if (!isNaN(ft.opts.size)) {
                ft.opts.size = {
                    axes: ft.opts.size,
                    bboxCorners: ft.opts.size,
                    bboxSides: ft.opts.size,
                    center: ft.opts.size
                };
            }

            ft.showHandles();

            asyncCallback(['init']);

            return ft;
        };

        ft.setOpts(options, callback);

        /**
         * Apply transformations, optionally update attributes manually.
         */
        ft.apply = function() {
            ft.items.map(function(item, i) {
                // Take offset values into account.
                var center = {
                        x: ft.attrs.center.x + ft.offset.translate.x,
                        y: ft.attrs.center.y + ft.offset.translate.y
                    },
                    rotate = ft.attrs.rotate - ft.offset.rotate,
                    scale = {
                        x: ft.attrs.scale.x / ft.offset.scale.x,
                        y: ft.attrs.scale.y / ft.offset.scale.y
                    },
                    translate = {
                        x: ft.attrs.translate.x - ft.offset.translate.x,
                        y: ft.attrs.translate.y - ft.offset.translate.y
                    };


                item.el.transform( ft.origTransform.toTransformString() +  [
                    't' + translate.x, translate.y,
                    'r' + rotate, center.x, center.y,
                    's' + scale.x, scale.y, center.x, center.y,
                ].join())
                asyncCallback(['apply']);

                ft.updateHandles();
            });

            ft.group.transform( ft.origGlobalMatrix );

            return ft;
        };

        /**
         * Clean exit.
         */
        ft.unplug = function() {
            var attrs = ft.attrs;
console.log('unplug');
            ft.hideHandles();

            delete subject.freeTransform;

            return attrs;
        };

        // Store attributes for each item
        function scan(subject) {
            (subject.type === 'set' ? subject.items : [subject]).map(function (item) {
                if (item.type === 'set') {
                    scan(item);
                } else {
                    ft.items.push({
                        el: item,
                        attrs: {
                            rotate: 0,
                            scale: { x: 1, y: 1 },
                            translate: { x: 0, y: 0 }
                        },
                        transformString: item.transform().toString()
                    });
                }
            });
        }

        ft.scanItems = function() {
            ft.items = [];
            scan(subject);

            // Get the current transform values for each item
            ft.items.map(function(item, i) {
                if (item.el._ && item.el._.transform && typeof item.el._.transform === 'object') {
                    item.el._.transform.map(function(transform) {
                        if (transform[0]) {
                            switch (transform[0].toUpperCase()) {
                                case 'T':
                                    ft.items[i].attrs.translate.x += transform[1];
                                    ft.items[i].attrs.translate.y += transform[2];
                                    break;
                                case 'S':
                                    ft.items[i].attrs.scale.x *= transform[1];
                                    ft.items[i].attrs.scale.y *= transform[2];
                                    break;
                                case 'R':
                                    ft.items[i].attrs.rotate += transform[1];
                                    break;
                            }
                        }
                    });
                }
            });
        };

        ft.scanItems();

        // If subject is not of type set, the first item _is_ the subject
        if (subject.type !== 'set') {
            ft.attrs.rotate = ft.items[0].attrs.rotate;
            ft.attrs.scale = ft.items[0].attrs.scale;
            ft.attrs.translate = ft.items[0].attrs.translate;

            ft.items[0].attrs = {
                rotate: 0,
                scale: {
                    x: 1, y: 1
                },
                translate: {
                    x: 0,
                    y: 0
                }
            };

            ft.items[0].transformString = '';
        }

        ft.attrs.ratio = ft.attrs.scale.x / ft.attrs.scale.y;

        /**
         * Get rotated bounding box
         */
        function getBBox() {
            var rad = {
                x: Snap.rad(ft.attrs.rotate),
                y: Snap.rad(ft.attrs.rotate + 90)
            };

            var radius = {
                x: ft.attrs.size.x / 2 * ft.attrs.scale.x,
                y: ft.attrs.size.y / 2 * ft.attrs.scale.y
            };

            var corners = [],
                signs   = [
                    {x: -1, y: -1},
                    {x: 1, y: -1},
                    {x: 1, y: 1},
                    {x: -1, y: 1}
                ];

            signs.map(function(sign) {
                corners.push({
                    x: (ft.attrs.center.x + ft.attrs.translate.x + sign.x * radius.x * Math.cos(rad.x)) + sign.y * radius.y * Math.cos(rad.y),
                    y: (ft.attrs.center.y + ft.attrs.translate.y + sign.x * radius.x * Math.sin(rad.x)) + sign.y * radius.y * Math.sin(rad.y)
                });
            });

            return corners;
        }

        /**
         * Apply limits.
         */
        function applyLimits(bbox) {
            // Snap to grid
            if (bbox && ft.opts.snap.drag) {
                var x = bbox.x,
                    y = bbox.y,
                    dist = {
                        x: 0,
                        y: 0
                    },
                    snap = {
                        x: 0,
                        y: 0
                    };

                [0, 1].map(function() {
                    // Top and left sides first.
                    dist.x = x - Math.round(x / ft.opts.snap.drag) * ft.opts.snap.drag;
                    dist.y = y - Math.round(y / ft.opts.snap.drag) * ft.opts.snap.drag;

                    if (Math.abs(dist.x) <= ft.opts.snapDist.drag) {
                        snap.x = dist.x;
                    }
                    if (Math.abs(dist.y) <= ft.opts.snapDist.drag) {
                        snap.y = dist.y;
                    }

                    // Repeat for bottom and right sides.
                    x += bbox.width - snap.x;
                    y += bbox.height - snap.y;
                });

                ft.attrs.translate.x -= snap.x;
                ft.attrs.translate.y -= snap.y;
            }

            // Snap to angle, rotate with increments.
            dist = Math.abs(ft.attrs.rotate % ft.opts.snap.rotate);
            dist = Math.min(dist, ft.opts.snap.rotate - dist);

            if (dist < ft.opts.snapDist.rotate) {
                ft.attrs.rotate = Math.round(ft.attrs.rotate / ft.opts.snap.rotate) * ft.opts.snap.rotate;
            }

            // Snap to scale, scale with increments.
            dist = {
                x: Math.abs((ft.attrs.scale.x * ft.attrs.size.x) % ft.opts.snap.scale),
                y: Math.abs((ft.attrs.scale.y * ft.attrs.size.x) % ft.opts.snap.scale)
            };

            dist = {
                x: Math.min(dist.x, ft.opts.snap.scale - dist.x),
                y: Math.min(dist.y, ft.opts.snap.scale - dist.y)
            };

            if (dist.x < ft.opts.snapDist.scale) {
                ft.attrs.scale.x = Math.round(ft.attrs.scale.x * ft.attrs.size.x / ft.opts.snap.scale) * ft.opts.snap.scale / ft.attrs.size.x;
            }

            if (dist.y < ft.opts.snapDist.scale) {
                ft.attrs.scale.y = Math.round(ft.attrs.scale.y * ft.attrs.size.y / ft.opts.snap.scale) * ft.opts.snap.scale / ft.attrs.size.y;
            }

            // Limit range of rotation.
            if (ft.opts.range.rotate) {
                var deg = (360 + ft.attrs.rotate) % 360;

                if (deg > 180) {
                    deg -= 360;
                }

                if (deg < ft.opts.range.rotate[0]) {
                    ft.attrs.rotate += ft.opts.range.rotate[0] - deg;
                }
                if (deg > ft.opts.range.rotate[1]) {
                    ft.attrs.rotate += ft.opts.range.rotate[1] - deg;
                }
            }

            // Limit scale.
            if (ft.opts.range.scale) {
                if (ft.attrs.scale.x * ft.attrs.size.x < ft.opts.range.scale[0]) {
                    ft.attrs.scale.x = ft.opts.range.scale[0] / ft.attrs.size.x;
                }

                if (ft.attrs.scale.y * ft.attrs.size.y < ft.opts.range.scale[0]) {
                    ft.attrs.scale.y = ft.opts.range.scale[0] / ft.attrs.size.y;
                }

                if (ft.attrs.scale.x * ft.attrs.size.x > ft.opts.range.scale[1]) {
                    ft.attrs.scale.x = ft.opts.range.scale[1] / ft.attrs.size.x;
                }

                if (ft.attrs.scale.y * ft.attrs.size.y > ft.opts.range.scale[1]) {
                    ft.attrs.scale.y = ft.opts.range.scale[1] / ft.attrs.size.y;
                }
            }
        }

        function isWithinBoundaries() {
            return {
                x: ft.attrs.scale.x * ft.attrs.size.x >= ft.opts.range.scale[0] && ft.attrs.scale.x * ft.attrs.size.x <= ft.opts.range.scale[1],
                y: ft.attrs.scale.y * ft.attrs.size.y >= ft.opts.range.scale[0] && ft.attrs.scale.y * ft.attrs.size.y <= ft.opts.range.scale[1]
            };
        }

        function keepRatio(axis) {
            if (axis === 'x') {
                ft.attrs.scale.y = ft.attrs.scale.x / ft.attrs.ratio;
            } else {
                ft.attrs.scale.x = ft.attrs.scale.y * ft.attrs.ratio;
            }
        }

        /**
         * Recursive copy of object.
         */
        function cloneObj(obj) {
            var i, clone = {};
            for (i in obj) {
                clone[i] = typeof obj[i] === 'object' ? cloneObj(obj[i]) : obj[i];
            }
            return clone;
        }

        var timeout = false;

        /**
         * Call callback asynchronously for better performance
         */
        function asyncCallback(e) {
            if (!ft.callback) {
                return;
            }
            // Remove empty values
            var events = [];

            e.map(function(e, i) {
                if (e) {
                    events.push(e);
                }
            });

            clearTimeout(timeout);

            timeout = setTimeout(function() {
                if (ft.callback) {
                    ft.callback(ft, events);
                }
            }, 1);
        }

        ft.updateHandles();

        // Enable method chaining
        return ft;
    };
});


/***/ }),

/***/ "./src/app/engine2d/side-menu2d/side-menu2d.component.css":
/*!****************************************************************!*\
  !*** ./src/app/engine2d/side-menu2d/side-menu2d.component.css ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".mat-tab-icon {\r\n  width:50px;\r\n  height: 50px;\r\n  background-position: center;\r\n  background-repeat: no-repeat;\r\n  background-size:50%;\r\n}\r\n\r\n/* all icon images are downloaded from Angular Materials Design\r\nhttps://material.io/tools/icons/?style=baseline */\r\n\r\n.image_tab {\r\n  background-image: url('round-photo-24px.svg');\r\n}\r\n\r\n.crop_tab {\r\n  background-image: url('round-crop-24px.svg');\r\n}\r\n\r\n.filter_tab {\r\n  background-image: url('round-tune-24px.svg');\r\n}\r\n\r\n.text_tab {\r\n  background-image: url('round-title-24px.svg');\r\n}\r\n\r\n.shape_tab, .add_image, .add_text {\r\n  background-image: url('round-add-24px.svg');\r\n}\r\n\r\n.color_tab {\r\n  background-image: url('round-palette-24px.svg');\r\n}\r\n\r\n.export_image {\r\n  background-image: url('round-vertical_align_bottom-24px.svg');\r\n}\r\n\r\n.rotate_left{\r\n  background-image: url('round-rotate_left-24px.svg');\r\n}\r\n\r\n.rotate_right{\r\n  background-image: url('round-rotate_right-24px.svg');\r\n}\r\n\r\n.reset_image, .delete_text {\r\n  background-image: url('round-clear-24px.svg');\r\n}\r\n\r\n.flip_horizontal{\r\n  background-image: url('round-360-horizontal-24px.svg');\r\n}\r\n\r\n.flip_vertical{\r\n  background-image: url('round-360-vertical-24px.svg');\r\n}\r\n\r\n.bold_text{\r\n  background-image: url('round-format_bold-24px.svg');\r\n}\r\n\r\n.italic_text{\r\n  background-image: url('round-format_italic-24px.svg');\r\n}\r\n\r\n.underline_text{\r\n  background-image: url('round-format_underlined-24px.svg');\r\n}\r\n\r\n/* below shapes icons are from https://www.flaticon.com/packs/shapes-6 created by Pixel perfect */\r\n\r\n/* <div>Icons made by <a href=\"https://www.flaticon.com/authors/pixel-perfect\" title=\"Pixel perfect\">Pixel perfect</a>\r\nfrom <a href=\"https://www.flaticon.com/\" \t\t    title=\"Flaticon\">www.flaticon.com</a>\r\nis licensed by <a href=\"http://creativecommons.org/licenses/by/3.0/\" \t\t    title=\"Creative Commons BY 3.0\" target=\"_blank\">CC 3.0 BY</a></div> */\r\n\r\n.line_shape {\r\n  background-image: url('line.svg');\r\n}\r\n\r\n.curved_line_shape{\r\n  background-image: url('curved-line.svg');\r\n}\r\n\r\n.circle_shape{\r\n  background-image: url('circle.svg');\r\n}\r\n\r\n.rectangle_shape{\r\n  background-image: url('rectangle.svg');\r\n}\r\n\r\n.square_shape{\r\n  background-image: url('square.svg');\r\n}\r\n\r\n.triangle_shape{\r\n  background-image: url('triangle.svg');\r\n}\r\n\r\n.pentagon_shape{\r\n  background-image: url('pentagon.svg');\r\n}\r\n\r\n.star_shape{\r\n  background-image: url('star.svg');\r\n}\r\n\r\n.heart_shape{\r\n  background-image: url('heart.svg');\r\n}\r\n\r\n.menu_options .mat-raised-button{\r\n  margin-bottom: 10px;\r\n}\r\n\r\n/* .mat-tab-group {\r\n  display:flex !important;\r\n  flex-direction: row !important;\r\n  min-height: 100% !important;\r\n} */\r\n\r\n.sidenav-container {\r\n  height: 100%;\r\n  width: 0px;\r\n}\r\n\r\n.sidenav {\r\n  margin-top: 0px;\r\n  width: 300px;\r\n}\r\n\r\n.sidenav .mat-toolbar {\r\n  background: inherit;\r\n}\r\n\r\n.mat-toolbar.mat-primary {\r\n  position: -webkit-sticky;\r\n  position: sticky;\r\n  top: 0;\r\n  /* z-index: 1; */\r\n}\r\n\r\n.mat-tab-label {\r\n  padding: 0 !important;\r\n  min-width: 10px !important;\r\n  max-width: 15px !important;\r\n}\r\n\r\n.mat-tab-labels {\r\n  display:flex;\r\n  flex-direction: row;\r\n  justify-content: space-between !important;\r\n}\r\n\r\n.mat-tab-body, .mat-tab-body-content {\r\n  display:flex;\r\n  flex-direction: column;\r\n  width: 250px;\r\n  height: 100%;\r\n  padding: 5px 5px 5px 0px;\r\n}\r\n\r\n.mat-tab-header {\r\n  width: 50px;\r\n}\r\n\r\n/* .mat-ink-bar {\r\n  position: absolute;\r\n  height: 100% !important;\r\n  width:2px !important;\r\n  transition: .5s cubic-bezier(0,.35,1,.25) !important;\r\n} */\r\n\r\n.mat-ink-bar {\r\n  height: 100%;\r\n  left: 98% !important;\r\n  display: none;\r\n}\r\n\r\n.menu_header {\r\n  text-align: center;\r\n  margin-bottom: 0px;\r\n  font-weight: bold;\r\n}\r\n\r\n.divider {\r\n  display: flex;\r\n  justify-content: center;\r\n}\r\n\r\n.mat-divider {\r\n  width: 80%;\r\n}\r\n\r\n.image_buttons {\r\n  display: flex;\r\n  flex-direction: row;\r\n  flex-wrap: wrap;\r\n  justify-content: space-around;\r\n}\r\n\r\n*:focus {\r\n  outline: none !important;\r\n}\r\n\r\n.filter_wrapper p {\r\n  margin-top: 5px;\r\n  margin-bottom: 0px;\r\n  text-align: center;\r\n}\r\n\r\n.filter_sliders {\r\n  margin-left: 5px;\r\n  width: 230px;\r\n}\r\n\r\n.menu_component {\r\n  display: flex;\r\n  flex-direction: column;\r\n}\r\n\r\n.menu_options {\r\n  display: flex;\r\n  flex-direction: row;\r\n  flex-wrap: wrap;\r\n  justify-content: space-evenly;\r\n  align-items: center;\r\n  margin-top: 10px;\r\n  margin-bottom: 30px;\r\n}\r\n\r\n.menu_options input, .menu_options .mat-form-field-infix{\r\n  width: 90px;\r\n}\r\n\r\n.menu_reset {\r\n  display: flex;\r\n  justify-content: center;\r\n  margin-top: 10px;\r\n}\r\n\r\n.divider.reset {\r\n  margin-top: 100px;\r\n}\r\n\r\n.color_text {\r\n  display: flex;\r\n  justify-content: center;\r\n  margin-bottom: 0px;\r\n}\r\n\r\n.mat-tab-label-container {\r\n  background-color: #cfd8dc;\r\n}\r\n\r\n.mat-tab-body-wrapper {\r\n  background-color: #f5f5f5;\r\n}\r\n\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvZW5naW5lMmQvc2lkZS1tZW51MmQvc2lkZS1tZW51MmQuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLFVBQVU7RUFDVixZQUFZO0VBQ1osMkJBQTJCO0VBQzNCLDRCQUE0QjtFQUM1QixtQkFBbUI7QUFDckI7O0FBRUE7aURBQ2lEOztBQUVqRDtFQUNFLDZDQUFpRTtBQUNuRTs7QUFFQTtFQUNFLDRDQUFnRTtBQUNsRTs7QUFFQTtFQUNFLDRDQUFnRTtBQUNsRTs7QUFFQTtFQUNFLDZDQUFpRTtBQUNuRTs7QUFFQTtFQUNFLDJDQUErRDtBQUNqRTs7QUFFQTtFQUNFLCtDQUFtRTtBQUNyRTs7QUFFQTtFQUNFLDZEQUFpRjtBQUNuRjs7QUFFQTtFQUNFLG1EQUF1RTtBQUN6RTs7QUFFQTtFQUNFLG9EQUF3RTtBQUMxRTs7QUFFQTtFQUNFLDZDQUFpRTtBQUNuRTs7QUFFQTtFQUNFLHNEQUEwRTtBQUM1RTs7QUFFQTtFQUNFLG9EQUF3RTtBQUMxRTs7QUFFQTtFQUNFLG1EQUErRTtBQUNqRjs7QUFFQTtFQUNFLHFEQUFpRjtBQUNuRjs7QUFFQTtFQUNFLHlEQUFxRjtBQUN2Rjs7QUFFQSxpR0FBaUc7O0FBQ2pHOztnSkFFZ0o7O0FBQ2hKO0VBQ0UsaUNBQThEO0FBQ2hFOztBQUVBO0VBQ0Usd0NBQXFFO0FBQ3ZFOztBQUdBO0VBQ0UsbUNBQWdFO0FBQ2xFOztBQUVBO0VBQ0Usc0NBQW1FO0FBQ3JFOztBQUVBO0VBQ0UsbUNBQWdFO0FBQ2xFOztBQUVBO0VBQ0UscUNBQWtFO0FBQ3BFOztBQUVBO0VBQ0UscUNBQWtFO0FBQ3BFOztBQUVBO0VBQ0UsaUNBQThEO0FBQ2hFOztBQUVBO0VBQ0Usa0NBQStEO0FBQ2pFOztBQUVBO0VBQ0UsbUJBQW1CO0FBQ3JCOztBQUdBOzs7O0dBSUc7O0FBRUg7RUFDRSxZQUFZO0VBQ1osVUFBVTtBQUNaOztBQUVBO0VBQ0UsZUFBZTtFQUNmLFlBQVk7QUFDZDs7QUFFQTtFQUNFLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLHdCQUFnQjtFQUFoQixnQkFBZ0I7RUFDaEIsTUFBTTtFQUNOLGdCQUFnQjtBQUNsQjs7QUFFQTtFQUNFLHFCQUFxQjtFQUNyQiwwQkFBMEI7RUFDMUIsMEJBQTBCO0FBQzVCOztBQUVBO0VBQ0UsWUFBWTtFQUNaLG1CQUFtQjtFQUNuQix5Q0FBeUM7QUFDM0M7O0FBRUE7RUFDRSxZQUFZO0VBQ1osc0JBQXNCO0VBQ3RCLFlBQVk7RUFDWixZQUFZO0VBQ1osd0JBQXdCO0FBQzFCOztBQUdBO0VBQ0UsV0FBVztBQUNiOztBQUVBOzs7OztHQUtHOztBQUVIO0VBQ0UsWUFBWTtFQUNaLG9CQUFvQjtFQUNwQixhQUFhO0FBQ2Y7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsa0JBQWtCO0VBQ2xCLGlCQUFpQjtBQUNuQjs7QUFFQTtFQUNFLGFBQWE7RUFDYix1QkFBdUI7QUFDekI7O0FBRUE7RUFDRSxVQUFVO0FBQ1o7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsbUJBQW1CO0VBQ25CLGVBQWU7RUFDZiw2QkFBNkI7QUFDL0I7O0FBRUE7RUFDRSx3QkFBd0I7QUFDMUI7O0FBRUE7RUFDRSxlQUFlO0VBQ2Ysa0JBQWtCO0VBQ2xCLGtCQUFrQjtBQUNwQjs7QUFHQTtFQUNFLGdCQUFnQjtFQUNoQixZQUFZO0FBQ2Q7O0FBRUE7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0FBQ3hCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLG1CQUFtQjtFQUNuQixlQUFlO0VBQ2YsNkJBQTZCO0VBQzdCLG1CQUFtQjtFQUNuQixnQkFBZ0I7RUFDaEIsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UsV0FBVztBQUNiOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHVCQUF1QjtFQUN2QixnQkFBZ0I7QUFDbEI7O0FBRUE7RUFDRSxpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsdUJBQXVCO0VBQ3ZCLGtCQUFrQjtBQUNwQjs7QUFHQTtFQUNFLHlCQUF5QjtBQUMzQjs7QUFFQTtFQUNFLHlCQUF5QjtBQUMzQiIsImZpbGUiOiJzcmMvYXBwL2VuZ2luZTJkL3NpZGUtbWVudTJkL3NpZGUtbWVudTJkLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIubWF0LXRhYi1pY29uIHtcclxuICB3aWR0aDo1MHB4O1xyXG4gIGhlaWdodDogNTBweDtcclxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXI7XHJcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcclxuICBiYWNrZ3JvdW5kLXNpemU6NTAlO1xyXG59XHJcblxyXG4vKiBhbGwgaWNvbiBpbWFnZXMgYXJlIGRvd25sb2FkZWQgZnJvbSBBbmd1bGFyIE1hdGVyaWFscyBEZXNpZ25cclxuaHR0cHM6Ly9tYXRlcmlhbC5pby90b29scy9pY29ucy8/c3R5bGU9YmFzZWxpbmUgKi9cclxuXHJcbi5pbWFnZV90YWIge1xyXG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybCgnLi4vLi4vLi4vYXNzZXRzL2ltZy9yb3VuZC1waG90by0yNHB4LnN2ZycpO1xyXG59XHJcblxyXG4uY3JvcF90YWIge1xyXG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybCgnLi4vLi4vLi4vYXNzZXRzL2ltZy9yb3VuZC1jcm9wLTI0cHguc3ZnJyk7XHJcbn1cclxuXHJcbi5maWx0ZXJfdGFiIHtcclxuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJy4uLy4uLy4uL2Fzc2V0cy9pbWcvcm91bmQtdHVuZS0yNHB4LnN2ZycpO1xyXG59XHJcblxyXG4udGV4dF90YWIge1xyXG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybCgnLi4vLi4vLi4vYXNzZXRzL2ltZy9yb3VuZC10aXRsZS0yNHB4LnN2ZycpO1xyXG59XHJcblxyXG4uc2hhcGVfdGFiLCAuYWRkX2ltYWdlLCAuYWRkX3RleHQge1xyXG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybCgnLi4vLi4vLi4vYXNzZXRzL2ltZy9yb3VuZC1hZGQtMjRweC5zdmcnKTtcclxufVxyXG5cclxuLmNvbG9yX3RhYiB7XHJcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCcuLi8uLi8uLi9hc3NldHMvaW1nL3JvdW5kLXBhbGV0dGUtMjRweC5zdmcnKTtcclxufVxyXG5cclxuLmV4cG9ydF9pbWFnZSB7XHJcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCcuLi8uLi8uLi9hc3NldHMvaW1nL3JvdW5kLXZlcnRpY2FsX2FsaWduX2JvdHRvbS0yNHB4LnN2ZycpO1xyXG59XHJcblxyXG4ucm90YXRlX2xlZnR7XHJcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCcuLi8uLi8uLi9hc3NldHMvaW1nL3JvdW5kLXJvdGF0ZV9sZWZ0LTI0cHguc3ZnJyk7XHJcbn1cclxuXHJcbi5yb3RhdGVfcmlnaHR7XHJcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCcuLi8uLi8uLi9hc3NldHMvaW1nL3JvdW5kLXJvdGF0ZV9yaWdodC0yNHB4LnN2ZycpO1xyXG59XHJcblxyXG4ucmVzZXRfaW1hZ2UsIC5kZWxldGVfdGV4dCB7XHJcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCcuLi8uLi8uLi9hc3NldHMvaW1nL3JvdW5kLWNsZWFyLTI0cHguc3ZnJyk7XHJcbn1cclxuXHJcbi5mbGlwX2hvcml6b250YWx7XHJcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCcuLi8uLi8uLi9hc3NldHMvaW1nL3JvdW5kLTM2MC1ob3Jpem9udGFsLTI0cHguc3ZnJyk7XHJcbn1cclxuXHJcbi5mbGlwX3ZlcnRpY2Fse1xyXG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybCgnLi4vLi4vLi4vYXNzZXRzL2ltZy9yb3VuZC0zNjAtdmVydGljYWwtMjRweC5zdmcnKTtcclxufVxyXG5cclxuLmJvbGRfdGV4dHtcclxuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJy4uLy4uLy4uL2Fzc2V0cy9pbWcvMkQtdGV4dC9yb3VuZC1mb3JtYXRfYm9sZC0yNHB4LnN2ZycpO1xyXG59XHJcblxyXG4uaXRhbGljX3RleHR7XHJcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCcuLi8uLi8uLi9hc3NldHMvaW1nLzJELXRleHQvcm91bmQtZm9ybWF0X2l0YWxpYy0yNHB4LnN2ZycpO1xyXG59XHJcblxyXG4udW5kZXJsaW5lX3RleHR7XHJcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCcuLi8uLi8uLi9hc3NldHMvaW1nLzJELXRleHQvcm91bmQtZm9ybWF0X3VuZGVybGluZWQtMjRweC5zdmcnKTtcclxufVxyXG5cclxuLyogYmVsb3cgc2hhcGVzIGljb25zIGFyZSBmcm9tIGh0dHBzOi8vd3d3LmZsYXRpY29uLmNvbS9wYWNrcy9zaGFwZXMtNiBjcmVhdGVkIGJ5IFBpeGVsIHBlcmZlY3QgKi9cclxuLyogPGRpdj5JY29ucyBtYWRlIGJ5IDxhIGhyZWY9XCJodHRwczovL3d3dy5mbGF0aWNvbi5jb20vYXV0aG9ycy9waXhlbC1wZXJmZWN0XCIgdGl0bGU9XCJQaXhlbCBwZXJmZWN0XCI+UGl4ZWwgcGVyZmVjdDwvYT5cclxuZnJvbSA8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmxhdGljb24uY29tL1wiIFx0XHQgICAgdGl0bGU9XCJGbGF0aWNvblwiPnd3dy5mbGF0aWNvbi5jb208L2E+XHJcbmlzIGxpY2Vuc2VkIGJ5IDxhIGhyZWY9XCJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS8zLjAvXCIgXHRcdCAgICB0aXRsZT1cIkNyZWF0aXZlIENvbW1vbnMgQlkgMy4wXCIgdGFyZ2V0PVwiX2JsYW5rXCI+Q0MgMy4wIEJZPC9hPjwvZGl2PiAqL1xyXG4ubGluZV9zaGFwZSB7XHJcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCcuLi8uLi8uLi9hc3NldHMvaW1nLzJELXNoYXBlL2xpbmUuc3ZnJyk7XHJcbn1cclxuXHJcbi5jdXJ2ZWRfbGluZV9zaGFwZXtcclxuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJy4uLy4uLy4uL2Fzc2V0cy9pbWcvMkQtc2hhcGUvY3VydmVkLWxpbmUuc3ZnJyk7XHJcbn1cclxuXHJcblxyXG4uY2lyY2xlX3NoYXBle1xyXG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybCgnLi4vLi4vLi4vYXNzZXRzL2ltZy8yRC1zaGFwZS9jaXJjbGUuc3ZnJyk7XHJcbn1cclxuXHJcbi5yZWN0YW5nbGVfc2hhcGV7XHJcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCcuLi8uLi8uLi9hc3NldHMvaW1nLzJELXNoYXBlL3JlY3RhbmdsZS5zdmcnKTtcclxufVxyXG5cclxuLnNxdWFyZV9zaGFwZXtcclxuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJy4uLy4uLy4uL2Fzc2V0cy9pbWcvMkQtc2hhcGUvc3F1YXJlLnN2ZycpO1xyXG59XHJcblxyXG4udHJpYW5nbGVfc2hhcGV7XHJcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCcuLi8uLi8uLi9hc3NldHMvaW1nLzJELXNoYXBlL3RyaWFuZ2xlLnN2ZycpO1xyXG59XHJcblxyXG4ucGVudGFnb25fc2hhcGV7XHJcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCcuLi8uLi8uLi9hc3NldHMvaW1nLzJELXNoYXBlL3BlbnRhZ29uLnN2ZycpO1xyXG59XHJcblxyXG4uc3Rhcl9zaGFwZXtcclxuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJy4uLy4uLy4uL2Fzc2V0cy9pbWcvMkQtc2hhcGUvc3Rhci5zdmcnKTtcclxufVxyXG5cclxuLmhlYXJ0X3NoYXBle1xyXG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybCgnLi4vLi4vLi4vYXNzZXRzL2ltZy8yRC1zaGFwZS9oZWFydC5zdmcnKTtcclxufVxyXG5cclxuLm1lbnVfb3B0aW9ucyAubWF0LXJhaXNlZC1idXR0b257XHJcbiAgbWFyZ2luLWJvdHRvbTogMTBweDtcclxufVxyXG5cclxuXHJcbi8qIC5tYXQtdGFiLWdyb3VwIHtcclxuICBkaXNwbGF5OmZsZXggIWltcG9ydGFudDtcclxuICBmbGV4LWRpcmVjdGlvbjogcm93ICFpbXBvcnRhbnQ7XHJcbiAgbWluLWhlaWdodDogMTAwJSAhaW1wb3J0YW50O1xyXG59ICovXHJcblxyXG4uc2lkZW5hdi1jb250YWluZXIge1xyXG4gIGhlaWdodDogMTAwJTtcclxuICB3aWR0aDogMHB4O1xyXG59XHJcblxyXG4uc2lkZW5hdiB7XHJcbiAgbWFyZ2luLXRvcDogMHB4O1xyXG4gIHdpZHRoOiAzMDBweDtcclxufVxyXG5cclxuLnNpZGVuYXYgLm1hdC10b29sYmFyIHtcclxuICBiYWNrZ3JvdW5kOiBpbmhlcml0O1xyXG59XHJcblxyXG4ubWF0LXRvb2xiYXIubWF0LXByaW1hcnkge1xyXG4gIHBvc2l0aW9uOiBzdGlja3k7XHJcbiAgdG9wOiAwO1xyXG4gIC8qIHotaW5kZXg6IDE7ICovXHJcbn1cclxuXHJcbi5tYXQtdGFiLWxhYmVsIHtcclxuICBwYWRkaW5nOiAwICFpbXBvcnRhbnQ7XHJcbiAgbWluLXdpZHRoOiAxMHB4ICFpbXBvcnRhbnQ7XHJcbiAgbWF4LXdpZHRoOiAxNXB4ICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5tYXQtdGFiLWxhYmVscyB7XHJcbiAgZGlzcGxheTpmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5tYXQtdGFiLWJvZHksIC5tYXQtdGFiLWJvZHktY29udGVudCB7XHJcbiAgZGlzcGxheTpmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgd2lkdGg6IDI1MHB4O1xyXG4gIGhlaWdodDogMTAwJTtcclxuICBwYWRkaW5nOiA1cHggNXB4IDVweCAwcHg7XHJcbn1cclxuXHJcblxyXG4ubWF0LXRhYi1oZWFkZXIge1xyXG4gIHdpZHRoOiA1MHB4O1xyXG59XHJcblxyXG4vKiAubWF0LWluay1iYXIge1xyXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICBoZWlnaHQ6IDEwMCUgIWltcG9ydGFudDtcclxuICB3aWR0aDoycHggIWltcG9ydGFudDtcclxuICB0cmFuc2l0aW9uOiAuNXMgY3ViaWMtYmV6aWVyKDAsLjM1LDEsLjI1KSAhaW1wb3J0YW50O1xyXG59ICovXHJcblxyXG4ubWF0LWluay1iYXIge1xyXG4gIGhlaWdodDogMTAwJTtcclxuICBsZWZ0OiA5OCUgIWltcG9ydGFudDtcclxuICBkaXNwbGF5OiBub25lO1xyXG59XHJcblxyXG4ubWVudV9oZWFkZXIge1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICBtYXJnaW4tYm90dG9tOiAwcHg7XHJcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbn1cclxuXHJcbi5kaXZpZGVyIHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG59XHJcblxyXG4ubWF0LWRpdmlkZXIge1xyXG4gIHdpZHRoOiA4MCU7XHJcbn1cclxuXHJcbi5pbWFnZV9idXR0b25zIHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgZmxleC13cmFwOiB3cmFwO1xyXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xyXG59XHJcblxyXG4qOmZvY3VzIHtcclxuICBvdXRsaW5lOiBub25lICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5maWx0ZXJfd3JhcHBlciBwIHtcclxuICBtYXJnaW4tdG9wOiA1cHg7XHJcbiAgbWFyZ2luLWJvdHRvbTogMHB4O1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxufVxyXG5cclxuXHJcbi5maWx0ZXJfc2xpZGVycyB7XHJcbiAgbWFyZ2luLWxlZnQ6IDVweDtcclxuICB3aWR0aDogMjMwcHg7XHJcbn1cclxuXHJcbi5tZW51X2NvbXBvbmVudCB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG59XHJcblxyXG4ubWVudV9vcHRpb25zIHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgZmxleC13cmFwOiB3cmFwO1xyXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgbWFyZ2luLXRvcDogMTBweDtcclxuICBtYXJnaW4tYm90dG9tOiAzMHB4O1xyXG59XHJcblxyXG4ubWVudV9vcHRpb25zIGlucHV0LCAubWVudV9vcHRpb25zIC5tYXQtZm9ybS1maWVsZC1pbmZpeHtcclxuICB3aWR0aDogOTBweDtcclxufVxyXG5cclxuLm1lbnVfcmVzZXQge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgbWFyZ2luLXRvcDogMTBweDtcclxufVxyXG5cclxuLmRpdmlkZXIucmVzZXQge1xyXG4gIG1hcmdpbi10b3A6IDEwMHB4O1xyXG59XHJcblxyXG4uY29sb3JfdGV4dCB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICBtYXJnaW4tYm90dG9tOiAwcHg7XHJcbn1cclxuXHJcblxyXG4ubWF0LXRhYi1sYWJlbC1jb250YWluZXIge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNjZmQ4ZGM7XHJcbn1cclxuXHJcbi5tYXQtdGFiLWJvZHktd3JhcHBlciB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y1ZjVmNTtcclxufVxyXG4iXX0= */"

/***/ }),

/***/ "./src/app/engine2d/side-menu2d/side-menu2d.component.html":
/*!*****************************************************************!*\
  !*** ./src/app/engine2d/side-menu2d/side-menu2d.component.html ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-sidenav-container class=\"sidenav-container\">\r\n  <mat-sidenav #drawer class=\"sidenav\" fixedInViewport=\"true\"\r\n      [attr.role]=\"'dialog'\"\r\n      [mode]=\"'side'\"\r\n      [opened]=\"'true'\"\r\n      position=\"start\">\r\n\r\n    <!-- <mat-tab-group mat-align-tabs=\"center\" vertical> -->\r\n    <mat-tab-group>\r\n        <mat-tab>\r\n          <ng-template mat-tab-label>\r\n            <div class=\"mat-tab-icon image_tab\"></div>\r\n          </ng-template>\r\n          <div><p class=\"menu_header\">Image File</p></div>\r\n          <div class=\"divider\"><mat-divider></mat-divider></div>\r\n          <div class=\"image_buttons menu_options\">\r\n              <button mat-raised-button (click)=\"onImageFileAdd($event)\">\r\n                <mat-icon aria-label=\"add_image\" class=\"add_image\"></mat-icon>\r\n                Add\r\n              </button>\r\n\r\n              <button mat-raised-button (click)=\"onImageExport($event)\">\r\n                  <mat-icon aria-label=\"add_image\" class=\"export_image\"></mat-icon>\r\n                  Export\r\n              </button>\r\n          </div>\r\n        </mat-tab>\r\n\r\n        <mat-tab>\r\n            <ng-template mat-tab-label><div class=\"mat-tab-icon crop_tab\"></div></ng-template>\r\n              <div class=\"menu_component\">\r\n                  <p class=\"menu_header\">Rotate</p>\r\n                  <div class=\"divider\"><mat-divider></mat-divider></div>\r\n                  <div class=\"menu_options\">\r\n                    <button mat-raised-button (click)=\"onRotate($event, true)\">\r\n                        <mat-icon aria-label=\"rotate_image\" class=\"rotate_left\"></mat-icon>\r\n                        Left\r\n                    </button>\r\n                    <button mat-raised-button (click)=\"onRotate($event, false)\">\r\n                        <mat-icon aria-label=\"rotate_image\" class=\"rotate_right\"></mat-icon>\r\n                        Right\r\n                    </button>\r\n                  </div>\r\n              </div>\r\n\r\n              <div class=\"menu_component\">\r\n                  <p class=\"menu_header\">Flip</p>\r\n                  <div class=\"divider\"><mat-divider></mat-divider></div>\r\n                  <div class=\"menu_options flip_options\">\r\n                    <button mat-raised-button (click)=\"onObjectFlip($event, true)\">\r\n                        <mat-icon aria-label=\"flip_image\" class=\"flip_horizontal\"></mat-icon>\r\n                        Horizontal\r\n                    </button>\r\n                    <button mat-raised-button (click)=\"onObjectFlip($event, false)\">\r\n                        <mat-icon aria-label=\"flip_image\" class=\"flip_vertical\"></mat-icon>\r\n                        Vertical\r\n                    </button>\r\n                  </div>\r\n              </div>\r\n        </mat-tab>\r\n\r\n        <mat-tab>\r\n            <ng-template mat-tab-label><div class=\"mat-tab-icon filter_tab\"></div></ng-template>\r\n            <div class=\"menu_component\">\r\n                <p class=\"menu_header\">Filter</p>\r\n                <div class=\"divider\"><mat-divider></mat-divider></div>\r\n                  <div class=\"menu_options\">\r\n                      <button mat-raised-button (click)=\"onBlurFilterApply($event)\">\r\n                          Blur\r\n                      </button>\r\n                      <button mat-raised-button (click)=\"onSepiaFilterApply($event)\">\r\n                          Sepia\r\n                      </button>\r\n                  </div>\r\n\r\n                  <div class=\"menu_options\">\r\n                      <button mat-raised-button (click)=\"onGrayScaleFilterApply($event)\">\r\n                          Grayscale\r\n                      </button>\r\n                      <button mat-raised-button (click)=\"onHueRotateFilterApply($event)\">\r\n                          HueRotate\r\n                      </button>\r\n                  </div>\r\n\r\n                  <div class=\"menu_options\">\r\n                      <button mat-raised-button (click)=\"onInvertFilterApply($event)\">\r\n                          Invert\r\n                      </button>\r\n                      <button mat-raised-button (click)=\"onShadowFilterApply($event)\">\r\n                          Shadow\r\n                      </button>\r\n                  </div>\r\n\r\n                  <div class=\"menu_options\">\r\n                      <button mat-raised-button (click)=\"onSaturateFilterApply($event)\">\r\n                          Saturate\r\n                      </button>\r\n\r\n                      <button mat-raised-button (click)=\"onNoFilterApply($event)\">\r\n                            Default\r\n                      </button>\r\n                  </div>\r\n            </div>\r\n        </mat-tab>\r\n\r\n        <mat-tab>\r\n            <ng-template mat-tab-label><div class=\"mat-tab-icon text_tab\"></div></ng-template>\r\n            <div class=\"menu_component\">\r\n                <p class=\"menu_header\">Text</p>\r\n                <div class=\"divider\"><mat-divider></mat-divider></div>\r\n                <div class=\"menu_options\">\r\n                  <button mat-raised-button (click)=\"onAddText($event)\">\r\n                      <mat-icon aria-label=\"add_text\" class=\"add_text\"></mat-icon>\r\n                      TextBox\r\n                  </button>\r\n                  <button mat-raised-button (click)=\"onDeleteText($event)\">\r\n                      <mat-icon aria-label=\"delete_text\" class=\"delete_text\"></mat-icon>\r\n                      TextBox\r\n                  </button>\r\n\r\n                  <button mat-raised-button (click)=\"onToogleBoldText($event)\">\r\n                      <mat-icon aria-label=\"bold_text\" class=\"bold_text\"></mat-icon>\r\n                  </button>\r\n                  <button mat-raised-button (click)=\"onToogleItalics($event)\">\r\n                      <mat-icon aria-label=\"italic_text\" class=\"italic_text\"></mat-icon>\r\n                  </button>\r\n                  <button mat-raised-button (click)=\"onToogleUnderline($event)\">\r\n                      <mat-icon aria-label=\"underline_text\" class=\"underline_text\"></mat-icon>\r\n                  </button>\r\n                </div>\r\n            </div>\r\n        </mat-tab>\r\n\r\n        <mat-tab>\r\n            <ng-template mat-tab-label><div class=\"mat-tab-icon shape_tab\"></div></ng-template>\r\n            <div class=\"menu_component\">\r\n                <p class=\"menu_header\">Shape</p>\r\n                <div class=\"divider\"><mat-divider></mat-divider></div>\r\n\r\n                <div class=\"menu_options\">\r\n                    <button mat-raised-button (click)=\"onLineInsert($event)\">\r\n                        <mat-icon aria-label=\"line_shape\" class=\"line_shape\"></mat-icon>\r\n                    </button>\r\n\r\n                    <button mat-raised-button (click)=\"onCurveInsert($event)\">\r\n                        <mat-icon aria-label=\"curved_line_shape\" class=\"curved_line_shape\"></mat-icon>\r\n                    </button>\r\n\r\n                    <button mat-raised-button (click)=\"onCircleInsert($event)\">\r\n                        <mat-icon aria-label=\"circle_shape\" class=\"circle_shape\"></mat-icon>\r\n                    </button>\r\n\r\n                    <button mat-raised-button (click)=\"onRecInsert($event)\">\r\n                        <mat-icon aria-label=\"rectangle_shape\" class=\"rectangle_shape\"></mat-icon>\r\n                    </button>\r\n\r\n                    <button mat-raised-button (click)=\"onSquareInsert($event)\">\r\n                        <mat-icon aria-label=\"square_shape\" class=\"square_shape\"></mat-icon>\r\n                    </button>\r\n\r\n                    <button mat-raised-button (click)=\"onHeartInsert($event)\">\r\n                        <mat-icon aria-label=\"heart_shape\" class=\"heart_shape\"></mat-icon>\r\n                    </button>\r\n\r\n                    <button mat-raised-button (click)=\"onTriangleInsert($event)\">\r\n                        <mat-icon aria-label=\"triangle_shape\" class=\"triangle_shape\"></mat-icon>\r\n                    </button>\r\n\r\n                    <button mat-raised-button (click)=\"onPentagonInsert($event)\">\r\n                            <mat-icon aria-label=\"pentagon_shape\" class=\"pentagon_shape\"></mat-icon>\r\n                    </button>\r\n\r\n                    <button mat-raised-button (click)=\"onStarInsert($event)\">\r\n                        <mat-icon aria-label=\"star_shape\" class=\"star_shape\"></mat-icon>\r\n                    </button>\r\n                </div>\r\n            </div>\r\n        </mat-tab>\r\n        <mat-tab>\r\n            <ng-template mat-tab-label><div class=\"mat-tab-icon color_tab\"></div></ng-template>\r\n            <div class=\"menu_component\">\r\n                <p class=\"menu_header\">Color</p>\r\n                <div class=\"divider\"><mat-divider></mat-divider></div>\r\n                <div class=\"menu_options\">\r\n                    <p class=\"color_text\">Pick a color:</p>\r\n                    <input class=\"color_picker\" [cpOutputFormat]=\"'hex'\"\r\n                    [value]=\"color\" [colorPicker]=\"color\"\r\n                    [cpUseRootViewContainer]=\"true\" [style.background]=\"color\"\r\n                    (colorPickerChange)=\"onSelectedColorChange($event)\"/>\r\n                </div>\r\n            </div>\r\n        </mat-tab>\r\n    </mat-tab-group>\r\n  </mat-sidenav>\r\n</mat-sidenav-container>\r\n"

/***/ }),

/***/ "./src/app/engine2d/side-menu2d/side-menu2d.component.ts":
/*!***************************************************************!*\
  !*** ./src/app/engine2d/side-menu2d/side-menu2d.component.ts ***!
  \***************************************************************/
/*! exports provided: SideMenu2dComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SideMenu2dComponent", function() { return SideMenu2dComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _engine2d_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../engine2d.component */ "./src/app/engine2d/engine2d.component.ts");
/* harmony import */ var snapsvg_cjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! snapsvg-cjs */ "./node_modules/snapsvg-cjs/dist/snap.svg-cjs.js");
/* harmony import */ var snapsvg_cjs__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(snapsvg_cjs__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _js_snap_svg_free_transform_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../js/snap.svg.free_transform.js */ "./src/app/engine2d/js/snap.svg.free_transform.js");
/* harmony import */ var _js_snap_svg_free_transform_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_js_snap_svg_free_transform_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var save_svg_as_png__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! save-svg-as-png */ "./node_modules/save-svg-as-png/lib/saveSvgAsPng.js");
/* harmony import */ var save_svg_as_png__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(save_svg_as_png__WEBPACK_IMPORTED_MODULE_5__);






var SideMenu2dComponent = /** @class */ (function () {
    function SideMenu2dComponent(comp) {
        this.comp = comp;
        this.color = '#000000';
        this.engServ = this.comp.getEngineService();
    }
    SideMenu2dComponent.prototype.ngOnInit = function () {
    };
    // getters below
    ////////////////////////////////////////
    // event handlers below
    // inserts image from file
    SideMenu2dComponent.prototype.onImageFileAdd = function (event) {
        var _this = this;
        // creates form for upload
        var link = document.createElement('input');
        link.type = "file";
        // adds event listener to upload form
        link.addEventListener('change', function () {
            // uploads image and assigns to image
            if (link.files && link.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var img = _this.engServ.insertImage(e.target.result);
                    _this.engServ.addSelectionEvent(img);
                };
                reader.readAsDataURL(link.files[0]);
                // removes upload form
                document.body.removeChild(link);
            }
            else {
                return;
            }
        });
        document.body.appendChild(link);
        link.click();
    };
    // exports image to png
    SideMenu2dComponent.prototype.onImageExport = function (event) {
        Object(save_svg_as_png__WEBPACK_IMPORTED_MODULE_5__["saveSvgAsPng"])(this.engServ.getSVGElement(), "save.png");
    };
    // applies filter to selected elements given filter f
    SideMenu2dComponent.prototype.apply_filter_selected = function (f) {
        var _this = this;
        this.engServ.getSelectedObjects().forEach(function (ele) {
            ele.attr({ filter: _this.engServ.getSVGCanvas().filter(f) });
        });
    };
    // applies blue filter to selected elements
    SideMenu2dComponent.prototype.onBlurFilterApply = function (event) {
        var f = Snap.filter.blur(5, 10);
        this.apply_filter_selected(f);
    };
    // applies sepia filter to selected elements
    SideMenu2dComponent.prototype.onSepiaFilterApply = function (event) {
        var f = Snap.filter.sepia(0.8);
        this.apply_filter_selected(f);
    };
    // applies gray scale filter to selected elements
    SideMenu2dComponent.prototype.onGrayScaleFilterApply = function (event) {
        var f = Snap.filter.grayscale(0.8);
        this.apply_filter_selected(f);
    };
    // removes filters
    SideMenu2dComponent.prototype.onHueRotateFilterApply = function (event) {
        var f = Snap.filter.hueRotate(90);
        this.apply_filter_selected(f);
    };
    // applies invert filter to selected elements
    SideMenu2dComponent.prototype.onInvertFilterApply = function (event) {
        var f = Snap.filter.invert(1.0);
        this.apply_filter_selected(f);
    };
    // applies shadow filter to selected elements
    SideMenu2dComponent.prototype.onShadowFilterApply = function (event) {
        var f = Snap.filter.shadow(0, 2, .3);
        this.apply_filter_selected(f);
    };
    // applies saturate filter to selected elements
    SideMenu2dComponent.prototype.onSaturateFilterApply = function (event) {
        var f = Snap.filter.saturate(0.5);
        this.apply_filter_selected(f);
    };
    // removes filter
    SideMenu2dComponent.prototype.onNoFilterApply = function (event) {
        this.engServ.getSelectedObjects().forEach(function (ele) {
            ele.attr({ filter: null });
        });
    };
    // inserts text
    SideMenu2dComponent.prototype.onAddText = function (event) {
        // Gets text from user
        var inputText = window.prompt("Please enter your text", "Text");
        if (!inputText)
            inputText = "Text";
        // Adds text and text selection event
        var text = this.engServ.getSVGCanvasGroup().text(50, 50, inputText);
        this.engServ.addSelectionEvent(text);
    };
    // on delete text button handler
    SideMenu2dComponent.prototype.onDeleteText = function (event) {
        var selected_objects = this.engServ.getSelectedObjects();
        // unplugs freetranform of each text element and removes each text element from dom
        selected_objects.forEach(function (ele) {
            if (ele.type == "text") {
                ele.freeTransform.unplug();
                ele.remove();
            }
        });
        // removes each text element from selected_objects list
        selected_objects.forEach(function (ele) {
            if (ele.type == "text") {
                selected_objects.splice(selected_objects.indexOf(ele), 1);
            }
        });
    };
    // on font weight bold button click event handler
    SideMenu2dComponent.prototype.onToogleBoldText = function (event) {
        var selected_objects = this.engServ.getSelectedObjects();
        // toogles font weight for each selected text element
        selected_objects.forEach(function (ele) {
            // toogles font weight iff element is text
            if (ele.type == "text") {
                var fontWeight = ele.attr("fontWeight");
                var newFontWeight = (!fontWeight || fontWeight == 400) ? 700 : 400;
                ele.attr({ fontWeight: newFontWeight });
            }
        });
    };
    // toogle text italics button click event handler
    SideMenu2dComponent.prototype.onToogleItalics = function (event) {
        var selected_objects = this.engServ.getSelectedObjects();
        // toogles font style for each selected text element
        selected_objects.forEach(function (ele) {
            // toogles font style iff element is text
            if (ele.type == "text") {
                var fontStyle = ele.attr("fontStyle");
                var newFontStyle = (!fontStyle || fontStyle == "normal") ? "italic" : "normal";
                ele.attr({ fontStyle: newFontStyle });
            }
        });
    };
    // toogle text decoration button click event handler
    SideMenu2dComponent.prototype.onToogleUnderline = function (event) {
        var selected_objects = this.engServ.getSelectedObjects();
        // toogles text decoration for each selected text element
        selected_objects.forEach(function (ele) {
            // toogles text decoration iff element is text
            if (ele.type == "text") {
                var textDecoration = ele.attr("text-decoration");
                var newTextDecoration = (!textDecoration || textDecoration.startsWith("none")) ? "underline" : "none";
                ele.attr({ "text-decoration": newTextDecoration });
            }
        });
    };
    // event handler for line insert button
    SideMenu2dComponent.prototype.onLineInsert = function (event) {
        // inserts line
        var line = this.engServ.getSVGCanvasGroup().line(50, 50, 200, 50).attr({
            cursor: 'move',
            stroke: "#000",
            strokeWidth: 3
        });
        ;
        this.engServ.addSelectionEvent(line);
    };
    // event handler for curve insert button
    SideMenu2dComponent.prototype.onCurveInsert = function (event) {
        // inserts curve
        var curve = this.engServ.getSVGCanvasGroup().path("M100 100c50 30 50 30 100 0").attr({
            cursor: 'move',
            stroke: "#000",
            fill: 'none',
            strokeOpacity: 1,
            strokeWidth: 3
        });
        ;
        this.engServ.addSelectionEvent(curve);
    };
    // event handler for circle insert button
    SideMenu2dComponent.prototype.onCircleInsert = function (event) {
        // inserts circle
        var circle = this.engServ.getSVGCanvasGroup().circle(100, 100, 100).attr({
            cursor: 'move',
            stroke: "#000",
            fill: 'none',
            strokeOpacity: 1,
            strokeWidth: 3
        });
        ;
        ;
        this.engServ.addSelectionEvent(circle);
    };
    // event handler for rectangle insert button
    SideMenu2dComponent.prototype.onRecInsert = function (event) {
        // inserts rectangle
        var rect = this.engServ.getSVGCanvasGroup().rect(100, 100, 300, 100).attr({
            cursor: 'move',
            stroke: "#000",
            fill: 'none',
            strokeOpacity: 1,
            strokeWidth: 3
        });
        ;
        ;
        this.engServ.addSelectionEvent(rect);
    };
    // event handler for square insert button
    SideMenu2dComponent.prototype.onSquareInsert = function (event) {
        // inserts square
        var square = this.engServ.getSVGCanvasGroup().rect(100, 100, 100, 100).attr({
            cursor: 'move',
            stroke: "#000",
            fill: 'none',
            strokeOpacity: 1,
            strokeWidth: 3
        });
        ;
        ;
        this.engServ.addSelectionEvent(square);
    };
    // event handler for heart insert button
    // Heart parametric curve: https://www.quora.com/What-is-the-equation-that-gives-you-a-heart-on-the-graph
    SideMenu2dComponent.prototype.onHeartInsert = function (event) {
        var pathString = "M300 290";
        var i, _x, _y;
        // generates points on the parametric curve for heart and appends to path string
        for (i = 0; i < 101; i += 1) {
            var a = 2 * Math.PI * i / 100;
            _x = 2 * (16 * Math.pow(Math.sin(a), 3)) + 300;
            _y = -2 * (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) + 300;
            _x = (_x < 1e-10 ? 0.0 : _x);
            _y = (_y < 1e-10 ? 0.0 : _y);
            pathString += "L" + _x + " " + _y;
        }
        pathString += "Z";
        // adds curve to snap canvas
        var curve = this.engServ.getSVGCanvasGroup().path(pathString).attr({
            cursor: 'move',
            stroke: "#000",
            fill: 'none',
            strokeOpacity: 1,
            strokeWidth: 3
        });
        // adds event handlers for selection
        this.engServ.addSelectionEvent(curve);
    };
    // event handler for triangle insert button
    SideMenu2dComponent.prototype.onTriangleInsert = function (event) {
        // adds curve
        var triangle = this.engServ.getSVGCanvasGroup().polyline(300, 200, 400, 300, 200, 300, 300, 200).attr({
            cursor: 'move',
            stroke: "#000",
            fill: 'none',
            strokeOpacity: 1,
            strokeWidth: 3
        });
        this.engServ.addSelectionEvent(triangle);
    };
    // event handler for pentagon insert button
    SideMenu2dComponent.prototype.onPentagonInsert = function (event) {
        // adds pentagon using polylines
        var pentagon = this.engServ.getSVGCanvasGroup().polyline(300, 200, 400, 300, 350, 400, 250, 400, 200, 300, 300, 200).attr({
            cursor: 'move',
            stroke: "#000",
            fill: 'none',
            strokeOpacity: 1,
            strokeWidth: 3
        });
        this.engServ.addSelectionEvent(pentagon);
    };
    // event handler for star insert button
    SideMenu2dComponent.prototype.onStarInsert = function (event) {
        // adds star using polylines
        var star = this.engServ.getSVGCanvasGroup().polyline(350, 75, 379, 161, 469, 161, 397, 215, 423, 301, 350, 250, 277, 301, 303, 215, 231, 161, 321, 161, 350, 75).attr({
            cursor: 'move',
            stroke: "#000",
            fill: 'none',
            strokeOpacity: 1,
            strokeWidth: 3
        });
        this.engServ.addSelectionEvent(star);
    };
    // rotation event handler
    SideMenu2dComponent.prototype.onRotate = function (event, left) {
        // gets selected objects
        var selected_objects = this.engServ.getSelectedObjects();
        // applies roation to each selected element
        selected_objects.forEach(function (ele) {
            var ft = ele.freeTransform;
            ft.attrs.rotate -= (left ? 90 : -90);
            ft.apply();
        });
    };
    // Flip event handler
    // Horizontal Flip iff horizontal
    SideMenu2dComponent.prototype.onObjectFlip = function (event, horizontal) {
        // gets selected objects
        var selected_objects = this.engServ.getSelectedObjects();
        // applies flip to each selected element
        selected_objects.forEach(function (ele) {
            var ft = ele.freeTransform;
            if (horizontal) {
                ft.attrs.scale.y *= -1;
            }
            else {
                ft.attrs.scale.x *= -1;
            }
            ft.apply();
        });
    };
    SideMenu2dComponent.prototype.getSelectedColor = function () {
        return ("#000000");
    };
    SideMenu2dComponent.prototype.onSelectedColorChange = function (event) {
        var selected_objects = this.engServ.getSelectedObjects();
        this.color = event;
        selected_objects.forEach(function (ele) {
            ele.attr({ "fill": event });
        });
    };
    SideMenu2dComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            providers: [_engine2d_component__WEBPACK_IMPORTED_MODULE_2__["Engine2DComponent"]],
            selector: 'app-side-menu2d',
            template: __webpack_require__(/*! ./side-menu2d.component.html */ "./src/app/engine2d/side-menu2d/side-menu2d.component.html"),
            styles: [__webpack_require__(/*! ./side-menu2d.component.css */ "./src/app/engine2d/side-menu2d/side-menu2d.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_engine2d_component__WEBPACK_IMPORTED_MODULE_2__["Engine2DComponent"]])
    ], SideMenu2dComponent);
    return SideMenu2dComponent;
}());



/***/ }),

/***/ "./src/app/home/home.component.html":
/*!******************************************!*\
  !*** ./src/app/home/home.component.html ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h1>Hi {{currentUser.firstName}}!</h1>\r\n<p>You're logged in with Angular 7!!</p>\r\n<h3>All registered users:</h3>\r\n<ul>\r\n    <li *ngFor=\"let user of users\">\r\n        {{user.username}} ({{user.firstName}} {{user.lastName}})\r\n        - <a (click)=\"deleteUser(user.id)\" class=\"text-danger\">Delete</a>\r\n    </li>\r\n</ul>"

/***/ }),

/***/ "./src/app/home/home.component.ts":
/*!****************************************!*\
  !*** ./src/app/home/home.component.ts ***!
  \****************************************/
/*! exports provided: HomeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomeComponent", function() { return HomeComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../_services */ "./src/app/_services/index.ts");




var HomeComponent = /** @class */ (function () {
    function HomeComponent(authenticationService, userService) {
        var _this = this;
        this.authenticationService = authenticationService;
        this.userService = userService;
        this.users = [];
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(function (user) {
            _this.currentUser = user;
        });
    }
    HomeComponent.prototype.ngOnInit = function () {
        this.loadAllUsers();
    };
    HomeComponent.prototype.ngOnDestroy = function () {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    };
    HomeComponent.prototype.deleteUser = function (id) {
        var _this = this;
        this.userService.delete(id).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["first"])()).subscribe(function () {
            _this.loadAllUsers();
        });
    };
    HomeComponent.prototype.loadAllUsers = function () {
        var _this = this;
        this.userService.getAll().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["first"])()).subscribe(function (users) {
            _this.users = users;
        });
    };
    HomeComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({ template: __webpack_require__(/*! ./home.component.html */ "./src/app/home/home.component.html") }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services__WEBPACK_IMPORTED_MODULE_3__["AuthenticationService"],
            _services__WEBPACK_IMPORTED_MODULE_3__["UserService"]])
    ], HomeComponent);
    return HomeComponent;
}());



/***/ }),

/***/ "./src/app/home/index.ts":
/*!*******************************!*\
  !*** ./src/app/home/index.ts ***!
  \*******************************/
/*! exports provided: HomeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _home_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./home.component */ "./src/app/home/home.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "HomeComponent", function() { return _home_component__WEBPACK_IMPORTED_MODULE_0__["HomeComponent"]; });




/***/ }),

/***/ "./src/app/login/index.ts":
/*!********************************!*\
  !*** ./src/app/login/index.ts ***!
  \********************************/
/*! exports provided: LoginComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _login_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./login.component */ "./src/app/login/login.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return _login_component__WEBPACK_IMPORTED_MODULE_0__["LoginComponent"]; });




/***/ }),

/***/ "./src/app/login/login.component.css":
/*!*******************************************!*\
  !*** ./src/app/login/login.component.css ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/* login background */\r\n/* http://www.script-tutorials.com/terms-of-use/ */\r\n/* ============================================================================================== \r\nThis copyright notice must be kept untouched in the stylesheet at all times.\r\nThe original version of this stylesheet and the associated (x)html \r\nis available at http://www.script-tutorials.com/night-sky-with-twinkling-stars/\r\nCopyright (c) Script Tutorials. All rights reserved.\r\nThis stylesheet and the associated (x)html may be modified in any way to fit your requirements.\r\n================================================================================================= */\r\n.zIndex1 {\r\n  z-index: 99 !important;\r\n}\r\n* {\r\n  margin: 0;\r\n  padding: 0;\r\n}\r\nheader {\r\n  background-color:rgba(33, 33, 33, 0.9);\r\n  color:#ffffff;\r\n  display:block;\r\n  font: 14px/1.3 Arial,sans-serif;\r\n  height:50px;\r\n  position:relative;\r\n  z-index:5;\r\n}\r\nh2{\r\n  margin-top: 30px;\r\n  text-align: center;\r\n}\r\nheader h2{\r\n  font-size: 22px;\r\n  margin: 0 auto;\r\n  padding: 10px 0;\r\n  width: 80%;\r\n  text-align: center;\r\n}\r\nheader a, a:visited {\r\n  text-decoration:none;\r\n  color:#fcfcfc;\r\n}\r\n@keyframes move-twink-back {\r\n  from {background-position:0 0;}\r\n  to {background-position:-10000px 5000px;}\r\n}\r\n@-webkit-keyframes move-twink-back {\r\n  from {background-position:0 0;}\r\n  to {background-position:-10000px 5000px;}\r\n}\r\n@keyframes move-clouds-back {\r\n  from {background-position:0 0;}\r\n  to {background-position:10000px 0;}\r\n}\r\n@-webkit-keyframes move-clouds-back {\r\n  from {background-position:0 0;}\r\n  to {background-position:10000px 0;}\r\n}\r\n.stars, .twinkling, .clouds {\r\nposition:absolute;\r\ntop:0;\r\nleft:0;\r\nright:0;\r\nbottom:0;\r\nwidth:100%;\r\nheight:100%;\r\ndisplay:block;\r\n}\r\n.stars {\r\nbackground:#000 url('stars.png') repeat top center;\r\nz-index:0;\r\n}\r\n.twinkling{\r\nbackground:transparent url('twinkling.png') repeat top center;\r\nz-index:1;\r\n-webkit-animation:move-twink-back 200s linear infinite;\r\nanimation:move-twink-back 200s linear infinite;\r\n}\r\n.clouds{\r\n  background:transparent url('clouds.png') repeat top center;\r\n  z-index:3;\r\n-webkit-animation:move-clouds-back 200s linear infinite;\r\nanimation:move-clouds-back 200s linear infinite;\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbG9naW4vbG9naW4uY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxxQkFBcUI7QUFDckIsa0RBQWtEO0FBQ2xEOzs7Ozs7bUdBTW1HO0FBQ25HO0VBQ0Usc0JBQXNCO0FBQ3hCO0FBRUE7RUFDRSxTQUFTO0VBQ1QsVUFBVTtBQUNaO0FBQ0E7RUFDRSxzQ0FBc0M7RUFDdEMsYUFBYTtFQUNiLGFBQWE7RUFDYiwrQkFBK0I7RUFDL0IsV0FBVztFQUNYLGlCQUFpQjtFQUNqQixTQUFTO0FBQ1g7QUFDQTtFQUNFLGdCQUFnQjtFQUNoQixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGVBQWU7RUFDZixjQUFjO0VBQ2QsZUFBZTtFQUNmLFVBQVU7RUFDVixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLG9CQUFvQjtFQUNwQixhQUFhO0FBQ2Y7QUFFQTtFQUNFLE1BQU0sdUJBQXVCLENBQUM7RUFDOUIsSUFBSSxtQ0FBbUMsQ0FBQztBQUMxQztBQUNBO0VBQ0UsTUFBTSx1QkFBdUIsQ0FBQztFQUM5QixJQUFJLG1DQUFtQyxDQUFDO0FBQzFDO0FBVUE7RUFDRSxNQUFNLHVCQUF1QixDQUFDO0VBQzlCLElBQUksNkJBQTZCLENBQUM7QUFDcEM7QUFDQTtFQUNFLE1BQU0sdUJBQXVCLENBQUM7RUFDOUIsSUFBSSw2QkFBNkIsQ0FBQztBQUNwQztBQVVBO0FBQ0EsaUJBQWlCO0FBQ2pCLEtBQUs7QUFDTCxNQUFNO0FBQ04sT0FBTztBQUNQLFFBQVE7QUFDUixVQUFVO0FBQ1YsV0FBVztBQUNYLGFBQWE7QUFDYjtBQUVBO0FBQ0Esa0RBQThFO0FBQzlFLFNBQVM7QUFDVDtBQUVBO0FBQ0EsNkRBQXlGO0FBQ3pGLFNBQVM7QUFLVCxzREFBc0Q7QUFDdEQsOENBQThDO0FBQzlDO0FBRUE7RUFDRSwwREFBc0Y7RUFDdEYsU0FBUztBQUtYLHVEQUF1RDtBQUN2RCwrQ0FBK0M7QUFDL0MiLCJmaWxlIjoic3JjL2FwcC9sb2dpbi9sb2dpbi5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLyogbG9naW4gYmFja2dyb3VuZCAqL1xyXG4vKiBodHRwOi8vd3d3LnNjcmlwdC10dXRvcmlhbHMuY29tL3Rlcm1zLW9mLXVzZS8gKi9cclxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSBcclxuVGhpcyBjb3B5cmlnaHQgbm90aWNlIG11c3QgYmUga2VwdCB1bnRvdWNoZWQgaW4gdGhlIHN0eWxlc2hlZXQgYXQgYWxsIHRpbWVzLlxyXG5UaGUgb3JpZ2luYWwgdmVyc2lvbiBvZiB0aGlzIHN0eWxlc2hlZXQgYW5kIHRoZSBhc3NvY2lhdGVkICh4KWh0bWwgXHJcbmlzIGF2YWlsYWJsZSBhdCBodHRwOi8vd3d3LnNjcmlwdC10dXRvcmlhbHMuY29tL25pZ2h0LXNreS13aXRoLXR3aW5rbGluZy1zdGFycy9cclxuQ29weXJpZ2h0IChjKSBTY3JpcHQgVHV0b3JpYWxzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5UaGlzIHN0eWxlc2hlZXQgYW5kIHRoZSBhc3NvY2lhdGVkICh4KWh0bWwgbWF5IGJlIG1vZGlmaWVkIGluIGFueSB3YXkgdG8gZml0IHlvdXIgcmVxdWlyZW1lbnRzLlxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbi56SW5kZXgxIHtcclxuICB6LWluZGV4OiA5OSAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4qIHtcclxuICBtYXJnaW46IDA7XHJcbiAgcGFkZGluZzogMDtcclxufVxyXG5oZWFkZXIge1xyXG4gIGJhY2tncm91bmQtY29sb3I6cmdiYSgzMywgMzMsIDMzLCAwLjkpO1xyXG4gIGNvbG9yOiNmZmZmZmY7XHJcbiAgZGlzcGxheTpibG9jaztcclxuICBmb250OiAxNHB4LzEuMyBBcmlhbCxzYW5zLXNlcmlmO1xyXG4gIGhlaWdodDo1MHB4O1xyXG4gIHBvc2l0aW9uOnJlbGF0aXZlO1xyXG4gIHotaW5kZXg6NTtcclxufVxyXG5oMntcclxuICBtYXJnaW4tdG9wOiAzMHB4O1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxufVxyXG5oZWFkZXIgaDJ7XHJcbiAgZm9udC1zaXplOiAyMnB4O1xyXG4gIG1hcmdpbjogMCBhdXRvO1xyXG4gIHBhZGRpbmc6IDEwcHggMDtcclxuICB3aWR0aDogODAlO1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxufVxyXG5oZWFkZXIgYSwgYTp2aXNpdGVkIHtcclxuICB0ZXh0LWRlY29yYXRpb246bm9uZTtcclxuICBjb2xvcjojZmNmY2ZjO1xyXG59XHJcblxyXG5Aa2V5ZnJhbWVzIG1vdmUtdHdpbmstYmFjayB7XHJcbiAgZnJvbSB7YmFja2dyb3VuZC1wb3NpdGlvbjowIDA7fVxyXG4gIHRvIHtiYWNrZ3JvdW5kLXBvc2l0aW9uOi0xMDAwMHB4IDUwMDBweDt9XHJcbn1cclxuQC13ZWJraXQta2V5ZnJhbWVzIG1vdmUtdHdpbmstYmFjayB7XHJcbiAgZnJvbSB7YmFja2dyb3VuZC1wb3NpdGlvbjowIDA7fVxyXG4gIHRvIHtiYWNrZ3JvdW5kLXBvc2l0aW9uOi0xMDAwMHB4IDUwMDBweDt9XHJcbn1cclxuQC1tb3ota2V5ZnJhbWVzIG1vdmUtdHdpbmstYmFjayB7XHJcbiAgZnJvbSB7YmFja2dyb3VuZC1wb3NpdGlvbjowIDA7fVxyXG4gIHRvIHtiYWNrZ3JvdW5kLXBvc2l0aW9uOi0xMDAwMHB4IDUwMDBweDt9XHJcbn1cclxuQC1tcy1rZXlmcmFtZXMgbW92ZS10d2luay1iYWNrIHtcclxuICBmcm9tIHtiYWNrZ3JvdW5kLXBvc2l0aW9uOjAgMDt9XHJcbiAgdG8ge2JhY2tncm91bmQtcG9zaXRpb246LTEwMDAwcHggNTAwMHB4O31cclxufVxyXG5cclxuQGtleWZyYW1lcyBtb3ZlLWNsb3Vkcy1iYWNrIHtcclxuICBmcm9tIHtiYWNrZ3JvdW5kLXBvc2l0aW9uOjAgMDt9XHJcbiAgdG8ge2JhY2tncm91bmQtcG9zaXRpb246MTAwMDBweCAwO31cclxufVxyXG5ALXdlYmtpdC1rZXlmcmFtZXMgbW92ZS1jbG91ZHMtYmFjayB7XHJcbiAgZnJvbSB7YmFja2dyb3VuZC1wb3NpdGlvbjowIDA7fVxyXG4gIHRvIHtiYWNrZ3JvdW5kLXBvc2l0aW9uOjEwMDAwcHggMDt9XHJcbn1cclxuQC1tb3ota2V5ZnJhbWVzIG1vdmUtY2xvdWRzLWJhY2sge1xyXG4gIGZyb20ge2JhY2tncm91bmQtcG9zaXRpb246MCAwO31cclxuICB0byB7YmFja2dyb3VuZC1wb3NpdGlvbjoxMDAwMHB4IDA7fVxyXG59XHJcbkAtbXMta2V5ZnJhbWVzIG1vdmUtY2xvdWRzLWJhY2sge1xyXG4gIGZyb20ge2JhY2tncm91bmQtcG9zaXRpb246IDA7fVxyXG4gIHRvIHtiYWNrZ3JvdW5kLXBvc2l0aW9uOjEwMDAwcHggMDt9XHJcbn1cclxuXHJcbi5zdGFycywgLnR3aW5rbGluZywgLmNsb3VkcyB7XHJcbnBvc2l0aW9uOmFic29sdXRlO1xyXG50b3A6MDtcclxubGVmdDowO1xyXG5yaWdodDowO1xyXG5ib3R0b206MDtcclxud2lkdGg6MTAwJTtcclxuaGVpZ2h0OjEwMCU7XHJcbmRpc3BsYXk6YmxvY2s7XHJcbn1cclxuXHJcbi5zdGFycyB7XHJcbmJhY2tncm91bmQ6IzAwMCB1cmwoJy4uLy4uL2Fzc2V0cy9pbWcvYmFja2dyb3VuZC9zdGFycy5wbmcnKSByZXBlYXQgdG9wIGNlbnRlcjtcclxuei1pbmRleDowO1xyXG59XHJcblxyXG4udHdpbmtsaW5ne1xyXG5iYWNrZ3JvdW5kOnRyYW5zcGFyZW50IHVybCgnLi4vLi4vYXNzZXRzL2ltZy9iYWNrZ3JvdW5kL3R3aW5rbGluZy5wbmcnKSByZXBlYXQgdG9wIGNlbnRlcjtcclxuei1pbmRleDoxO1xyXG5cclxuLW1vei1hbmltYXRpb246bW92ZS10d2luay1iYWNrIDIwMHMgbGluZWFyIGluZmluaXRlO1xyXG4tbXMtYW5pbWF0aW9uOm1vdmUtdHdpbmstYmFjayAyMDBzIGxpbmVhciBpbmZpbml0ZTtcclxuLW8tYW5pbWF0aW9uOm1vdmUtdHdpbmstYmFjayAyMDBzIGxpbmVhciBpbmZpbml0ZTtcclxuLXdlYmtpdC1hbmltYXRpb246bW92ZS10d2luay1iYWNrIDIwMHMgbGluZWFyIGluZmluaXRlO1xyXG5hbmltYXRpb246bW92ZS10d2luay1iYWNrIDIwMHMgbGluZWFyIGluZmluaXRlO1xyXG59XHJcblxyXG4uY2xvdWRze1xyXG4gIGJhY2tncm91bmQ6dHJhbnNwYXJlbnQgdXJsKCcuLi8uLi9hc3NldHMvaW1nL2JhY2tncm91bmQvY2xvdWRzLnBuZycpIHJlcGVhdCB0b3AgY2VudGVyO1xyXG4gIHotaW5kZXg6MztcclxuXHJcbi1tb3otYW5pbWF0aW9uOm1vdmUtY2xvdWRzLWJhY2sgMjAwcyBsaW5lYXIgaW5maW5pdGU7XHJcbi1tcy1hbmltYXRpb246bW92ZS1jbG91ZHMtYmFjayAyMDBzIGxpbmVhciBpbmZpbml0ZTtcclxuLW8tYW5pbWF0aW9uOm1vdmUtY2xvdWRzLWJhY2sgMjAwcyBsaW5lYXIgaW5maW5pdGU7XHJcbi13ZWJraXQtYW5pbWF0aW9uOm1vdmUtY2xvdWRzLWJhY2sgMjAwcyBsaW5lYXIgaW5maW5pdGU7XHJcbmFuaW1hdGlvbjptb3ZlLWNsb3Vkcy1iYWNrIDIwMHMgbGluZWFyIGluZmluaXRlO1xyXG59Il19 */"

/***/ }),

/***/ "./src/app/login/login.component.html":
/*!********************************************!*\
  !*** ./src/app/login/login.component.html ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"stars\"></div>\r\n<div class=\"twinkling\"></div>\r\n<div class=\"clouds\"></div>\r\n\r\n\r\n<div class=\"jumbotron\">\r\n    <div class=\"zIndex1 container\">\r\n        <div class=\"zIndex1 row\">\r\n            <div class=\"zIndex1 col-sm-6 offset-sm-3\">\r\n                <div class=\"zIndex1\"><h2>Login</h2></div>\r\n                <form class=\"zIndex1\" [formGroup]=\"loginForm\" (ngSubmit)=\"onSubmit()\">\r\n                    <div class=\"form-group\">\r\n                        <label for=\"username\">Username</label>\r\n                        <input type=\"text\" formControlName=\"username\" class=\"form-control\" [ngClass]=\"{ 'is-invalid': submitted && f.username.errors }\" onkeydown=\"event.stopPropagation()\"/>\r\n                        <div *ngIf=\"submitted && f.username.errors\" class=\"invalid-feedback\">\r\n                            <div *ngIf=\"f.username.errors.required\">Username is required</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"form-group\">\r\n                        <label for=\"password\">Password</label>\r\n                        <input type=\"password\" formControlName=\"password\" class=\"form-control\" [ngClass]=\"{ 'is-invalid': submitted && f.password.errors } \" onkeydown=\"event.stopPropagation()\"/>\r\n                        <div *ngIf=\"submitted && f.password.errors\" class=\"invalid-feedback\">\r\n                            <div *ngIf=\"f.password.errors.required\">Password is required</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"form-group\">\r\n                        <button [disabled]=\"loading\" class=\"btn btn-primary\">Login</button>\r\n                        <img *ngIf=\"loading\" class=\"pl-3\" src=\"data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==\" />\r\n                        <a routerLink=\"/register\" class=\"btn btn-link\">Register</a>\r\n                    </div>\r\n                </form>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<div class=\"text-center\">\r\n    <p>\r\n        <a href=\"http://jasonwatmore.com/post/2018/10/29/angular-7-user-registration-and-login-example-tutorial\" target=\"_top\">Angular 7 - User Registration and Login Example & Tutorial</a>\r\n    </p>\r\n    <p>\r\n        <a href=\"http://jasonwatmore.com\" target=\"_top\">JasonWatmore.com</a>\r\n    </p>\r\n</div>"

/***/ }),

/***/ "./src/app/login/login.component.ts":
/*!******************************************!*\
  !*** ./src/app/login/login.component.ts ***!
  \******************************************/
/*! exports provided: LoginComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return LoginComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../_services */ "./src/app/_services/index.ts");






var LoginComponent = /** @class */ (function () {
    function LoginComponent(formBuilder, route, router, authenticationService, alertService) {
        this.formBuilder = formBuilder;
        this.route = route;
        this.router = router;
        this.authenticationService = authenticationService;
        this.alertService = alertService;
        this.loading = false;
        this.submitted = false;
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.loginForm = this.formBuilder.group({
            username: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required],
            password: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required]
        });
        // get return url from route parameters or default to '/'
        this.returnUrl = 'engine2d';
        // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    };
    Object.defineProperty(LoginComponent.prototype, "f", {
        // convenience getter for easy access to form fields
        get: function () { return this.loginForm.controls; },
        enumerable: true,
        configurable: true
    });
    LoginComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = true;
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["first"])())
            .subscribe(function (data) {
            _this.router.navigate([_this.returnUrl]);
        }, function (error) {
            _this.alertService.error(error);
            _this.loading = false;
        });
    };
    LoginComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            template: __webpack_require__(/*! ./login.component.html */ "./src/app/login/login.component.html"),
            styles: [__webpack_require__(/*! ./login.component.css */ "./src/app/login/login.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormBuilder"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _services__WEBPACK_IMPORTED_MODULE_5__["AuthenticationService"],
            _services__WEBPACK_IMPORTED_MODULE_5__["AlertService"]])
    ], LoginComponent);
    return LoginComponent;
}());



/***/ }),

/***/ "./src/app/register/index.ts":
/*!***********************************!*\
  !*** ./src/app/register/index.ts ***!
  \***********************************/
/*! exports provided: RegisterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _register_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./register.component */ "./src/app/register/register.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RegisterComponent", function() { return _register_component__WEBPACK_IMPORTED_MODULE_0__["RegisterComponent"]; });




/***/ }),

/***/ "./src/app/register/register.component.css":
/*!*************************************************!*\
  !*** ./src/app/register/register.component.css ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/* login background */\r\n/* http://www.script-tutorials.com/terms-of-use/ */\r\n/* ============================================================================================== \r\nThis copyright notice must be kept untouched in the stylesheet at all times.\r\nThe original version of this stylesheet and the associated (x)html \r\nis available at http://www.script-tutorials.com/night-sky-with-twinkling-stars/\r\nCopyright (c) Script Tutorials. All rights reserved.\r\nThis stylesheet and the associated (x)html may be modified in any way to fit your requirements.\r\n================================================================================================= */\r\n.zIndex1 {\r\n  z-index: 99 !important;\r\n}\r\n* {\r\n  margin: 0;\r\n  padding: 0;\r\n}\r\nheader {\r\n  background-color:rgba(33, 33, 33, 0.9);\r\n  color:#ffffff;\r\n  display:block;\r\n  font: 14px/1.3 Arial,sans-serif;\r\n  height:50px;\r\n  position:relative;\r\n  z-index:5;\r\n}\r\nh2{\r\n  margin-top: 30px;\r\n  text-align: center;\r\n}\r\nheader h2{\r\n  font-size: 22px;\r\n  margin: 0 auto;\r\n  padding: 10px 0;\r\n  width: 80%;\r\n  text-align: center;\r\n}\r\nheader a, a:visited {\r\n  text-decoration:none;\r\n  color:#fcfcfc;\r\n}\r\n@keyframes move-twink-back {\r\n  from {background-position:0 0;}\r\n  to {background-position:-10000px 5000px;}\r\n}\r\n@-webkit-keyframes move-twink-back {\r\n  from {background-position:0 0;}\r\n  to {background-position:-10000px 5000px;}\r\n}\r\n@keyframes move-clouds-back {\r\n  from {background-position:0 0;}\r\n  to {background-position:10000px 0;}\r\n}\r\n@-webkit-keyframes move-clouds-back {\r\n  from {background-position:0 0;}\r\n  to {background-position:10000px 0;}\r\n}\r\n.stars, .twinkling, .clouds {\r\nposition:absolute;\r\ntop:0;\r\nleft:0;\r\nright:0;\r\nbottom:0;\r\nwidth:100%;\r\nheight:100%;\r\ndisplay:block;\r\n}\r\n.stars {\r\nbackground:#000 url('stars.png') repeat top center;\r\nz-index:0;\r\n}\r\n.twinkling{\r\nbackground:transparent url('twinkling.png') repeat top center;\r\nz-index:1;\r\n-webkit-animation:move-twink-back 200s linear infinite;\r\nanimation:move-twink-back 200s linear infinite;\r\n}\r\n.clouds{\r\n  background:transparent url('clouds.png') repeat top center;\r\n  z-index:3;\r\n-webkit-animation:move-clouds-back 200s linear infinite;\r\nanimation:move-clouds-back 200s linear infinite;\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcmVnaXN0ZXIvcmVnaXN0ZXIuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxxQkFBcUI7QUFDckIsa0RBQWtEO0FBQ2xEOzs7Ozs7bUdBTW1HO0FBQ25HO0VBQ0Usc0JBQXNCO0FBQ3hCO0FBRUE7RUFDRSxTQUFTO0VBQ1QsVUFBVTtBQUNaO0FBQ0E7RUFDRSxzQ0FBc0M7RUFDdEMsYUFBYTtFQUNiLGFBQWE7RUFDYiwrQkFBK0I7RUFDL0IsV0FBVztFQUNYLGlCQUFpQjtFQUNqQixTQUFTO0FBQ1g7QUFDQTtFQUNFLGdCQUFnQjtFQUNoQixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGVBQWU7RUFDZixjQUFjO0VBQ2QsZUFBZTtFQUNmLFVBQVU7RUFDVixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLG9CQUFvQjtFQUNwQixhQUFhO0FBQ2Y7QUFFQTtFQUNFLE1BQU0sdUJBQXVCLENBQUM7RUFDOUIsSUFBSSxtQ0FBbUMsQ0FBQztBQUMxQztBQUNBO0VBQ0UsTUFBTSx1QkFBdUIsQ0FBQztFQUM5QixJQUFJLG1DQUFtQyxDQUFDO0FBQzFDO0FBVUE7RUFDRSxNQUFNLHVCQUF1QixDQUFDO0VBQzlCLElBQUksNkJBQTZCLENBQUM7QUFDcEM7QUFDQTtFQUNFLE1BQU0sdUJBQXVCLENBQUM7RUFDOUIsSUFBSSw2QkFBNkIsQ0FBQztBQUNwQztBQVVBO0FBQ0EsaUJBQWlCO0FBQ2pCLEtBQUs7QUFDTCxNQUFNO0FBQ04sT0FBTztBQUNQLFFBQVE7QUFDUixVQUFVO0FBQ1YsV0FBVztBQUNYLGFBQWE7QUFDYjtBQUVBO0FBQ0Esa0RBQThFO0FBQzlFLFNBQVM7QUFDVDtBQUVBO0FBQ0EsNkRBQXlGO0FBQ3pGLFNBQVM7QUFLVCxzREFBc0Q7QUFDdEQsOENBQThDO0FBQzlDO0FBRUE7RUFDRSwwREFBc0Y7RUFDdEYsU0FBUztBQUtYLHVEQUF1RDtBQUN2RCwrQ0FBK0M7QUFDL0MiLCJmaWxlIjoic3JjL2FwcC9yZWdpc3Rlci9yZWdpc3Rlci5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLyogbG9naW4gYmFja2dyb3VuZCAqL1xyXG4vKiBodHRwOi8vd3d3LnNjcmlwdC10dXRvcmlhbHMuY29tL3Rlcm1zLW9mLXVzZS8gKi9cclxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSBcclxuVGhpcyBjb3B5cmlnaHQgbm90aWNlIG11c3QgYmUga2VwdCB1bnRvdWNoZWQgaW4gdGhlIHN0eWxlc2hlZXQgYXQgYWxsIHRpbWVzLlxyXG5UaGUgb3JpZ2luYWwgdmVyc2lvbiBvZiB0aGlzIHN0eWxlc2hlZXQgYW5kIHRoZSBhc3NvY2lhdGVkICh4KWh0bWwgXHJcbmlzIGF2YWlsYWJsZSBhdCBodHRwOi8vd3d3LnNjcmlwdC10dXRvcmlhbHMuY29tL25pZ2h0LXNreS13aXRoLXR3aW5rbGluZy1zdGFycy9cclxuQ29weXJpZ2h0IChjKSBTY3JpcHQgVHV0b3JpYWxzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5UaGlzIHN0eWxlc2hlZXQgYW5kIHRoZSBhc3NvY2lhdGVkICh4KWh0bWwgbWF5IGJlIG1vZGlmaWVkIGluIGFueSB3YXkgdG8gZml0IHlvdXIgcmVxdWlyZW1lbnRzLlxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcbi56SW5kZXgxIHtcclxuICB6LWluZGV4OiA5OSAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4qIHtcclxuICBtYXJnaW46IDA7XHJcbiAgcGFkZGluZzogMDtcclxufVxyXG5oZWFkZXIge1xyXG4gIGJhY2tncm91bmQtY29sb3I6cmdiYSgzMywgMzMsIDMzLCAwLjkpO1xyXG4gIGNvbG9yOiNmZmZmZmY7XHJcbiAgZGlzcGxheTpibG9jaztcclxuICBmb250OiAxNHB4LzEuMyBBcmlhbCxzYW5zLXNlcmlmO1xyXG4gIGhlaWdodDo1MHB4O1xyXG4gIHBvc2l0aW9uOnJlbGF0aXZlO1xyXG4gIHotaW5kZXg6NTtcclxufVxyXG5oMntcclxuICBtYXJnaW4tdG9wOiAzMHB4O1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxufVxyXG5oZWFkZXIgaDJ7XHJcbiAgZm9udC1zaXplOiAyMnB4O1xyXG4gIG1hcmdpbjogMCBhdXRvO1xyXG4gIHBhZGRpbmc6IDEwcHggMDtcclxuICB3aWR0aDogODAlO1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxufVxyXG5oZWFkZXIgYSwgYTp2aXNpdGVkIHtcclxuICB0ZXh0LWRlY29yYXRpb246bm9uZTtcclxuICBjb2xvcjojZmNmY2ZjO1xyXG59XHJcblxyXG5Aa2V5ZnJhbWVzIG1vdmUtdHdpbmstYmFjayB7XHJcbiAgZnJvbSB7YmFja2dyb3VuZC1wb3NpdGlvbjowIDA7fVxyXG4gIHRvIHtiYWNrZ3JvdW5kLXBvc2l0aW9uOi0xMDAwMHB4IDUwMDBweDt9XHJcbn1cclxuQC13ZWJraXQta2V5ZnJhbWVzIG1vdmUtdHdpbmstYmFjayB7XHJcbiAgZnJvbSB7YmFja2dyb3VuZC1wb3NpdGlvbjowIDA7fVxyXG4gIHRvIHtiYWNrZ3JvdW5kLXBvc2l0aW9uOi0xMDAwMHB4IDUwMDBweDt9XHJcbn1cclxuQC1tb3ota2V5ZnJhbWVzIG1vdmUtdHdpbmstYmFjayB7XHJcbiAgZnJvbSB7YmFja2dyb3VuZC1wb3NpdGlvbjowIDA7fVxyXG4gIHRvIHtiYWNrZ3JvdW5kLXBvc2l0aW9uOi0xMDAwMHB4IDUwMDBweDt9XHJcbn1cclxuQC1tcy1rZXlmcmFtZXMgbW92ZS10d2luay1iYWNrIHtcclxuICBmcm9tIHtiYWNrZ3JvdW5kLXBvc2l0aW9uOjAgMDt9XHJcbiAgdG8ge2JhY2tncm91bmQtcG9zaXRpb246LTEwMDAwcHggNTAwMHB4O31cclxufVxyXG5cclxuQGtleWZyYW1lcyBtb3ZlLWNsb3Vkcy1iYWNrIHtcclxuICBmcm9tIHtiYWNrZ3JvdW5kLXBvc2l0aW9uOjAgMDt9XHJcbiAgdG8ge2JhY2tncm91bmQtcG9zaXRpb246MTAwMDBweCAwO31cclxufVxyXG5ALXdlYmtpdC1rZXlmcmFtZXMgbW92ZS1jbG91ZHMtYmFjayB7XHJcbiAgZnJvbSB7YmFja2dyb3VuZC1wb3NpdGlvbjowIDA7fVxyXG4gIHRvIHtiYWNrZ3JvdW5kLXBvc2l0aW9uOjEwMDAwcHggMDt9XHJcbn1cclxuQC1tb3ota2V5ZnJhbWVzIG1vdmUtY2xvdWRzLWJhY2sge1xyXG4gIGZyb20ge2JhY2tncm91bmQtcG9zaXRpb246MCAwO31cclxuICB0byB7YmFja2dyb3VuZC1wb3NpdGlvbjoxMDAwMHB4IDA7fVxyXG59XHJcbkAtbXMta2V5ZnJhbWVzIG1vdmUtY2xvdWRzLWJhY2sge1xyXG4gIGZyb20ge2JhY2tncm91bmQtcG9zaXRpb246IDA7fVxyXG4gIHRvIHtiYWNrZ3JvdW5kLXBvc2l0aW9uOjEwMDAwcHggMDt9XHJcbn1cclxuXHJcbi5zdGFycywgLnR3aW5rbGluZywgLmNsb3VkcyB7XHJcbnBvc2l0aW9uOmFic29sdXRlO1xyXG50b3A6MDtcclxubGVmdDowO1xyXG5yaWdodDowO1xyXG5ib3R0b206MDtcclxud2lkdGg6MTAwJTtcclxuaGVpZ2h0OjEwMCU7XHJcbmRpc3BsYXk6YmxvY2s7XHJcbn1cclxuXHJcbi5zdGFycyB7XHJcbmJhY2tncm91bmQ6IzAwMCB1cmwoJy4uLy4uL2Fzc2V0cy9pbWcvYmFja2dyb3VuZC9zdGFycy5wbmcnKSByZXBlYXQgdG9wIGNlbnRlcjtcclxuei1pbmRleDowO1xyXG59XHJcblxyXG4udHdpbmtsaW5ne1xyXG5iYWNrZ3JvdW5kOnRyYW5zcGFyZW50IHVybCgnLi4vLi4vYXNzZXRzL2ltZy9iYWNrZ3JvdW5kL3R3aW5rbGluZy5wbmcnKSByZXBlYXQgdG9wIGNlbnRlcjtcclxuei1pbmRleDoxO1xyXG5cclxuLW1vei1hbmltYXRpb246bW92ZS10d2luay1iYWNrIDIwMHMgbGluZWFyIGluZmluaXRlO1xyXG4tbXMtYW5pbWF0aW9uOm1vdmUtdHdpbmstYmFjayAyMDBzIGxpbmVhciBpbmZpbml0ZTtcclxuLW8tYW5pbWF0aW9uOm1vdmUtdHdpbmstYmFjayAyMDBzIGxpbmVhciBpbmZpbml0ZTtcclxuLXdlYmtpdC1hbmltYXRpb246bW92ZS10d2luay1iYWNrIDIwMHMgbGluZWFyIGluZmluaXRlO1xyXG5hbmltYXRpb246bW92ZS10d2luay1iYWNrIDIwMHMgbGluZWFyIGluZmluaXRlO1xyXG59XHJcblxyXG4uY2xvdWRze1xyXG4gIGJhY2tncm91bmQ6dHJhbnNwYXJlbnQgdXJsKCcuLi8uLi9hc3NldHMvaW1nL2JhY2tncm91bmQvY2xvdWRzLnBuZycpIHJlcGVhdCB0b3AgY2VudGVyO1xyXG4gIHotaW5kZXg6MztcclxuXHJcbi1tb3otYW5pbWF0aW9uOm1vdmUtY2xvdWRzLWJhY2sgMjAwcyBsaW5lYXIgaW5maW5pdGU7XHJcbi1tcy1hbmltYXRpb246bW92ZS1jbG91ZHMtYmFjayAyMDBzIGxpbmVhciBpbmZpbml0ZTtcclxuLW8tYW5pbWF0aW9uOm1vdmUtY2xvdWRzLWJhY2sgMjAwcyBsaW5lYXIgaW5maW5pdGU7XHJcbi13ZWJraXQtYW5pbWF0aW9uOm1vdmUtY2xvdWRzLWJhY2sgMjAwcyBsaW5lYXIgaW5maW5pdGU7XHJcbmFuaW1hdGlvbjptb3ZlLWNsb3Vkcy1iYWNrIDIwMHMgbGluZWFyIGluZmluaXRlO1xyXG59Il19 */"

/***/ }),

/***/ "./src/app/register/register.component.html":
/*!**************************************************!*\
  !*** ./src/app/register/register.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"stars\"></div>\r\n<div class=\"twinkling\"></div>\r\n<div class=\"clouds\"></div>\r\n\r\n<div class=\"jumbotron\">\r\n    <div class=\"zIndex1 container\">\r\n        <div class=\"zIndex1 row\">\r\n            <div class=\"zIndex1 col-sm-6 offset-sm-3\">\r\n                <div class=\"zIndex1\"><h2>Register</h2></div>\r\n                <form class=\"zIndex1\" [formGroup]=\"registerForm\" (ngSubmit)=\"onSubmit()\">\r\n                    <div class=\"form-group\">\r\n                        <label for=\"firstName\">First Name</label>\r\n                        <input type=\"text\" formControlName=\"firstName\" class=\"form-control\" [ngClass]=\"{ 'is-invalid': submitted && f.firstName.errors }\" onkeydown=\"event.stopPropagation()\"/>\r\n                        <div *ngIf=\"submitted && f.firstName.errors\" class=\"invalid-feedback\">\r\n                            <div *ngIf=\"f.firstName.errors.required\">First Name is required</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"form-group\">\r\n                        <label for=\"lastName\">Last Name</label>\r\n                        <input type=\"text\" formControlName=\"lastName\" class=\"form-control\" [ngClass]=\"{ 'is-invalid': submitted && f.lastName.errors }\" onkeydown=\"event.stopPropagation()\"/>\r\n                        <div *ngIf=\"submitted && f.lastName.errors\" class=\"invalid-feedback\">\r\n                            <div *ngIf=\"f.lastName.errors.required\">Last Name is required</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"form-group\">\r\n                        <label for=\"username\">Username</label>\r\n                        <input type=\"text\" formControlName=\"username\" class=\"form-control\" [ngClass]=\"{ 'is-invalid': submitted && f.username.errors }\" onkeydown=\"event.stopPropagation()\"/>\r\n                        <div *ngIf=\"submitted && f.username.errors\" class=\"invalid-feedback\">\r\n                            <div *ngIf=\"f.username.errors.required\">Username is required</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"form-group\">\r\n                        <label for=\"password\">Password</label>\r\n                        <input type=\"password\" formControlName=\"password\" class=\"form-control\" [ngClass]=\"{ 'is-invalid': submitted && f.password.errors }\" onkeydown=\"event.stopPropagation()\" />\r\n                        <div *ngIf=\"submitted && f.password.errors\" class=\"invalid-feedback\">\r\n                            <div *ngIf=\"f.password.errors.required\">Password is required</div>\r\n                            <div *ngIf=\"f.password.errors.minlength\">Password must be at least 6 characters</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"form-group\">\r\n                        <button [disabled]=\"loading\" class=\"btn btn-primary\">Register</button>\r\n                        <img *ngIf=\"loading\" class=\"pl-3\" src=\"data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==\" />\r\n                        <a routerLink=\"/login\" class=\"btn btn-link\">Cancel</a>\r\n                    </div>\r\n                </form>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<div class=\"text-center\">\r\n    <p>\r\n        <a href=\"http://jasonwatmore.com/post/2018/10/29/angular-7-user-registration-and-login-example-tutorial\" target=\"_top\">Angular 7 - User Registration and Login Example & Tutorial</a>\r\n    </p>\r\n    <p>\r\n        <a href=\"http://jasonwatmore.com\" target=\"_top\">JasonWatmore.com</a>\r\n    </p>\r\n</div>\r\n\r\n"

/***/ }),

/***/ "./src/app/register/register.component.ts":
/*!************************************************!*\
  !*** ./src/app/register/register.component.ts ***!
  \************************************************/
/*! exports provided: RegisterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegisterComponent", function() { return RegisterComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../_services */ "./src/app/_services/index.ts");






var RegisterComponent = /** @class */ (function () {
    function RegisterComponent(formBuilder, router, authenticationService, userService, alertService) {
        this.formBuilder = formBuilder;
        this.router = router;
        this.authenticationService = authenticationService;
        this.userService = userService;
        this.alertService = alertService;
        this.loading = false;
        this.submitted = false;
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }
    RegisterComponent.prototype.ngOnInit = function () {
        this.registerForm = this.formBuilder.group({
            firstName: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required],
            lastName: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required],
            username: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required],
            password: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].minLength(6)]]
        });
    };
    Object.defineProperty(RegisterComponent.prototype, "f", {
        // convenience getter for easy access to form fields
        get: function () { return this.registerForm.controls; },
        enumerable: true,
        configurable: true
    });
    RegisterComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = true;
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        this.loading = true;
        this.userService.register(this.registerForm.value)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["first"])())
            .subscribe(function (data) {
            _this.alertService.success('Registration successful', true);
            _this.router.navigate(['/login']);
        }, function (error) {
            _this.alertService.error(error);
            _this.loading = false;
        });
    };
    RegisterComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            template: __webpack_require__(/*! ./register.component.html */ "./src/app/register/register.component.html"),
            styles: [__webpack_require__(/*! ./register.component.css */ "./src/app/register/register.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormBuilder"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _services__WEBPACK_IMPORTED_MODULE_5__["AuthenticationService"],
            _services__WEBPACK_IMPORTED_MODULE_5__["UserService"],
            _services__WEBPACK_IMPORTED_MODULE_5__["AlertService"]])
    ], RegisterComponent);
    return RegisterComponent;
}());



/***/ }),

/***/ "./src/app/right-side-menu/right-side-menu.component.css":
/*!***************************************************************!*\
  !*** ./src/app/right-side-menu/right-side-menu.component.css ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".sidenav-container {\r\n  height: 100%;\r\n  width: 0px;\r\n}\r\n\r\n.sidenav {\r\n  margin-top: 64px;\r\n  width: 300px;\r\n}\r\n\r\n.sidenav .mat-toolbar {\r\n  background: inherit;\r\n}\r\n\r\n.mat-toolbar.mat-primary {\r\n  position: -webkit-sticky;\r\n  position: sticky;\r\n  top: 0;\r\n  /* z-index: 1; */\r\n}\r\n\r\n.mat-tab-label {\r\n  min-width: 15px !important;\r\n  max-width: 20px !important;\r\n}\r\n\r\n.mat-tab-labels {\r\n  justify-content: space-between !important;\r\n}\r\n\r\n.color_picker {\r\n  width: 80px;\r\n  height: 25px;\r\n  z-index: 1 !important;\r\n}\r\n\r\n.menu_component.background, .object_type {\r\n  margin-top: 10px;\r\n}\r\n\r\n.object_type {\r\n  margin-bottom: 5px;\r\n}\r\n\r\n.menu_component {\r\n  margin-left: 10px;\r\n}\r\n\r\n.fog_options {\r\n  width: 110px !important;\r\n}\r\n\r\n.object_list_options {\r\n  width: 110px !important;\r\n}\r\n\r\n.Shadow_options {\r\n  width: 70px;\r\n}\r\n\r\n.mat-slider {\r\n  width: 100px;\r\n}\r\n\r\n.fog_color{\r\n  margin-bottom: 15px !important;\r\n}\r\n\r\n.fog_sliders_labels, .fog_sliders{\r\n  display: flex;\r\n  flex-direction: column;\r\n  justify-content: space-around;\r\n}\r\n\r\n.positions_wrapper, .rotations_wrapper, .scales_wrapper {\r\n  display: flex;\r\n  flex-direction: row;\r\n  justify-content: space-around;\r\n  margin-top: 0px;\r\n}\r\n\r\n.object_labels {\r\n  align-self: flex-end;\r\n}\r\n\r\n.scale_slide {\r\n  align-self: center;\r\n}\r\n\r\n.object_name input {\r\n  padding: 0px;\r\n}\r\n\r\n.mat-form-field.input_axis {\r\n  width: 50px;\r\n}\r\n\r\n/* .shadow_wrapper {\r\n  display: flex;\r\n  flex-direction: row;\r\n  justify-content: flex-start;\r\n  margin-left:10px;\r\n}\r\n\r\n.shadow_wrapper mat-radio-group{\r\n  display: flex;\r\n  flex-direction: row;\r\n  margin-left: 10px;\r\n}\r\n\r\n.shadow_wrapper mat-radio-group .shadow_cast {\r\n  margin-left: 20px;\r\n} */\r\n\r\n.visible {\r\n  margin-bottom: 10px;\r\n}\r\n\r\n.shadow_section {\r\n  display: flex;\r\n  flex-direction: row;\r\n}\r\n\r\n.mat-checkbox{\r\n  margin-left: 20px;\r\n}\r\n\r\n/* .object_user_data {\r\n  margin-top: 10px;\r\n} */\r\n\r\n/* .example-tree-invisible {\r\n  display: none;\r\n}\r\n\r\n.example-tree ul,\r\n.example-tree li {\r\n  margin-top: 0;\r\n  margin-bottom: 0;\r\n  list-style-type: none;\r\n}\r\n\r\n.example-tree {\r\n  z-index: 1;\r\n} */\r\n\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcmlnaHQtc2lkZS1tZW51L3JpZ2h0LXNpZGUtbWVudS5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsWUFBWTtFQUNaLFVBQVU7QUFDWjs7QUFFQTtFQUNFLGdCQUFnQjtFQUNoQixZQUFZO0FBQ2Q7O0FBRUE7RUFDRSxtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSx3QkFBZ0I7RUFBaEIsZ0JBQWdCO0VBQ2hCLE1BQU07RUFDTixnQkFBZ0I7QUFDbEI7O0FBRUE7RUFDRSwwQkFBMEI7RUFDMUIsMEJBQTBCO0FBQzVCOztBQUVBO0VBQ0UseUNBQXlDO0FBQzNDOztBQUVBO0VBQ0UsV0FBVztFQUNYLFlBQVk7RUFDWixxQkFBcUI7QUFDdkI7O0FBRUE7RUFDRSxnQkFBZ0I7QUFDbEI7O0FBRUE7RUFDRSxrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSxpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSx1QkFBdUI7QUFDekI7O0FBRUE7RUFDRSx1QkFBdUI7QUFDekI7O0FBRUE7RUFDRSxXQUFXO0FBQ2I7O0FBRUE7RUFDRSxZQUFZO0FBQ2Q7O0FBRUE7RUFDRSw4QkFBOEI7QUFDaEM7O0FBRUE7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLDZCQUE2QjtBQUMvQjs7QUFFQTtFQUNFLGFBQWE7RUFDYixtQkFBbUI7RUFDbkIsNkJBQTZCO0VBQzdCLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxvQkFBb0I7QUFDdEI7O0FBRUE7RUFDRSxrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSxZQUFZO0FBQ2Q7O0FBRUE7RUFDRSxXQUFXO0FBQ2I7O0FBRUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHOztBQUVIO0VBQ0UsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLGlCQUFpQjtBQUNuQjs7QUFHQTs7R0FFRzs7QUFFSDs7Ozs7Ozs7Ozs7OztHQWFHIiwiZmlsZSI6InNyYy9hcHAvcmlnaHQtc2lkZS1tZW51L3JpZ2h0LXNpZGUtbWVudS5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnNpZGVuYXYtY29udGFpbmVyIHtcclxuICBoZWlnaHQ6IDEwMCU7XHJcbiAgd2lkdGg6IDBweDtcclxufVxyXG5cclxuLnNpZGVuYXYge1xyXG4gIG1hcmdpbi10b3A6IDY0cHg7XHJcbiAgd2lkdGg6IDMwMHB4O1xyXG59XHJcblxyXG4uc2lkZW5hdiAubWF0LXRvb2xiYXIge1xyXG4gIGJhY2tncm91bmQ6IGluaGVyaXQ7XHJcbn1cclxuXHJcbi5tYXQtdG9vbGJhci5tYXQtcHJpbWFyeSB7XHJcbiAgcG9zaXRpb246IHN0aWNreTtcclxuICB0b3A6IDA7XHJcbiAgLyogei1pbmRleDogMTsgKi9cclxufVxyXG5cclxuLm1hdC10YWItbGFiZWwge1xyXG4gIG1pbi13aWR0aDogMTVweCAhaW1wb3J0YW50O1xyXG4gIG1heC13aWR0aDogMjBweCAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4ubWF0LXRhYi1sYWJlbHMge1xyXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbiAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4uY29sb3JfcGlja2VyIHtcclxuICB3aWR0aDogODBweDtcclxuICBoZWlnaHQ6IDI1cHg7XHJcbiAgei1pbmRleDogMSAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4ubWVudV9jb21wb25lbnQuYmFja2dyb3VuZCwgLm9iamVjdF90eXBlIHtcclxuICBtYXJnaW4tdG9wOiAxMHB4O1xyXG59XHJcblxyXG4ub2JqZWN0X3R5cGUge1xyXG4gIG1hcmdpbi1ib3R0b206IDVweDtcclxufVxyXG5cclxuLm1lbnVfY29tcG9uZW50IHtcclxuICBtYXJnaW4tbGVmdDogMTBweDtcclxufVxyXG5cclxuLmZvZ19vcHRpb25zIHtcclxuICB3aWR0aDogMTEwcHggIWltcG9ydGFudDtcclxufVxyXG5cclxuLm9iamVjdF9saXN0X29wdGlvbnMge1xyXG4gIHdpZHRoOiAxMTBweCAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4uU2hhZG93X29wdGlvbnMge1xyXG4gIHdpZHRoOiA3MHB4O1xyXG59XHJcblxyXG4ubWF0LXNsaWRlciB7XHJcbiAgd2lkdGg6IDEwMHB4O1xyXG59XHJcblxyXG4uZm9nX2NvbG9ye1xyXG4gIG1hcmdpbi1ib3R0b206IDE1cHggIWltcG9ydGFudDtcclxufVxyXG5cclxuLmZvZ19zbGlkZXJzX2xhYmVscywgLmZvZ19zbGlkZXJze1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxufVxyXG5cclxuLnBvc2l0aW9uc193cmFwcGVyLCAucm90YXRpb25zX3dyYXBwZXIsIC5zY2FsZXNfd3JhcHBlciB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xyXG4gIG1hcmdpbi10b3A6IDBweDtcclxufVxyXG5cclxuLm9iamVjdF9sYWJlbHMge1xyXG4gIGFsaWduLXNlbGY6IGZsZXgtZW5kO1xyXG59XHJcblxyXG4uc2NhbGVfc2xpZGUge1xyXG4gIGFsaWduLXNlbGY6IGNlbnRlcjtcclxufVxyXG5cclxuLm9iamVjdF9uYW1lIGlucHV0IHtcclxuICBwYWRkaW5nOiAwcHg7XHJcbn1cclxuXHJcbi5tYXQtZm9ybS1maWVsZC5pbnB1dF9heGlzIHtcclxuICB3aWR0aDogNTBweDtcclxufVxyXG5cclxuLyogLnNoYWRvd193cmFwcGVyIHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xyXG4gIG1hcmdpbi1sZWZ0OjEwcHg7XHJcbn1cclxuXHJcbi5zaGFkb3dfd3JhcHBlciBtYXQtcmFkaW8tZ3JvdXB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gIG1hcmdpbi1sZWZ0OiAxMHB4O1xyXG59XHJcblxyXG4uc2hhZG93X3dyYXBwZXIgbWF0LXJhZGlvLWdyb3VwIC5zaGFkb3dfY2FzdCB7XHJcbiAgbWFyZ2luLWxlZnQ6IDIwcHg7XHJcbn0gKi9cclxuXHJcbi52aXNpYmxlIHtcclxuICBtYXJnaW4tYm90dG9tOiAxMHB4O1xyXG59XHJcblxyXG4uc2hhZG93X3NlY3Rpb24ge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcclxufVxyXG5cclxuLm1hdC1jaGVja2JveHtcclxuICBtYXJnaW4tbGVmdDogMjBweDtcclxufVxyXG5cclxuXHJcbi8qIC5vYmplY3RfdXNlcl9kYXRhIHtcclxuICBtYXJnaW4tdG9wOiAxMHB4O1xyXG59ICovXHJcblxyXG4vKiAuZXhhbXBsZS10cmVlLWludmlzaWJsZSB7XHJcbiAgZGlzcGxheTogbm9uZTtcclxufVxyXG5cclxuLmV4YW1wbGUtdHJlZSB1bCxcclxuLmV4YW1wbGUtdHJlZSBsaSB7XHJcbiAgbWFyZ2luLXRvcDogMDtcclxuICBtYXJnaW4tYm90dG9tOiAwO1xyXG4gIGxpc3Qtc3R5bGUtdHlwZTogbm9uZTtcclxufVxyXG5cclxuLmV4YW1wbGUtdHJlZSB7XHJcbiAgei1pbmRleDogMTtcclxufSAqL1xyXG4iXX0= */"

/***/ }),

/***/ "./src/app/right-side-menu/right-side-menu.component.html":
/*!****************************************************************!*\
  !*** ./src/app/right-side-menu/right-side-menu.component.html ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-sidenav-container class=\"sidenav-container\">\r\n  <mat-sidenav #drawer class=\"sidenav\" fixedInViewport=\"true\"\r\n      [attr.role]=\"'dialog'\"\r\n      [mode]=\"'side'\"\r\n      [opened]=\"'true'\"\r\n      position='start'>\r\n  <mat-tab-group>\r\n      <mat-tab label=\"Scene\">\r\n          <div class=\"menu_component background\">\r\n              Background Color:\r\n              <input class=\"color_picker\" [cpOutputFormat]=\"'hex'\" [value]=\"getBackgroundColor()\" [colorPicker]=\"getBackgroundColor()\" [cpUseRootViewContainer]=\"true\" [style.background]=\"getBackgroundColor()\" (colorPickerChange)=\"onBackgroundColorPickerChange($event)\"/>\r\n          </div>\r\n          <div class=\"menu_component fog\">\r\n              Fog:\r\n              <mat-form-field class=\"fog_options\">\r\n                  <mat-select [value]=\"getFogOption()\" (selectionChange)=\"onFogSelection($event)\">\r\n                      <mat-option value=\"option1\">None</mat-option>\r\n                      <mat-option value=\"option2\">Linear</mat-option>\r\n                      <mat-option value=\"option3\">Exponential</mat-option>\r\n                  </mat-select>\r\n              </mat-form-field>\r\n              <div class=\"fog_color\" [hidden]=\"engServ.getFog() == null\">\r\n                Fog Color:\r\n                <input class=\"color_picker\" [cpOutputFormat]=\"'hex'\" [value]=\"getFogColor()\" [colorPicker]=\"getFogColor()\" [cpUseRootViewContainer]=\"true\" [style.background]=\"getFogColor()\" (colorPickerChange)=\"onFogColorPickerChange($event)\"/>\r\n              </div>\r\n              <div class=\"fog_sliders_wrapper\" [hidden]=\"engServ.getFog() == null\">\r\n                <div class=\"fog_sliders\">\r\n                    <mat-slider\r\n                    class=\"fog_density\"\r\n                    thumbLabel\r\n                    [hidden]=\"getFogDensityHidden()\"\r\n                    [displayWith]=\"formatLabel2\"\r\n                    tickInterval=\"0.01\"\r\n                    (input)=\"onFogDensitySliderChange($event)\"\r\n                    min=\"0.00\"\r\n                    max=\"0.01\"\r\n                    step=\"0.0001\"\r\n                    value=\"{{getFogExpDensity()}}\"\r\n                    onkeydown=\"event.stopPropagation()\"\r\n                    >\r\n                    </mat-slider>\r\n                    <mat-slider\r\n                    class=\"fog_range\"\r\n                    thumbLabel\r\n                    [hidden]=\"getFogRangeHidden()\"\r\n                    [displayWith]=\"formatLabel\"\r\n                    tickInterval=\"1000\"\r\n                    (input)=\"onFogRangeSliderChange($event)\"\r\n                    min=\"0.00\"\r\n                    max=\"1000.00\"\r\n                    value=\"{{getFogRange()}}\"\r\n                    onkeydown=\"event.stopPropagation()\"\r\n                    >\r\n                    </mat-slider>\r\n                </div>\r\n              </div>\r\n          </div>\r\n          <mat-tab-group mat-align-tabs=\"center\">\r\n              <mat-tab label=\"Object\">\r\n                <div [hidden]=\"engServ.getSelected()==null\">\r\n                  <div class=\"menu_component object_type\">{{engServ.getSelected() ? engServ.getSelected().type : \"\"}}</div>\r\n                  <form class=\"object_form\">\r\n                      <div class=\"menu_component object_name\">\r\n                        <mat-form-field>\r\n                            <input text matInput placeholder=\"Object Name:\" value=\"{{getObjectName()}}\" (input)=\"onObjectNameChange($event)\" (click)=\"$event.target.select()\" onkeydown=\"event.stopPropagation()\">\r\n                        </mat-form-field>\r\n                      </div>\r\n                      <div class=\"positions_wrapper\">\r\n                        <div class=\"object_labels\"><p>Position:</p></div>\r\n                        <mat-form-field class=\"input_axis\" id=\"position_x\">\r\n                            <input number matInput placeholder=\"x-axis\" value=\"{{getObjectX()}}\" (click)=\"$event.target.select()\" (input)=\"onObjectXChange($event)\" onkeydown=\"event.stopPropagation()\">\r\n                        </mat-form-field>\r\n\r\n                        <mat-form-field class=\"input_axis\" id=\"position_y\">\r\n                            <input number matInput placeholder=\"y-axis\" value=\"{{getObjectY()}}\" (click)=\"$event.target.select()\" (input)=\"onObjectYChange($event)\" onkeydown=\"event.stopPropagation()\">\r\n                        </mat-form-field>\r\n\r\n                        <mat-form-field class=\"input_axis\" id=\"position_z\">\r\n                            <input number matInput placeholder=\"z-axis\" value=\"{{getObjectZ()}}\" (click)=\"$event.target.select()\" (input)=\"onObjectZChange($event)\" onkeydown=\"event.stopPropagation()\">\r\n                        </mat-form-field>\r\n                      </div>\r\n                      <div class=\"rotations_wrapper\">\r\n                        <div class=\"object_labels\"><p>Rotations:</p></div>\r\n                          <mat-form-field class=\"input_axis\" id=\"rotation_x\">\r\n                              <input number matInput placeholder=\"x-axis\" value=\"{{getObjectRotationX()}}\" (click)=\"$event.target.select()\" (input)=\"onObjectRotationXChange($event)\" onkeydown=\"event.stopPropagation()\">\r\n                          </mat-form-field>\r\n\r\n                          <mat-form-field class=\"input_axis\" id=\"rotation_y\">\r\n                              <input number matInput placeholder=\"y-axis\" value=\"{{getObjectRotationY()}}\" (click)=\"$event.target.select()\" (input)=\"onObjectRotationYChange($event)\" onkeydown=\"event.stopPropagation()\">\r\n                          </mat-form-field>\r\n\r\n                          <mat-form-field class=\"input_axis\" id=\"rotation_z\">\r\n                              <input number matInput placeholder=\"z-axis\" value=\"{{getObjectRotationZ()}}\" (click)=\"$event.target.select()\" (input)=\"onObjectRotationZChange($event)\" onkeydown=\"event.stopPropagation()\">\r\n                          </mat-form-field>\r\n                      </div>\r\n                    <div class=\"scales_wrapper\">\r\n                        <div class=\"object_labels\"><p>Scale:</p></div>\r\n                        <mat-form-field class=\"input_axis\" id=\"scale_x\">\r\n                            <input number matInput placeholder=\"x-axis\" value=\"{{getObjectScaleX()}}\" (click)=\"$event.target.select()\" (input)=\"onObjectScaleXChange($event)\" onkeydown=\"event.stopPropagation()\">\r\n                        </mat-form-field>\r\n\r\n                        <mat-form-field class=\"input_axis\" id=\"scale_y\">\r\n                            <input number matInput placeholder=\"y-axis\" value=\"{{getObjectScaleY()}}\" (click)=\"$event.target.select()\" (input)=\"onObjectScaleYChange($event)\" onkeydown=\"event.stopPropagation()\">\r\n                        </mat-form-field>\r\n\r\n                        <mat-form-field class=\"input_axis\" id=\"scale_z\">\r\n                            <input number matInput placeholder=\"z-axis\" value=\"{{getObjectScaleZ()}}\" (click)=\"$event.target.select()\" (input)=\"onObjectScaleZChange($event)\" onkeydown=\"event.stopPropagation()\">\r\n                        </mat-form-field>\r\n                    </div>\r\n                      <div class=\"menu_component shadow_wrapper\">\r\n                          <section class=\"shadow_section\">\r\n                            <div class=\"object_labels\"><p>Shadow:</p></div>\r\n                            <div class=\"shadow_options\">\r\n                                <mat-checkbox class=\"shadow_receive\" [checked]=\"getShadowReceive()\" (change)=\"onShadowReceiveChange($event)\" [ngModel]=\"getShadowReceive()\" name=\"receive\">Receive</mat-checkbox>\r\n                                <mat-checkbox class=\"shadow_cast\" [checked]=\"getShadowCast()\" (change)=\"onShadowCastChange($event)\" [ngModel]=\"getShadowCast()\" name=\"cast\">Cast</mat-checkbox>\r\n                            </div>\r\n                          </section>\r\n                      </div>\r\n                      <div class=\"menu_component visible\"><mat-slide-toggle [checked]=\"getObjectVisibility()\" (change)=\"onObjectVisibilityChange($event)\" id=\"visible_enable\">Visible</mat-slide-toggle></div>\r\n                      <mat-form-field class=\"menu_component\">\r\n                          <textarea matInput readonly id=\"object_user_data\" placeholder=\"User Data\" value=\"{{getUserData()}}\" (click)=\"$event.target.select()\" ></textarea>\r\n                      </mat-form-field>\r\n                    </form>\r\n                </div>\r\n              </mat-tab>\r\n              <mat-tab label=\"Geometry\">\r\n                <div [hidden]=\"engServ.getSelected()==null\">\r\n                  {{this.engServ.getSelected() ? (!this.engServ.isLight(this.engServ.getSelected()) ? this.engServ.getSelected().geometry.type : \"\") : \"\"}}\r\n                </div>\r\n              </mat-tab>\r\n              <mat-tab label=\"Material\">\r\n                <div [hidden]=\"getMaterialHidden()\">\r\n                  <div class=\"menu_component\">\r\n                    Object Color:\r\n                    <input class=\"color_picker\" [cpOutputFormat]=\"'hex'\" [value]=\"getObjectColor()\" [colorPicker]=\"getObjectColor()\" [cpUseRootViewContainer]=\"true\" [style.background]=\"getObjectColor()\" (colorPickerChange)=\"onObjectColorChange($event)\"/>\r\n                  </div>\r\n                  <div class=\"menu_component\">\r\n                    Emissive Color:\r\n                    <input class=\"color_picker\" [cpOutputFormat]=\"'hex'\"  [value]=\"getObjectEmissiveColor()\" [colorPicker]=\"getObjectEmissiveColor()\" [cpUseRootViewContainer]=\"true\" [style.background]=\"getObjectEmissiveColor()\" (colorPickerChange)=\"onObjectEmissiveColorChange($event)\"/>\r\n                  </div>\r\n                </div>\r\n              </mat-tab>\r\n          </mat-tab-group>\r\n      </mat-tab>\r\n        <mat-tab label=\"Project\">Project</mat-tab>\r\n        <mat-tab label=\"Settings\">Settings</mat-tab>\r\n      </mat-tab-group>\r\n  </mat-sidenav>\r\n</mat-sidenav-container>\r\n"

/***/ }),

/***/ "./src/app/right-side-menu/right-side-menu.component.ts":
/*!**************************************************************!*\
  !*** ./src/app/right-side-menu/right-side-menu.component.ts ***!
  \**************************************************************/
/*! exports provided: RightSideMenuComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RightSideMenuComponent", function() { return RightSideMenuComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/cdk/layout */ "./node_modules/@angular/cdk/esm5/layout.es5.js");
/* harmony import */ var _engine_engine_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../engine/engine.component */ "./src/app/engine/engine.component.ts");
/* harmony import */ var three_full__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! three-full */ "./node_modules/three-full/builds/Three.es.js");
/* harmony import */ var _angular_cdk_tree__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/cdk/tree */ "./node_modules/@angular/cdk/esm5/tree.es5.js");
/* harmony import */ var _angular_material_tree__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/tree */ "./node_modules/@angular/material/esm5/tree.es5.js");







var RightSideMenuComponent = /** @class */ (function () {
    function RightSideMenuComponent(breakpointObserver, comp) {
        this.breakpointObserver = breakpointObserver;
        this.comp = comp;
        this.receive_checked = false;
        this.cast_checked = false;
        this.treeControl = new _angular_cdk_tree__WEBPACK_IMPORTED_MODULE_5__["NestedTreeControl"](function (node) { return node.children; });
        this.dataSource = new _angular_material_tree__WEBPACK_IMPORTED_MODULE_6__["MatTreeNestedDataSource"]();
        this.hasChild = function (_, node) {
            return !!node.children && node.children.length > 0;
        };
        this.formatLabel = function (value) {
            if (!value) {
                return 0;
            }
            if (value >= 1000) {
                return 1000;
            }
            return value;
        };
        this.formatLabel2 = function (value) {
            if (!value) {
                return 0;
            }
            if (value >= 0.01) {
                return 0.01;
            }
            return value;
        };
        this.engServ = this.comp.getEngineService();
    }
    RightSideMenuComponent.prototype.ngOnInit = function () {
    };
    // gets backgorund color of scene
    RightSideMenuComponent.prototype.getBackgroundColor = function () {
        var bkcolor = this.engServ.getBackgroundColor();
        return (bkcolor ? bkcolor : undefined);
    };
    // gets DataSource for Object Tree
    RightSideMenuComponent.prototype.getSceneData = function () {
        var _this = this;
        return (this.engServ.getObjects().filter(function (ele) {
            return _this.engServ.isNotSceneHelper(ele);
        }).map(function (ele) {
            return { name: String(ele.constructor.name), object: ele };
        }));
    };
    // gets fog color
    RightSideMenuComponent.prototype.getFogColor = function () {
        var fog = this.engServ.getFog();
        return (fog ? fog.color.getHexString() : undefined);
    };
    // gets fog option
    RightSideMenuComponent.prototype.getFogOption = function () {
        var fog = this.engServ.getFog();
        if (fog == null) {
            // no fog setting
            return "option1";
        }
        else if (fog instanceof three_full__WEBPACK_IMPORTED_MODULE_4__["Fog"]) {
            // linear fog setting
            return "option2";
        }
        else {
            // fogexp2 setting
            return "option3";
        }
    };
    // gets fog density hidden property based on fog type
    RightSideMenuComponent.prototype.getFogDensityHidden = function () {
        return !(this.engServ.getFog() instanceof three_full__WEBPACK_IMPORTED_MODULE_4__["FogExp2"]);
    };
    // gets fog range hidden property based on fog type
    RightSideMenuComponent.prototype.getFogRangeHidden = function () {
        return !(this.engServ.getFog() instanceof three_full__WEBPACK_IMPORTED_MODULE_4__["Fog"]);
    };
    // gets name of selected object
    RightSideMenuComponent.prototype.getObjectName = function () {
        return this.engServ.getSelected() ? this.engServ.getSelected().name : "";
    };
    // Object Position, Rotation, and Scale setting getters
    RightSideMenuComponent.prototype.getObjectX = function () {
        return this.engServ.getSelected() ? this.engServ.getSelected().position.x : "";
    };
    RightSideMenuComponent.prototype.getObjectY = function () {
        return this.engServ.getSelected() ? this.engServ.getSelected().position.y : "";
    };
    RightSideMenuComponent.prototype.getObjectZ = function () {
        return this.engServ.getSelected() ? this.engServ.getSelected().position.z : "";
    };
    RightSideMenuComponent.prototype.getObjectRotationX = function () {
        return this.engServ.getSelected() ? this.engServ.getSelected().rotation._x : "";
    };
    RightSideMenuComponent.prototype.getObjectRotationY = function () {
        return this.engServ.getSelected() ? this.engServ.getSelected().rotation._y : "";
    };
    RightSideMenuComponent.prototype.getObjectRotationZ = function () {
        return this.engServ.getSelected() ? this.engServ.getSelected().rotation._z : "";
    };
    RightSideMenuComponent.prototype.getObjectScaleX = function () {
        return this.engServ.getSelected() ? this.engServ.getSelected().scale.x : "";
    };
    RightSideMenuComponent.prototype.getObjectScaleY = function () {
        return this.engServ.getSelected() ? this.engServ.getSelected().scale.y : "";
    };
    RightSideMenuComponent.prototype.getObjectScaleZ = function () {
        return this.engServ.getSelected() ? this.engServ.getSelected().scale.z : "";
    };
    // gets selected object visibility
    RightSideMenuComponent.prototype.getObjectVisibility = function () {
        var selected = this.engServ.getSelected();
        return (selected ? selected.visible : false);
    };
    // gets user data in string
    RightSideMenuComponent.prototype.getUserData = function () {
        var selected = this.engServ.getSelected();
        return (selected ? JSON.stringify(selected.userData) : "");
    };
    // gets fog range
    RightSideMenuComponent.prototype.getFogRange = function () {
        var fog = this.engServ.getFog();
        if (fog instanceof three_full__WEBPACK_IMPORTED_MODULE_4__["Fog"])
            return fog.far;
        return 0;
    };
    // gets fog density
    RightSideMenuComponent.prototype.getFogExpDensity = function () {
        var fog = this.engServ.getFog();
        if (fog instanceof three_full__WEBPACK_IMPORTED_MODULE_4__["FogExp2"])
            return fog.density;
        return 0;
    };
    // gets shadow receive property of selected object
    RightSideMenuComponent.prototype.getShadowReceive = function () {
        var selected = this.engServ.getSelected();
        return (selected ? selected.receiveShadow : false);
    };
    // gets shadow cast property of selected object
    RightSideMenuComponent.prototype.getShadowCast = function () {
        var selected = this.engServ.getSelected();
        return (selected ? selected.castShadow : false);
    };
    // gets object emissive color property of selected mesh
    RightSideMenuComponent.prototype.getObjectEmissiveColor = function () {
        var selected = this.engServ.getSelected();
        if (!(selected instanceof three_full__WEBPACK_IMPORTED_MODULE_4__["Mesh"]))
            return undefined;
        return (selected ? (selected.material ? selected.material.emissive.getHexString() : undefined) : undefined);
    };
    // gets object color property of selected mesh
    RightSideMenuComponent.prototype.getObjectColor = function () {
        var selected = this.engServ.getSelected();
        if (!(selected instanceof three_full__WEBPACK_IMPORTED_MODULE_4__["Mesh"]))
            return undefined;
        return (selected ? (selected.material ? selected.material.color.getHexString() : undefined) : undefined);
    };
    // gets object material tab hidden property of selected object
    RightSideMenuComponent.prototype.getMaterialHidden = function () {
        var selected = this.engServ.getSelected();
        if (selected == null)
            return true;
        return (!(selected instanceof three_full__WEBPACK_IMPORTED_MODULE_4__["Mesh"]));
    };
    // gets text input object geometry hidden property
    RightSideMenuComponent.prototype.getTextInputHidden = function () {
        var selected = this.engServ.getSelected();
        return (!selected || !(selected.geometry instanceof three_full__WEBPACK_IMPORTED_MODULE_4__["TextGeometry"]));
    };
    // event handler for onFogSelection
    RightSideMenuComponent.prototype.onFogSelection = function (event) {
        switch (event.value) {
            case "option2":
                this.engServ.addFog(0x000000, 0, 300);
                break;
            case "option3":
                this.engServ.addFogExp2(0x000000, 0.001);
                break;
            default:
                this.engServ.removeFog();
                // No Fog
                break;
        }
        this.engServ.renderUpdate();
    };
    // event handler for onFogColorPickerChange
    RightSideMenuComponent.prototype.onFogColorPickerChange = function (event) {
        this.engServ.getFog().color = new three_full__WEBPACK_IMPORTED_MODULE_4__["Color"](event);
        this.engServ.renderUpdate();
    };
    // event handler for onBackgroundColorPickerChange
    RightSideMenuComponent.prototype.onBackgroundColorPickerChange = function (event) {
        this.engServ.setBackgroundColor(event);
        this.engServ.renderUpdate();
    };
    //event handler for object name change
    RightSideMenuComponent.prototype.onObjectNameChange = function (event) {
        var selected = this.engServ.getSelected();
        if (selected)
            selected.name = event.target.value;
    };
    // objectPositionChange event handlers
    RightSideMenuComponent.prototype.onObjectXChange = function (event) {
        var selected = this.engServ.getSelected();
        if (selected) {
            selected.position.setX(this.filterNaN(event.target.value));
            this.engServ.updateSelection();
        }
    };
    RightSideMenuComponent.prototype.onObjectYChange = function (event) {
        var selected = this.engServ.getSelected();
        if (selected) {
            selected.position.setY(this.filterNaN(event.target.value));
            this.engServ.updateSelection();
        }
    };
    RightSideMenuComponent.prototype.onObjectZChange = function (event) {
        var selected = this.engServ.getSelected();
        if (selected) {
            selected.position.setZ(this.filterNaN(event.target.value));
            this.engServ.updateSelection();
        }
    };
    // ObjectRoationChange Handlers
    RightSideMenuComponent.prototype.onObjectRotationXChange = function (event) {
        var selected = this.engServ.getSelected();
        if (selected) {
            selected.rotation.x = this.filterNaN(event.target.value);
            this.engServ.updateSelection();
        }
    };
    RightSideMenuComponent.prototype.onObjectRotationYChange = function (event) {
        var selected = this.engServ.getSelected();
        if (selected) {
            selected.rotation.y = this.filterNaN(event.target.value);
            this.engServ.updateSelection();
        }
    };
    RightSideMenuComponent.prototype.onObjectRotationZChange = function (event) {
        var selected = this.engServ.getSelected();
        if (selected) {
            selected.rotation.z = this.filterNaN(event.target.value);
            this.engServ.updateSelection();
        }
    };
    // Object Scale Event Handler
    RightSideMenuComponent.prototype.onObjectScaleXChange = function (event) {
        var selected = this.engServ.getSelected();
        if (selected) {
            selected.scale.setX(this.filterZero(this.filterNaN(event.target.value)));
            this.engServ.updateSelection();
        }
    };
    RightSideMenuComponent.prototype.onObjectScaleYChange = function (event) {
        var selected = this.engServ.getSelected();
        if (selected) {
            selected.scale.setY(this.filterZero(this.filterNaN(event.target.value)));
            this.engServ.updateSelection();
        }
    };
    RightSideMenuComponent.prototype.onObjectScaleZChange = function (event) {
        var selected = this.engServ.getSelected();
        if (selected) {
            selected.scale.setZ(this.filterZero(this.filterNaN(event.target.value)));
            this.engServ.updateSelection();
        }
    };
    // Object Visiblity Slider Change
    RightSideMenuComponent.prototype.onObjectVisibilityChange = function (event) {
        var selected = this.engServ.getSelected();
        if (!selected)
            return;
        selected.visible = event.checked;
        this.engServ.renderUpdate();
    };
    // Fog property change event handlers
    RightSideMenuComponent.prototype.onFogDensitySliderChange = function (event) {
        var fog = this.engServ.getFog();
        if (fog instanceof three_full__WEBPACK_IMPORTED_MODULE_4__["FogExp2"])
            fog.density = event.value;
        this.engServ.renderUpdate();
    };
    RightSideMenuComponent.prototype.onFogRangeSliderChange = function (event) {
        var fog = this.engServ.getFog();
        if (fog instanceof three_full__WEBPACK_IMPORTED_MODULE_4__["Fog"])
            fog.far = event.value;
        this.engServ.renderUpdate();
    };
    // shadow receive property event handler
    RightSideMenuComponent.prototype.onShadowReceiveChange = function (event) {
        var selected = this.engServ.getSelected();
        if (selected)
            selected.receiveShadow = event.checked;
        this.engServ.renderUpdate();
    };
    // shadow cast property event handler
    RightSideMenuComponent.prototype.onShadowCastChange = function (event) {
        var selected = this.engServ.getSelected();
        if (selected)
            selected.castShadow = event.checked;
        this.engServ.renderUpdate();
    };
    // selected object color change event handlers
    RightSideMenuComponent.prototype.onObjectEmissiveColorChange = function (event) {
        var selected = this.engServ.getSelected();
        if (!(selected instanceof three_full__WEBPACK_IMPORTED_MODULE_4__["Mesh"]))
            return;
        if (selected.material == null)
            return;
        selected.material.emissive = new three_full__WEBPACK_IMPORTED_MODULE_4__["Color"](event);
        this.engServ.renderUpdate();
    };
    RightSideMenuComponent.prototype.onObjectColorChange = function (event) {
        var selected = this.engServ.getSelected();
        if (!(selected instanceof three_full__WEBPACK_IMPORTED_MODULE_4__["Mesh"]))
            return;
        if (selected.material == null)
            return;
        selected.material.color = new three_full__WEBPACK_IMPORTED_MODULE_4__["Color"](event);
        this.engServ.renderUpdate();
    };
    // objects menu click event handler
    RightSideMenuComponent.prototype.onObjectMenuItemClick = function (ele) {
        this.engServ.select(ele.object);
        this.engServ.renderUpdate();
    };
    // returns prepared number in Float from string
    // returns 0 if string is parsed to NaN
    RightSideMenuComponent.prototype.filterNaN = function (num) {
        var n = parseFloat(num);
        return (isNaN(n) ? 0.0 : n);
    };
    // filters zero and changes to 0.01
    RightSideMenuComponent.prototype.filterZero = function (num) {
        return (num == 0 ? 0.0000000001 : num);
    };
    RightSideMenuComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            providers: [_engine_engine_component__WEBPACK_IMPORTED_MODULE_3__["EngineComponent"]],
            selector: 'app-right-side-menu',
            template: __webpack_require__(/*! ./right-side-menu.component.html */ "./src/app/right-side-menu/right-side-menu.component.html"),
            styles: [__webpack_require__(/*! ./right-side-menu.component.css */ "./src/app/right-side-menu/right-side-menu.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_cdk_layout__WEBPACK_IMPORTED_MODULE_2__["BreakpointObserver"], _engine_engine_component__WEBPACK_IMPORTED_MODULE_3__["EngineComponent"]])
    ], RightSideMenuComponent);
    return RightSideMenuComponent;
}());



/***/ }),

/***/ "./src/app/top-tool-bar/top-tool-bar.component.css":
/*!*********************************************************!*\
  !*** ./src/app/top-tool-bar/top-tool-bar.component.css ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3RvcC10b29sLWJhci90b3AtdG9vbC1iYXIuY29tcG9uZW50LmNzcyJ9 */"

/***/ }),

/***/ "./src/app/top-tool-bar/top-tool-bar.component.html":
/*!**********************************************************!*\
  !*** ./src/app/top-tool-bar/top-tool-bar.component.html ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-toolbar color=\"primary\">\r\n  <mat-toolbar-row>\r\n    <div>\r\n        <button mat-button [matMenuTriggerFor]=\"signOutMenu\">Menu</button>\r\n        <mat-menu #signOutMenu=\"matMenu\">\r\n            <button mat-menu-item (click)=\"onSignOut()\">SignOut</button>\r\n          </mat-menu>\r\n    </div>\r\n    <div>\r\n      <button mat-button [matMenuTriggerFor]=\"addMenu\">Add</button>\r\n      <mat-menu #addMenu=\"matMenu\">\r\n        <button mat-menu-item (click)=\"onAddImage()\">Image</button>\r\n        <button mat-menu-item (click)=\"onAddText()\">Text</button>\r\n        <mat-divider></mat-divider>\r\n        <button mat-menu-item (click)=\"onAddPlane()\">Plane</button>\r\n        <button mat-menu-item (click)=\"onAddBox()\">Box</button>\r\n        <button mat-menu-item (click)=\"onAddCircle()\">Circle</button>\r\n        <button mat-menu-item (click)=\"onAddCylinder()\">Cylinder</button>\r\n        <button mat-menu-item (click)=\"onAddSphere()\">Sphere</button>\r\n        <button mat-menu-item (click)=\"onAddIsosahedron()\">Icosahedron</button>\r\n        <button mat-menu-item (click)=\"onAddTorous()\">Torous</button>\r\n        <button mat-menu-item (click)=\"onAddTorousKnot()\">TorousKnot</button>\r\n        <button mat-menu-item (click)=\"onAddTube()\">Tube</button>\r\n        <button mat-menu-item (click)=\"onAddLathe()\">Lathe</button>\r\n        <mat-divider></mat-divider>\r\n        <button mat-menu-item (click)=\"onAddPointLight()\">PointLight</button>\r\n        <button mat-menu-item (click)=\"onAddDirectionalLight()\">DirectionalLight</button>\r\n        <button mat-menu-item (click)=\"onAddSpotLight()\">SpotLight</button>\r\n        <button mat-menu-item (click)=\"onAddHemisphereLight()\">HemisphereLight</button>\r\n        <button mat-menu-item (click)=\"onAddAmbientLight()\">AmbientLight</button>\r\n      </mat-menu>\r\n    </div>\r\n\r\n    <div>\r\n      <button mat-button [matMenuTriggerFor]=\"fileMenu\">File</button>\r\n      <mat-menu #fileMenu=\"matMenu\">\r\n        <button mat-menu-item (click)=\"onNew()\">New</button>\r\n        <button mat-menu-item (click)=\"onImport()\">Import</button>\r\n        <button mat-menu-item (click)=\"onExport()\">Export</button>\r\n        <button mat-menu-item (click)=\"onScreenshot()\">Save Screenshot</button>\r\n      </mat-menu>\r\n    </div>\r\n\r\n    <div>\r\n      <button mat-button [matMenuTriggerFor]=\"editMenu\">Edit</button>\r\n      <mat-menu #editMenu=\"matMenu\">\r\n        <button mat-menu-item (click)=\"onUndo()\">Undo</button>\r\n        <button mat-menu-item (click)=\"onRedo()\">Redo</button>\r\n        <button mat-menu-item (click)=\"onClearHistory()\">Clear History</button>\r\n      </mat-menu>\r\n    </div>\r\n\r\n  </mat-toolbar-row>\r\n</mat-toolbar>\r\n"

/***/ }),

/***/ "./src/app/top-tool-bar/top-tool-bar.component.ts":
/*!********************************************************!*\
  !*** ./src/app/top-tool-bar/top-tool-bar.component.ts ***!
  \********************************************************/
/*! exports provided: TopToolBarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TopToolBarComponent", function() { return TopToolBarComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _engine_engine_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../engine/engine.component */ "./src/app/engine/engine.component.ts");
/* harmony import */ var three_full__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three-full */ "./node_modules/three-full/builds/Three.es.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../_services */ "./src/app/_services/index.ts");






var TopToolBarComponent = /** @class */ (function () {
    function TopToolBarComponent(comp, router, authenticationService) {
        var _this = this;
        this.comp = comp;
        this.router = router;
        this.authenticationService = authenticationService;
        this.engServ = this.comp.getEngineService();
        this.authenticationService.currentUser.subscribe(function (x) { return _this.currentUser = x; });
    }
    TopToolBarComponent.prototype.ngOnInit = function () {
    };
    TopToolBarComponent.prototype.onSignOut = function () {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    };
    // Add menu functions
    // https://github.com/mrdoob/three.js/blob/master/editor/js/Menubar.Add.js
    // Font converted using: http://gero3.github.io/facetype.js/
    // Font Loader for loading font: https://stackoverflow.com/questions/37314902/adding-text-in-three-js-over-some-object?rq=1
    TopToolBarComponent.prototype.onAddText = function () {
        var _this = this;
        var loader = new three_full__WEBPACK_IMPORTED_MODULE_3__["FontLoader"]();
        loader.load('../../assets/fonts/Times_New_Roman_Cyr_Regular.json', function (font) {
            var inputText = window.prompt("Please enter your text", "Text");
            if (!inputText)
                inputText = "Text";
            var textGeometry = new three_full__WEBPACK_IMPORTED_MODULE_3__["TextGeometry"](inputText, {
                font: font,
                size: 50,
                height: 10,
                curveSegments: 12,
                bevelThickness: 1,
                bevelSize: 1,
                bevelEnabled: true
            });
            var textMaterial = new three_full__WEBPACK_IMPORTED_MODULE_3__["MeshPhongMaterial"]({ color: 0xff0000, specular: 0xffffff });
            var mesh = new three_full__WEBPACK_IMPORTED_MODULE_3__["Mesh"](textGeometry, textMaterial);
            mesh.position.set(0, 0, 0);
            mesh.name = 'Text';
            _this.engServ.addObject(mesh);
        });
    };
    TopToolBarComponent.prototype.onAddPlane = function () {
        var geometry = new three_full__WEBPACK_IMPORTED_MODULE_3__["PlaneBufferGeometry"](300, 300, 1, 1);
        var material = new three_full__WEBPACK_IMPORTED_MODULE_3__["MeshStandardMaterial"]();
        var mesh = new three_full__WEBPACK_IMPORTED_MODULE_3__["Mesh"](geometry, material);
        mesh.position.set(0, 0, 0);
        mesh.name = 'Plane';
        this.engServ.addObject(mesh);
    };
    TopToolBarComponent.prototype.onAddBox = function () {
        var geometry = new three_full__WEBPACK_IMPORTED_MODULE_3__["BoxBufferGeometry"](100, 100, 100, 1, 1, 1);
        var mesh = new three_full__WEBPACK_IMPORTED_MODULE_3__["Mesh"](geometry, new three_full__WEBPACK_IMPORTED_MODULE_3__["MeshStandardMaterial"]());
        mesh.name = 'Box';
        mesh.position.set(0, 0, 0);
        this.engServ.addObject(mesh);
    };
    TopToolBarComponent.prototype.onAddCircle = function () {
        var geometry = new three_full__WEBPACK_IMPORTED_MODULE_3__["CircleBufferGeometry"](100, 8, 0, Math.PI * 2);
        var mesh = new three_full__WEBPACK_IMPORTED_MODULE_3__["Mesh"](geometry, new three_full__WEBPACK_IMPORTED_MODULE_3__["MeshStandardMaterial"]());
        mesh.name = 'Circle';
        mesh.position.set(0, 0, 0);
        this.engServ.addObject(mesh);
    };
    TopToolBarComponent.prototype.onAddCylinder = function () {
        var geometry = new three_full__WEBPACK_IMPORTED_MODULE_3__["CylinderBufferGeometry"](50, 50, 200, 8, 1, false, 0, Math.PI * 2);
        var mesh = new three_full__WEBPACK_IMPORTED_MODULE_3__["Mesh"](geometry, new three_full__WEBPACK_IMPORTED_MODULE_3__["MeshStandardMaterial"]());
        mesh.name = 'Cylinder';
        mesh.position.set(0, 0, 0);
        this.engServ.addObject(mesh);
    };
    TopToolBarComponent.prototype.onAddSphere = function () {
        var geometry = new three_full__WEBPACK_IMPORTED_MODULE_3__["SphereBufferGeometry"](50, 80, 60, 0, Math.PI * 2, 0, Math.PI);
        var mesh = new three_full__WEBPACK_IMPORTED_MODULE_3__["Mesh"](geometry, new three_full__WEBPACK_IMPORTED_MODULE_3__["MeshStandardMaterial"]());
        mesh.name = 'Sphere';
        mesh.position.set(0, 0, 0);
        this.engServ.addObject(mesh);
    };
    TopToolBarComponent.prototype.onAddIsosahedron = function () {
        var geometry = new three_full__WEBPACK_IMPORTED_MODULE_3__["IcosahedronBufferGeometry"](50, 0);
        var mesh = new three_full__WEBPACK_IMPORTED_MODULE_3__["Mesh"](geometry, new three_full__WEBPACK_IMPORTED_MODULE_3__["MeshStandardMaterial"]());
        mesh.name = 'Icosahedron';
        mesh.position.set(0, 0, 0);
        this.engServ.addObject(mesh);
    };
    TopToolBarComponent.prototype.onAddTorous = function () {
        var geometry = new three_full__WEBPACK_IMPORTED_MODULE_3__["TorusBufferGeometry"](100, 30, 8, 6, Math.PI * 2);
        var mesh = new three_full__WEBPACK_IMPORTED_MODULE_3__["Mesh"](geometry, new three_full__WEBPACK_IMPORTED_MODULE_3__["MeshStandardMaterial"]());
        mesh.name = 'Torus';
        mesh.position.set(0, 0, 0);
        this.engServ.addObject(mesh);
    };
    TopToolBarComponent.prototype.onAddTorousKnot = function () {
        var geometry = new three_full__WEBPACK_IMPORTED_MODULE_3__["TorusKnotBufferGeometry"](100, 30, 64, 8, 2, 3);
        var mesh = new three_full__WEBPACK_IMPORTED_MODULE_3__["Mesh"](geometry, new three_full__WEBPACK_IMPORTED_MODULE_3__["MeshStandardMaterial"]());
        mesh.name = 'TorusKnot';
        mesh.position.set(0, 0, 0);
        this.engServ.addObject(mesh);
    };
    TopToolBarComponent.prototype.onAddTube = function () {
        var path = new three_full__WEBPACK_IMPORTED_MODULE_3__["CatmullRomCurve3"]([
            new three_full__WEBPACK_IMPORTED_MODULE_3__["Vector3"](2, 2, -2),
            new three_full__WEBPACK_IMPORTED_MODULE_3__["Vector3"](2, -2, -0.6666666666666667),
            new three_full__WEBPACK_IMPORTED_MODULE_3__["Vector3"](-2, -2, 0.6666666666666667),
            new three_full__WEBPACK_IMPORTED_MODULE_3__["Vector3"](-2, 2, 2)
        ]);
        var geometry = new three_full__WEBPACK_IMPORTED_MODULE_3__["TubeBufferGeometry"](path, 64, 100, 80, false);
        var mesh = new three_full__WEBPACK_IMPORTED_MODULE_3__["Mesh"](geometry, new three_full__WEBPACK_IMPORTED_MODULE_3__["MeshStandardMaterial"]());
        mesh.name = 'Tube';
        mesh.position.set(0, 0, 0);
        this.engServ.addObject(mesh);
    };
    TopToolBarComponent.prototype.onAddLathe = function () {
        // https://threejs.org/docs/#api/en/geometries/LatheBufferGeometry
        var points = [];
        for (var i = 0; i < 10; i++) {
            points.push(new three_full__WEBPACK_IMPORTED_MODULE_3__["Vector2"](Math.sin(i * 0.2) * 100 + 5, (i - 5) * 20));
        }
        var geometry = new three_full__WEBPACK_IMPORTED_MODULE_3__["LatheBufferGeometry"](points, 12, 0, Math.PI * 2);
        var mesh = new three_full__WEBPACK_IMPORTED_MODULE_3__["Mesh"](geometry, new three_full__WEBPACK_IMPORTED_MODULE_3__["MeshStandardMaterial"]({ side: three_full__WEBPACK_IMPORTED_MODULE_3__["DoubleSide"] }));
        mesh.name = 'Lathe';
        mesh.position.set(0, 0, 0);
        this.engServ.addObject(mesh);
    };
    TopToolBarComponent.prototype.onAddSprite = function () {
        var sprite = new three_full__WEBPACK_IMPORTED_MODULE_3__["Sprite"](new three_full__WEBPACK_IMPORTED_MODULE_3__["SpriteMaterial"]());
        sprite.name = 'Sprite';
        sprite.scale.set(200, 200, 1);
        sprite.position.set(0, 0, 0);
        this.engServ.addObject(sprite);
    };
    TopToolBarComponent.prototype.onAddPointLight = function () {
        var color = 0xffffff;
        var intensity = 1;
        var distance = 0;
        var light = new three_full__WEBPACK_IMPORTED_MODULE_3__["PointLight"](color, intensity, distance);
        light.name = 'PointLight';
        light.position.set(10, 10, 0);
        this.engServ.addObject(light);
    };
    TopToolBarComponent.prototype.onAddDirectionalLight = function () {
        var color = 0xffffff;
        var intensity = 1;
        var light = new three_full__WEBPACK_IMPORTED_MODULE_3__["DirectionalLight"](color, intensity);
        light.name = 'DirectionalLight';
        light.target.name = 'DirectionalLight Target';
        light.position.set(10, 10, 0);
        this.engServ.addObject(light);
    };
    TopToolBarComponent.prototype.onAddSpotLight = function () {
        var color = 0xffffff;
        var intensity = 1;
        var distance = 0;
        var angle = Math.PI * 0.1;
        var penumbra = 0;
        var light = new three_full__WEBPACK_IMPORTED_MODULE_3__["SpotLight"](color, intensity, distance, angle, penumbra);
        light.name = 'SpotLight';
        light.target.name = 'SpotLight Target';
        light.position.set(10, 10, 0);
        this.engServ.addObject(light);
    };
    TopToolBarComponent.prototype.onAddHemisphereLight = function () {
        var skyColor = 0x00aaff;
        var groundColor = 0xffaa00;
        var intensity = 1;
        var light = new three_full__WEBPACK_IMPORTED_MODULE_3__["HemisphereLight"](skyColor, groundColor, intensity);
        light.name = 'HemisphereLight';
        light.position.set(10, 10, 0);
        this.engServ.addObject(light);
    };
    TopToolBarComponent.prototype.onAddAmbientLight = function () {
        var color = 0x222222;
        var light = new three_full__WEBPACK_IMPORTED_MODULE_3__["AmbientLight"](color);
        light.name = 'AmbientLight';
        light.position.set(10, 10, 0);
        this.engServ.addObject(light);
        this.engServ.select(light);
    };
    TopToolBarComponent.prototype.onAddImage = function () {
        this.engServ.insertImage();
    };
    // File Menu
    TopToolBarComponent.prototype.onNew = function () {
        if (confirm('Unsaved data will be lost. Are you sure?')) {
            this.engServ.clear();
        }
    };
    // https://github.com/mrdoob/three.js/blob/master/editor/js/Menubar.File.js
    // https://www.quora.com/In-JavaScript-how-do-I-read-a-local-JSON-file
    TopToolBarComponent.prototype.onImport = function () {
        var _this = this;
        var fileInput = document.createElement('input');
        fileInput.multiple = false;
        fileInput.type = 'file';
        fileInput.click();
        fileInput.addEventListener('change', function () {
            if (fileInput.files && fileInput.files[0]) {
                var reader = new FileReader();
                var json_1;
                reader.onload = function (e) {
                    try {
                        json_1 = JSON.parse(e.target.result);
                        _this.engServ.clear();
                        _this.engServ.fromJSON(json_1);
                    }
                    catch (error) {
                        console.error(error);
                    }
                    ;
                };
                reader.readAsText(fileInput.files[0]);
            }
        });
    };
    // exports json of editor
    // https://github.com/mrdoob/three.js/blob/master/editor/js/Menubar.File.js
    TopToolBarComponent.prototype.onExport = function () {
        this.engServ.select(null);
        var output = this.engServ.toJSON();
        try {
            output = JSON.stringify(output, this.parseNumber, '\t');
            output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
        }
        catch (e) {
            output = JSON.stringify(output);
        }
        this.saveString(output, 'scene.json');
    };
    TopToolBarComponent.prototype.parseNumber = function (key, value) {
        return typeof value === 'number' ? parseFloat(value.toFixed(6)) : value;
    };
    // saves json given file name and blob
    // https://github.com/mrdoob/three.js/blob/master/editor/js/Menubar.File.js
    TopToolBarComponent.prototype.save = function (blob, filename) {
        var link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link);
        link.href = URL.createObjectURL(blob);
        link.download = filename || 'data.json';
        link.click();
        document.body.removeChild(link);
    };
    // saves json given string
    // https://github.com/mrdoob/three.js/blob/master/editor/js/Menubar.File.js
    TopToolBarComponent.prototype.saveString = function (text, filename) {
        this.save(new Blob([text], { type: 'text/plain' }), filename);
    };
    TopToolBarComponent.prototype.onScreenshot = function () {
        this.engServ.saveAsImage();
    };
    // editMenu
    TopToolBarComponent.prototype.onClearHistory = function () {
    };
    TopToolBarComponent.prototype.onRedo = function () {
    };
    TopToolBarComponent.prototype.onUndo = function () {
    };
    TopToolBarComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            providers: [_engine_engine_component__WEBPACK_IMPORTED_MODULE_2__["EngineComponent"]],
            selector: 'app-top-tool-bar',
            template: __webpack_require__(/*! ./top-tool-bar.component.html */ "./src/app/top-tool-bar/top-tool-bar.component.html"),
            styles: [__webpack_require__(/*! ./top-tool-bar.component.css */ "./src/app/top-tool-bar/top-tool-bar.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_engine_engine_component__WEBPACK_IMPORTED_MODULE_2__["EngineComponent"],
            _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"],
            _services__WEBPACK_IMPORTED_MODULE_5__["AuthenticationService"]])
    ], TopToolBarComponent);
    return TopToolBarComponent;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false,
    version: __webpack_require__(/*! ../../package.json */ "./package.json").version
};


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _polyfills_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./polyfills.ts */ "./src/polyfills.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! hammerjs */ "./node_modules/hammerjs/hammer.js");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(hammerjs__WEBPACK_IMPORTED_MODULE_5__);






if (_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_2__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_3__["AppModule"], [{
        defaultEncapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewEncapsulation"].None
    }]).catch(function (err) { return console.log(err); });


/***/ }),

/***/ "./src/polyfills.ts":
/*!**************************!*\
  !*** ./src/polyfills.ts ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var zone_js_dist_zone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! zone.js/dist/zone */ "./node_modules/zone.js/dist/zone.js");
/* harmony import */ var zone_js_dist_zone__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(zone_js_dist_zone__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! hammerjs */ "./node_modules/hammerjs/hammer.js");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(hammerjs__WEBPACK_IMPORTED_MODULE_1__);
/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes Safari >= 10, Chrome >= 55 (including Opera),
 * Edge >= 13 on the desktop, and iOS 10 and Chrome on mobile.
 *
 * Learn more in https://angular.io/guide/browser-support
 */
/***************************************************************************************************
 * BROWSER POLYFILLS
 */
/** IE9, IE10, IE11, and Chrome <55 requires all of the following polyfills.
 *  This also includes Android Emulators with older versions of Chrome and Google Search/Googlebot
 */
// import 'core-js/es6/symbol';
// import 'core-js/es6/object';
// import 'core-js/es6/function';
// import 'core-js/es6/parse-int';
// import 'core-js/es6/parse-float';
// import 'core-js/es6/number';
// import 'core-js/es6/math';
// import 'core-js/es6/string';
// import 'core-js/es6/date';
// import 'core-js/es6/array';
// import 'core-js/es6/regexp';
// import 'core-js/es6/map';
// import 'core-js/es6/weak-map';
// import 'core-js/es6/set';
/** IE10 and IE11 requires the following for NgClass support on SVG elements */
// import 'classlist.js';  // Run `npm install --save classlist.js`.
/** IE10 and IE11 requires the following for the Reflect API. */
// import 'core-js/es6/reflect';
/**
 * Web Animations `@angular/platform-browser/animations`
 * Only required if AnimationBuilder is used within the application and using IE/Edge or Safari.
 * Standard animation support in Angular DOES NOT require any polyfills (as of Angular 6.0).
 */
// import 'web-animations-js';  // Run `npm install --save web-animations-js`.
/**
 * By default, zone.js will patch all possible macroTask and DomEvents
 * user can disable parts of macroTask/DomEvents patch by setting following flags
 * because those flags need to be set before `zone.js` being loaded, and webpack
 * will put import in the top of bundle, so user need to create a separate file
 * in this directory (for example: zone-flags.ts), and put the following flags
 * into that file, and then add the following code before importing zone.js.
 * import './zone-flags.ts';
 *
 * The flags allowed in zone-flags.ts are listed here.
 *
 * The following flags will work for all browsers.
 *
 * (window as any).__Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
 * (window as any).__Zone_disable_on_property = true; // disable patch onProperty such as onclick
 * (window as any).__zone_symbol__BLACK_LISTED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames
 *
 *  in IE/Edge developer tools, the addEventListener will also be wrapped by zone.js
 *  with the following flag, it will bypass `zone.js` patch for IE/Edge
 *
 *  (window as any).__Zone_enable_cross_context_check = true;
 *
 */
/***************************************************************************************************
 * Zone JS is required by default for Angular itself.
 */
 // Included with Angular CLI.

/***************************************************************************************************
 * APPLICATION IMPORTS
 */


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\zhxl0903\CSCC09\Project_Final\src\main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map