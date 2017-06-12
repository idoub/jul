(function (_) {
  'use strict';
  _.addModule('bind', function () {
    var bound = {};

    var updateElement = function(e,v) {
      console.log(e,v);
    };

    var getData = function(element) {
      if(!(element instanceof Node)) throw new Error('Element is not recognised as a Node and cannot be bound.');
      var data = _(element).data().j;
      if(typeof data === 'undefined') throw new Error('Element does not have the binding attribute \'data-j\' and cannot be bound.');
      return data.replace(/\r?\n|\r|\s/g,'');
    };

    var findDescendant = function(generations,parent) {
      parent = parent || bound;
      var childName = generations.shift();
      parent[childName] = parent[childName] || {};
      if(generations.length === 0) {
        return parent[childName];
      }
      return findDescendant(generations,parent[childName]);
    };

    var bind = function(o) {
      // If nothing has been passed, bind each element with data-j attribute
      if(!o) this('[data-j]').each(this.bind);
      // If o is an element, bind it
      if(o instanceof Node) {
        var data = getData(o);
        var props = data.split(',');
        for(var i=0;i<props.length;i++) {
          var segments = props[i].split(':');
          var boundObj = findDescendant(segments[1].split('.'));
          bind(boundObj);
          console.log(boundObj,segments[0]);
        }
      }
      // If o is an array-like object, try to bind each one
      if(o instanceof Object && o.hasOwnProperty(length)) _.each(o,this.bind);
      // Turn o into an object if it isn't and preserve it's value
      if(!(o instanceof Object)) {
        var tmp = o;
        o = {};
        o._value = tmp;
      }
      else { o._value = undefined; }
      if(!o.hasOwnProperty('value')) {
        o.bound = [];
        Object.defineProperty(o,'value',{
          get: function() {
            return o._value;
          },
          set: function(v) {
            _.each(o.bound,function(e){updateElement(e,v);});
            o._value = v;
          }
        });
      }
    };

    this.bind = bind;
    this.bound = bound;
  },['each',]);
})(_||{});