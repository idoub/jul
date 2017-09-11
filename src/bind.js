import _ from './jul.js';
import each from './each.js';
import on from './on.js';

var model = new Observable();

function Observable() {
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
}

var getDescendant = function (obj, ancestry) {
  return ancestry.split('.').reduce(function (parent, child, i, arr) {
    return parent && parent[child] || (parent.addProp(child), parent[child]);
  }, obj);
};

var getObservable = function (element, observable) {
  if (!observable) observable = element.getAttribute('data-j') || '';
  return typeof observable === 'string' ? getDescendant(model, observable) : observable;
};

_.bindElement = function (element) {
  var binding = element.getAttribute('data-j').split(':'),
    path = binding[0],
    prop = binding[1],
    observable = getObservable(element, path);
  element[prop] = observable.value;
  observable.subscribe(function () {
    element[prop] = observable.value;
  });
  _(element).on('change input', function () {
    observable.value = element.value;
  });
};

var getElementType = function (element) {
  var type = element.nodeName;
  if (type === 'INPUT') type = element.type.toUpperCase();
  return type;
};

_.bindAll = function () {
  _('[data-j]').each(bindElement);
};

_.writeModel = function (obj, mod) {
  mod = mod || model;
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    var prop = keys[i];
    if (!mod.hasOwnProperty(prop)) mod.addProp(prop);
    if (obj[prop] !== null && typeof obj[prop] === 'object') writeModel(obj[prop], mod[prop]);
    else mod[prop].value = obj[prop];
  }
};

_.readModel = function (mod) {
  var obj = {};
  mod = mod || model;
  var keys = Object.keys(mod);
  for (var i = 0; i < keys.length; i++) {
    var prop = keys[i];
    if (Object.keys(mod[prop]).length > 0) obj[prop] = readModel(mod[prop]);
    else obj[prop] = mod[prop].value;
  }
  return obj;
};

export default _;