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

var getDescendant = function (obj, ancestry) {
  return ancestry.split('.').reduce(function (parent, child, i, arr) {
    return parent && parent[child] || (parent.addProp(child), parent[child]);
  }, obj);
};

var getObservable = function (element, observable, obj) {
  obj = obj || model;
  if (!observable) observable = element.getAttribute('data-j') || '';
  return typeof observable === 'string' ? getDescendant(obj, observable) : observable;
};

var getElementType = function (element) {
  var type = element.nodeName;
  if (type === 'INPUT') type = element.type.toUpperCase();
  return type;
};

var bindLoop = function (element, obj) {
  // var binding = element.getAttribute('data-j-loop').split(':'),
  //   path = binding[0],
  //   prop = binding[1],
  //   observable = getObservable(element, path, obj),
  //   i = 0;

  // var inner = document.createDocumentFragment();
  // var children = element.childNodes;
  // for (i = 0; i < children.length; i++) {
  //   inner.appendChild(children[i].cloneNode(true));
  // }
  // element.innerHTML = '';

  // observable.subscribe(function () {
  //   for (i = 0; i < observable.value.length; i++) {
  //     var newParentObject = new Observable();
  //     newParentObject.addProp(prop);
  //     newParentObject[prop].write(observable.value[i]);
  //     var newElement = inner.cloneNode(true);
  //     element.appendChild(newElement);
  //     bindElement(element.lastElementChild, newParentObject);
  //   }
  // });
  // element.setAttribute('bound', true);
};

var bindData = function (element, obj) {
  var binding = element.getAttribute('data-j').split(':'),
    path = binding[0],
    prop = binding[1],
    observable = getObservable(element, path, obj);
  element[prop] = observable.value;
  observable.subscribe(function () {
    element[prop] = observable.value;
  });
  _(element).on('change input', function () {
    observable.value = element.value;
  });
  element.setAttribute('bound', true);
};

var bindElement = function (element, obj) {
  // if (element.getAttribute('data-j-loop')) bindLoop(element, obj);
  if (element.getAttribute('data-j')) bindData(element, obj);
};

var bindAll = _.bindAll = function (parent) {
  parent = parent || document;
  // _(parent).find('[data-j-loop]:not([bound])').each(function (e) {
  //   bindLoop(e);
  // });
  _(parent).find('[data-j]:not([bound])').each(function (e) {
    bindData(e);
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