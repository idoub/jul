(function () {
  'use strict';
  _.addModule('addClass', function () {
    /**
     * Adds a class or classes to wrapped elements
     * 
     * @memberof _
     * @alias _(o).addClass
     * 
     * @param {string|string[]} cls - A class or array of classes that you want to add to the wrapped elements.
     */
    this.prototype.addClass = function (cls) {
      if (!Array.isArray(cls)) cls = [cls];
      this.each(function (el) {
        var classList = el.className.split(' ');
        for (var j = 0; j < cls.length; j++) {
          if (classList.indexOf(cls[j]) === -1) classList.push(cls[j]);
        }
        el.className = classList.join(' ');
      });
    };
  }, ['each']);
})(_ || {});
