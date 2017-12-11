/**
 * Gem: A type of JUL!
 * 
 * A Gem is an observable object and is used to bind objects to elements on the
 * page. It has several properties that help it to maintain a tree structure,
 * convert to and from a normal object, and notify listeners when the object
 * changes.
 * 
 * @constructor
 * @alias Gem
 */
function Gem(obj) {
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
      this[name] = new Gem();
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
window.Gem = Gem;

export default Gem;