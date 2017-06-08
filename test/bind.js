(function (_) {
  'use strict';
  _.addModule('bind', function () {
    _.bound = _.bound || {};

    var findDescendant = function(generations) {
      var child = generations.shift();
      _.bound[child] = _.bound[child] || {};
      if(generation.length === 0) return child;
      return findDescendant(generations);
    };

    var bind = function(e) {
      if(!(e instanceof Node)) {
        console.log(e,' is not recognised as a Node and will not be bound.');
        return;
      }

      var data = _(e).data().j;
      if(typeof data === 'undefined') {
        console.log(e,' does not have the binding attribute \'data-j\' and will not be bound.');
      }

      // Sanitize data-j attribute
      data = data.replace(/\r?\n|\r|\s/g,'');
      var attributes = data.split(',');
      for(var i=0;i<attributes.length;i++) {
        var segments = attributes[i].split(':');
        var content = findDescendant(segments[1].split('.'));
        if(segments[0] === 'text') {
          e.innerText = content;
        } else {
          e.setAttribute(segments[0],content);
        }
      }
    };

    this.bind = bind;
    this.prototype.bind = function() {
      this.each(function(e){
        bind(e);
      });
    };
  },['each','data','extend']);
})(_||{});