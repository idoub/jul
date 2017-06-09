(function (_) {
  'use strict';
  _.addModule('bind', function () {
    var Gem = function() {
      var self;
      var bound = [];

      this.addChild = function(childName) {
        self = self || {};
        if(self.hasOwnProperty(childName)) return this;
        self[childName] = undefined;
        Object.defineProperty(this,childName, {
          enumerable: true,
          get: function() {
            return self[childName];
          },
          set: function(newValue) {
            self[childName] = newValue;
            _(bound).each(function(el){
              updateElement(childName,el,newValue);
            });
          }
        });

        return this;
      };

      this.bind = function(element) {
        if(bound.indexOf(element) > -1) return;
        bound.push(element);
      };
    };

    this.Gem = Gem;

    this.bound = this.bound || new Gem();

    var updateElement = function(prop,element,value) {
      switch(prop) {
        case 'text':
          element.innerText = value;
          break;
        default:
          element.setAttribute(prop,value);
          break;
      }
    };

    var findDescendant = function(generations,parent) {
      parent = parent || _.bound;
      if(!(parent instanceof Gem)) parent = new Gem();
      var childName = generations.shift();
      parent.addChild(childName);
      parent[childName] = parent[childName] || new Gem();
      if(generations.length === 0) return parent[childName];
      return findDescendant(generations,parent[childName]);
    };

    var getData = function(element) {
      if(!(element instanceof Node)) {
        throw new Error('Element is not recognised as a Node and cannot be bound.');
      }

      var data = _(element).data().j;
      if(typeof data === 'undefined') {
        throw new Error('Element does not have the binding attribute \'data-j\' and cannot be bound.');
      }
      return data.replace(/\r?\n|\r|\s/g,'');
    };

    var elementChange = function(evt) {
      var data = getData(evt.target);
      var boundObj = findDescendant(data.split(':')[0].split('.'));
      boundObj.value = evt.target.value;
    };

    var bind = function(element) {
      var data = getData(element);
      element.addEventListener('change',elementChange);
      element.addEventListener('input',elementChange);

      var bindings = data.split(':');
      var boundObj = findDescendant(bindings.shift().split('.'));
      for(var i=0;i<bindings.length;i++) {
        boundObj.addChild(bindings[i]);
      }
      boundObj.bind(element);
    };

    this.bind = bind;
    this.prototype.bind = function() {
      this.each(function(e){bind(e);});
    };
    this.bindAll = function() {
      _('[data-j]').each(function(e){bind(e);});
    };
  },['each','data','extend','pubsub']);
})(_||{});