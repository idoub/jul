(function (_) {
  'use strict';
  _.addModule('add', function () {
    /**
     * Get a new underscore object from the concatenation of an existing underscore object and a new one constructed from the passed parameter.
     * 
     * @memberof _
     * @alias _(o).add
     * 
     * @param {object|string} obj - The object you want wrapped and concatenated or a string representing a css selector.
     * @return {_}                - A new underscore object wrapping both the original object and the added object.
     */
    this.prototype.add = function (obj) {
      var newObj = _(obj);
      return _(newObj.e.concat(this.e));
    };
  });
})(_ || {});
