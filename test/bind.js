(function (_) {
  'use strict';
  var state = new Gem();

  function Gem(existing) {
    var bound = [];

    this.addChild = function (childName) {
      var value;
      Object.defineProperty(this, childName, {
        get: function () {
          return value;
        },
        set: function (v) {
          _.each(bound, function (e) {
            updateElement(e, childName, v);
          });
          value = v;
        }
      });
    };

    this.bind = function (element) {
      bound.push(element);
    };

    for (var prop in existing) {
      if (existing.hasOwnProperty(prop)) {
        this.addChild(prop);
        this[prop] = existing[prop];
      }
    }

    this.bound = bound;
  }

  var updateProp = function (e, k, v) {
    switch (k) {
      case 'text':
        e.innerText = v;
        break;
      default:
        e.setAttribute(k, v);
        break;
    }
  };

  var updateElement = function (e, k, v) {
    var props = getData(e).split(':')[1].split(',');
    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      var attr = prop;
      if (prop.indexOf('-') >= 0) {
        var tmp = prop.split('-');
        attr = tmp[0];
        prop = tmp[1];
      }
      if (k === prop) updateProp(e, attr, v);
    }
  };

  var getElementType = function (e) {
    var type = e.nodeName;
    if (type === 'INPUT') type = e.type.toUpperCase();
    return type;
  };

  var updateObj = function (obj, key, val) {
    if (!(obj instanceof Gem)) obj = new Gem(obj);
    if (!obj.hasOwnProperty(key)) obj.addChild(key);
    obj[key] = val;
  };

  var updateObject = function (evt) {
    var segments = getData(evt.target).split(':');
    var boundObj = findDescendant(segments[0].split('.'));
    var type = getElementType(evt.target);
    switch (type) {
      case 'CHECKBOX':
        updateObj(boundObj, 'checked', evt.target.checked);
        break;
      case 'RADIO':
      case 'TEXTAREA':
        updateObj(boundObj, 'value', evt.target.value);
        break;
      default:
        console.dir(evt.target);
    }
  };

  var getData = function (element) {
    if (!(element instanceof Node)) throw new Error('Element is not recognised as a Node and cannot be bound.');
    var data = _(element).data().j;
    if (typeof data === 'undefined') throw new Error('Element does not have the binding attribute \'data-j\' and cannot be bound.');
    return data.replace(/\r?\n|\r|\s/g, '');
  };

  var findDescendant = function (generations, parent) {
    var childName = generations.shift();
    parent = parent || state;
    if (!(parent instanceof Gem)) parent = new Gem(parent);
    parent[childName] = parent[childName] || new Gem();
    if (!(parent[childName] instanceof Gem)) parent[childName] = new Gem(parent[childName]);
    if (generations.length === 0) return parent[childName];
    return findDescendant(generations, parent[childName]);
  };

  var bind = function (e) {
    // If nothing has been passed, bind each element with data-j attribute
    if (!e) {
      this('[data-j]').each(this.bind);
      return;
    }

    // Get the data-j attribute
    var segments = getData(e).split(':');
    var boundObj = findDescendant(segments[0].split('.'));
    boundObj.bind(e);

    var props = segments[1].split(',');
    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      var key = prop;
      if (prop.indexOf('-') >= 0) {
        var propKey = prop.split('-');
        prop = propKey[0];
        key = propKey[1];
      }
      updateElement(e, prop, boundObj[key]);
    }

    e.addEventListener('change', updateObject);
    e.addEventListener('input', updateObject);
  };

  _.bind = bind;
  _.state = state;
})(_ || {});

_.state.link = {
  href: '../dist/jul.min.js',
  text: 'JUL'
};

_.state.checkbox = {
  id: 'mood',
  for: 'mood',
  text: 'Happy',
  type: 'checkbox',
  value: 'mood'
};

_.state.radio = {
  type: 'radio',
  value: 'male'
};

// _.state.items = [{
//     id: 'item1',
//     text: 'item1'
//   },
//   {
//     id: 'item2',
//     text: 'item2'
//   },
//   {
//     id: 'item3',
//     text: 'item3'
//   },
//   {
//     id: 'item4',
//     text: 'item4'
//   },
// ];

_.state.buttonClick = function (evt) {
  console.log('clicked the button', evt.target);
};