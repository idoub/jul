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

    var elementChange = function(evt) {
      console.log(evt.target, 'changed');
    };

    var bind = function(element) {
      if(!(element instanceof Node)) {
        console.log(element,' is not recognised as a Node and will not be bound.');
        return;
      }

      var data = _(element).data().j;
      if(typeof data === 'undefined') {
        console.log(element,' does not have the binding attribute \'data-j\' and will not be bound.');
      }

      element.addEventListener('change',elementChange);
      element.addEventListener('input',elementChange);

      data = data.replace(/\r?\n|\r|\s/g,'');
      var bindings = data.split(':');
      var boundObj = findDescendant(bindings.shift().split('.'));
      for(var i=0;i<bindings.length;i++) {
        boundObj.addChild(bindings[i]);
      }
      boundObj.bind(element);
    };

    this.bind = bind;
    this.prototype.bind = function() {
      this.each(function(e){
        bind(e);
      });
    };
  },['each','data','extend','pubsub']);
})(_||{});