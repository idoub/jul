import _ from './jul.js';
import each from './each.js';
import on from './on.js';
import ready from './ready.js';
import find from './find.js';

var model = _.model = new Observable();

var eventNames = ["DOMAttrModified", "DOMAttributeNameChanged", "DOMCharacterDataModified", "DOMContentLoaded", "DOMElementNameChanged", "DOMNodeInserted", "DOMNodeInsertedIntoDocument", "DOMNodeRemoved", "DOMNodeRemovedFromDocument", "DOMSubtreeModified", "abort", "abort", "abort", "abort", "abort", "abort", "afterprint", "afterprint", "animationend", "animationend", "animationiteration", "animationiteration", "animationstart", "animationstart", "appinstalled", "audioend", "audioprocess", "audioprocess", "audiostart", "auxclick", "beforeprint", "beforeprint", "beforeunload", "beforeunload", "beginEvent", "blocked", "blur", "blur", "blur", "boundary", "cached", "cached", "canplay", "canplay", "canplaythrough", "canplaythrough", "change", "chargingchange", "chargingtimechange", "checking", "click", "click", "click", "close", "close", "complete", "complete", "complete", "compositionend", "compositionend", "compositionstart", "compositionstart", "compositionupdate", "compositionupdate", "contextmenu", "contextmenu", "copy", "copy", "cut", "cut", "dblclick", "dblclick", "devicechange", "devicelight", "devicemotion", "deviceorientation", "deviceproximity", "dischargingtimechange", "downloading", "drag", "drag", "dragend", "dragend", "dragenter", "dragenter", "dragleave", "dragleave", "dragover", "dragover", "dragstart", "dragstart", "drop", "drop", "durationchange", "durationchange", "emptied", "emptied", "end", "end", "endEvent", "ended", "ended", "ended", "error", "error", "error", "error", "error", "error", "error", "error", "error", "error", "error", "focus", "focus", "focus", "focusin", "focusin", "focusout", "focusout", "fullscreenchange", "fullscreenchange", "fullscreenerror", "fullscreenerror", "gamepadconnected", "gamepaddisconnected", "gotpointercapture", "hashchange", "input", "invalid", "keydown", "keydown", "keypress", "keypress", "keyup", "keyup", "languagechange", "levelchange", "load", "load", "load", "load", "loadeddata", "loadeddata", "loadedmetadata", "loadedmetadata", "loadend", "loadend", "loadstart", "loadstart", "lostpointercapture", "mark", "message", "message", "message", "message", "message", "message", "messageerror", "mousedown", "mousedown", "mouseenter", "mouseenter", "mouseleave", "mouseleave", "mousemove", "mousemove", "mouseout", "mouseout", "mouseover", "mouseover", "mouseup", "mouseup", "nomatch", "notificationclick", "noupdate", "obsolete", "offline", "offline", "online", "online", "open", "open", "open", "orientationchange", "pagehide", "pagehide", "pageshow", "pageshow", "paste", "paste", "pause", "pause", "pause", "play", "play", "playing", "playing", "pointercancel", "pointerdown", "pointerenter", "pointerleave", "pointerlockchange", "pointerlockchange", "pointerlockerror", "pointerlockerror", "pointermove", "pointerout", "pointerover", "pointerup", "popstate", "popstate", "progress", "progress", "progress", "push", "pushsubscriptionchange", "ratechange", "ratechange", "readystatechange", "repeatEvent", "requestprogress", "reset", "reset", "resize", "resize", "resourcetimingbufferfull", "responseprogress", "result", "resume", "scroll", "scroll", "seeked", "seeked", "seeking", "seeking", "select", "select", "selectionchange", "selectstart", "show", "stalled", "statechange", "submit", "suspend", "timeout", "timeupdate", "transitioncancel", "transitionend", "transitionrun", "transitionstart", "unload", "volumechange", "vrdisplayactivate", "vrdisplayblur", "vrdisplayconnect", "vrdisplaydeactivate", "vrdisplaydisconnect", "vrdisplayfocus", "vrdisplaypresentchange", "waiting", "wheel"];
var events = _.events = {};

