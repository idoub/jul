(function (_) {
  'use strict';
  _.addModule('append', function () {
    /**
     * Append the provided content to the end of each of the currently wrapped elements.
     * 
     * @memberof _
     * @alias _(o).append
     * 
     * @param {node|string} content - The content you want appended to each of the currently wrapped elements.
     * @return {_}                  - The underscore object that the method was called on.
     */
    this.prototype.append = function (content) {
      var frag = document.createDocumentFragment();
      if (typeof (content) === 'string') {
        var div = document.createElement('div');
        div.innerHTML = content;
        for (var i = 0; i < div.childNodes.length; i++) {
          frag.appendChild(div.childNodes[i]);
        }
      } else {
        frag.appendChild(content);
      }
      this.each(function (el) {
        if (el instanceof HTMLElement) el.appendChild(frag);
      });
      return this;
    };
  }, ['each']);
})(_ || {});
