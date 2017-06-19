(function (_) {
  'use strict';
  _.addModule('bind', function () {
    var state = new Gem();

    function Gem(existing) {
      var bound = [];

      this.addChild = function(childName) {
        var value;
        Object.defineProperty(this,childName,{
          get: function() { return value;},
          set: function(v) { 
            _.each(bound,function(e) {
              updateElement(e,childName,v);
            });
            value = v;
          }
        });
      };

      this.bind = function(element) {
        bound.push(element);
      };

      for(var prop in existing) {
        if(existing.hasOwnProperty(prop)) {
          this.addChild(prop);
          this[prop] = existing[prop];
        }
      }
    }

    var updateElement = function(e,k,v) {
      console.log('Updating Element',e,k,v);
      switch(k) {
        case 'text':
          e.innerText = v;
          break;
        default:
          e.setAttribute(k,v);
          break;
      }
    };

    var getData = function(element) {
      if(!(element instanceof Node)) throw new Error('Element is not recognised as a Node and cannot be bound.');
      var data = _(element).data().j;
      if(typeof data === 'undefined') throw new Error('Element does not have the binding attribute \'data-j\' and cannot be bound.');
      return data.replace(/\r?\n|\r|\s/g,'');
    };

    var findDescendant = function(generations,parent) {
      var childName = generations.shift();

      parent = parent || state;
      if(!(parent instanceof Gem)) parent = new Gem(parent);

      parent[childName] = parent[childName] || new Gem();
      if(!(parent[childName] instanceof Gem)) parent[childName] = new Gem(parent[childName]);

      if(generations.length === 0) {
        return parent[childName];
      }

      return findDescendant(generations,parent[childName]);
    };

    var bind = function(e) {
      // If nothing has been passed, bind each element with data-j attribute
      if(!e) {this('[data-j]').each(this.bind); return;}

      // Get the data-j attribute
      var segments = getData(e).split(':');
      var boundObj = findDescendant(segments[0].split('.'));
      boundObj.bind(e);

      var props = segments[1].split(',');
      for(var i=0;i<props.length;i++) {
        updateElement(e,props[i],boundObj[props[i]]);
      }
    };

    this.bind = bind;
    this.state = state;
  },[]);
})(_||{});

_.state.link = {
  href: '../dist/jul.min.js',
  text: 'JUL',
  download: '../dist/jul.min.js'
};

_.state.input = {
  id: 'mood',
  for: 'mood',
  text: 'Happy',
  type: 'checkbox',
  value: 'mood'
};

_.state.items = [
  {
    id: 'item1',
    text: 'item1'
  },
  {
    id: 'item2',
    text: 'item2'
  },
  {
    id: 'item3',
    text: 'item3'
  },
  {
    id: 'item4',
    text: 'item4'
  },
];

_.state.buttonClick = function(evt) {
  console.log('clicked the button', evt.target);
};