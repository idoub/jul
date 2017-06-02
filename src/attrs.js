(function (_) {
  'use strict';
  _.addModule('attrs', function () {
    /**
     * Provides an object representing the attributes of the wrapped elements.
     * 
     * @memberof _
     * @alias _(o).attrs
     * 
     * @param {string|string[]} [name] - An optional parameter defining the attribute (or attributes) you wish to get.
     * @return {object}                - An object mapping attribute names to their values.
     */
    this.prototype.attrs = function (name) {
      name = name instanceof Array ? name : typeof name === 'string' ? [name] : undefined;
      var out = {};
      this.each(function (el) {
        if (el.hasAttributes()) {
          var attrs = el.attributes;
          for (var i = attrs.length - 1; i >= 0; i--) {
            if (typeof name === 'undefined' || name.indexOf(attrs[i].name) >= 0) {
              out[attrs[i].name] = attrs[i].value;
            }
          }
        }
      });
      return out;
    };
  }, ['each']);
})(_ || {});
