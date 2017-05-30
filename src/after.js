(function () {
  'use strict';
  _.addModule('after', function () {
    /**
     * Insert content after the currently wrapped elements
     * 
     * @memberof _
     * @alias _(o).after
     * 
     * @param {node|string} content - The content you want inserted after each of the currently wrapped elements.
     * @return {_}                  - The underscore object that the method was called on.
     */
    this.prototype.after = function (content) {
      if (content instanceof Node) content = content.outerHTML;
      return this.each(function (e) { e.insertAdjacentHTML('afterend', content); });
    };
  }, ['each']);
})(_ || {});
