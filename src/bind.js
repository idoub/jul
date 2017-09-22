import _ from './jul.js';
import each from './each.js';
import on from './on.js';
import ready from './ready.js';
import find from './find.js';

var model = _.model = new Observable();

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
}

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
  if (element.children.length > 1) {
    console.log('Cannot bind multiple children within loop.');
    return;
  }

  var binding = element.getAttribute('data-j-loop').split(':'),
    path = binding[0],
    prop = binding[1],
    observable = getObservable(element, path, context),
    inner = element.inner || document.createDocumentFragment(),
    i = 0;

  if (inner.children.length === 0) {
    inner.appendChild(element.children[0].cloneNode(true));
  }
  element.innerHTML = '';

  observable.subscribe(function () {
    element.innerHTML = '';
    for (var i = 0; i < observable.value.length; i++) {
      var context = new Observable();
      context.addProp(prop);
      context[prop].write(observable.value[i]);
      element.appendChild(inner.cloneNode(true));
      bindAll(element.lastElementChild, context);
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

var bindElement = function (element, context) {
  if (element.getAttribute('data-j-loop') && !element.getAttribute('bound')) bindLoop(element, obj);
  if (element.getAttribute('data-j') && !element.getAttribute('bound')) bindData(element, context);
};

var bindAll = _.bindAll = function (parent, context) {
  parent = parent || document;
  _(parent).find('[data-j-loop]:not([bound])').each(function (e) {
    bindLoop(e, context);
  });
  _(parent).find('[data-j]:not([bound])').each(function (e) {
    bindData(e, context);
  });
};

var writeModel = _.writeModel = function (obj, mod) {
  mod = mod || model;
  mod.write(obj);
};

var readModel = _.readModel = function (mod) {
  mod = mod || model;
  return mod.read();
};

_.ready(function (evt) {
  bindAll(document);
});

export default _;