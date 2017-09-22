import _ from './jul.js';
import each from './each.js';
import on from './on.js';
import ready from './ready.js';
import find from './find.js';

var model = new Observable();
var events = {};

function Observable(obj) {
  var parent;
  var listeners = [];
  var value = '';

  var isPropWritable = function (prop) {
    return prop && typeof prop === 'object' && !Array.isArray(prop);
  };

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
        if (!this.hasOwnProperty(keys[i])) this.addProp(keys[i]);
        if (isPropWritable(obj[keys[i]])) this[keys[i]].write(obj[keys[i]]);
        else this[keys[i]].value = obj[keys[i]];
      }
    }
  });

  Object.defineProperty(this, 'read', {
    value: function () {
      var obj = {};
      var keys = Object.keys(this);
      for (var i = 0; i < keys.length; i++) {
        if (typeof this[keys[i]] === 'string') return this[keys[i]];
        if (Object.keys(this[keys[i]]).length > 0) obj[keys[i]] = this[keys[i]].read();
        else obj[keys[i]] = this[keys[i]].value;
      }
      return obj;
    }
  });

  if (obj) this.write(obj);
}

var writeModel = _.writeModel = function (obj, mod) {
  (mod || model).write(obj);
};

var readModel = _.readModel = function (mod) {
  return (mod || model).read();
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

  _(element).on(evt, function (e) {
    e.preventDefault();
    if (events.hasOwnProperty(name)) cb = events[name];
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