(function (_) {
  'use strict';
  _.addModule('data', function () {
    /**
     * Provides an object representing the data attributes of the wrapped elements.
     * 
     * @memberof _
     * @alias _(o).data
     * 
     * @return {object}                - An object mapping attribute names to their values.
     */
    this.prototype.data = function () {
      var out = {};
      this.each(function (el) {
        if (el.hasAttributes()) {
          var attrs = el.attributes;
          for(var i=0; i<attrs.length; i++) {
            var data = attrs[i].name.split('data-')[1];
            if(typeof data !== 'undefined') {
              out[data] = attrs[i].value;
            }
          }
        }
      });
      return out;
    };
  }, ['each']);
})(_ || {});
