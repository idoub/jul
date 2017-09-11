(function (_) {
  'use strict';
  _.addModule('bind', function () {
    var bind = function(e) {
      if(!(e instanceof Node)) {
        console.log(e.toString() + ' is not recognised as a Node and will not be bound.');
        return;
      }
      if(typeof _(e).data().j === 'undefined') {
        console.log(e.toString() + ' does not have the binding attribute \'data-j\' and will not be bound.');
      }
    };

    this.bind = bind;
    this.prototype.bind = function() {
      this.e.each(function(e){
        bind(e);
      });
    };
  },['each','data']);
})(_||{});