function Observable(obj) {
  var parent;
  var listeners = [];
  var value = '';

  Object.defineProperty(this, 'value', {
    get: function () {
      return value;
    },
    set: function (newValue) {
      value = newValue;
      this.notify();
      if (parent) parent.notify();
    }
  });

  Object.defineProperty(this, 'addProp', {
    value: function (name) {
      this[name] = new Observable();
      this[name].setParent(this);
    }
  });

  Object.defineProperty(this, 'setParent', {
    value: function (newParent) {
      parent = newParent;
    }
  });

  Object.defineProperty(this, 'subscribe', {
    value: function (listener) {
      listeners.push(listener);
    }
  });

  Object.defineProperty(this, 'notify', {
    value: function () {
      listeners.forEach(function (listener) {
        listener(value);
      });
    }
  });

  Object.defineProperty(this, 'write', {
    value: function (obj) {
      var keys = Object.keys(obj);
      for (var i = 0; i < keys.length; i++) {
        var prop = keys[i];
        if (!this.hasOwnProperty(prop)) this.addProp(prop);
        if (obj[prop !== null &&
            typeof obj[prop] === 'object' &&
            !Array.isArray(obj[prop])]) {
          this[prop].write(obj[prop]);
        } else {
          this[prop].value = obj[prop];
        }
      }
    }
  });

  Object.defineProperty(this, 'read', {
    value: function () {
      var obj = {};
      var keys = Object.keys(this);
      for (var i = 0; i < keys.length; i++) {
        var prop = keys[i];
        if (typeof this[prop] === 'string') return this[prop];
        if (Object.keys(this[prop]).length > 0) {
          obj[prop] = this[prop].read();
        } else {
          obj[prop] = this[prop].value;
        }
      }
      return obj;
    }
  });

  if (obj) this.write(obj);
}

var writeModel = _.writeModel = function (obj, mod) {
  mod = mod || model;
  mod.write(obj);
};

var readModel = _.readModel = function (mod) {
  mod = mod || model;
  return mod.read();
};

var getDescendant = function (context, ancestry) {
  return ancestry.split('.').reduce(function (parent, child, i, arr) {
    return parent && parent[child] || (parent.addProp(child), parent[child]);
  }, context);
};

var getObservable = function (element, observable, context) {
  context = context || model;
  if (!observable) observable = element.getAttribute('data-j') || '';
  return typeof observable === 'string' ? getDescendant(context, observable) : observable;
};

var getElementType = function (element) {
  var type = element.nodeName;
  if (type === 'INPUT') type = element.type.toUpperCase();
  return type;
};

var bindLoop = function (element, context) {
  if (element.children.length > 1) return console.log('Cannot bind multiple children within loop.');

  var path = element.getAttribute('data-j-loop'),
    observable = getObservable(element, path, context),
    inner = element.inner || document.createDocumentFragment(),
    i = 0;

  if (inner.children.length === 0) inner.appendChild(element.children[0].cloneNode(true));
  element.innerHTML = '';

  observable.subscribe(function () {
    element.innerHTML = '';
    for (var i = 0; i < observable.value.length; i++) {
      element.appendChild(inner.cloneNode(true));
      bindAll(element.lastElementChild, new Observable(observable.value[i]));
    }
  });
  element.setAttribute('bound', true);
};

var bindData = function (element, context) {
  var binding = element.getAttribute('data-j').split(':'),
    path = binding[0],
    prop = binding[1],
    observable = getObservable(element, path, context);
  element[prop] = observable.value;
  observable.subscribe(function () {
    element[prop] = observable.value;
  });
  _(element).on('change input', function () {
    observable.value = element.value;
  });
  element.setAttribute('bound', true);
};

var bindEvent = function (element, context) {
  var binding = element.getAttribute('data-j-event').split(':'),
    evt = binding[0],
    name = binding[1],
    path = binding.length > 2 ? binding[2] : undefined,
    observable = path ? getObservable(element, path, context) : undefined,
    cb = console.log;

  element.addEventListener(evt, function (e) {
    if (events.hasOwnProperty(name)) cb = events[name];
    e.preventDefault();
    cb(observable.value || e);
  });
};

var bindElement = function (element, context) {
  if (element.getAttribute('data-j-event') && !element.getAttribute('bound')) bindEvent(element, context);
  if (element.getAttribute('data-j-loop') && !element.getAttribute('bound')) bindLoop(element, obj);
  if (element.getAttribute('data-j') && !element.getAttribute('bound')) bindData(element, context);
};

var bindAll = _.bindAll = function (parent, context) {
  parent = parent || document;
  _(parent).find('[data-j-event]:not([bound])').each(function (e) {
    bindEvent(e, context);
  });
  _(parent).find('[data-j-loop]:not([bound])').each(function (e) {
    bindLoop(e, context);
  });
  _(parent).find('[data-j]:not([bound])').each(function (e) {
    bindData(e, context);
  });
};

_.bindEvent = function (name, cb) {
  events[name] = cb;
};

_.ready(function (evt) {
  bindAll(document);
});

export default _;

//{foo: 'Hello World', bars: [{first: 'Isaac', last: 'Doub'},{first: 'John', last: 'Smith'},{first: 'Peter', last: 'Parker'}]}