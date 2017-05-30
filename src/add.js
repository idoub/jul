(function (_) {
  _.addModule('add', function () {
    /**
     * <strong><i>Get a new underscore object from the concatenation of an
     * existing underscore object and a new one constructed from the passed
     * parameter.</i></strong>
     * 
     * @param {object|string} obj - The object you want wrapped and concatenated
     * or a string representing a css selector.
     */
    this.prototype.add = function (obj) {
      var newObj = _(obj);
      return _(newObj.e.concat(this.e));
    };
  });
})(_ || {});
