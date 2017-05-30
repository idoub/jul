(function () {
  _.addModule('after', function () {
    /**
     * <strong><i>Insert content after the currently wrapped elements.
     * </i></strong>
     * 
     * @param {node|string} content - The content you want inserted after each
     * of the currently wrapped elements.
     */
    this.prototype.after = function (content) {
      if (content instanceof Node) content = content.outerHTML;
      return this.each(function (e) { e.insertAdjacentHTML('afterend', content); });
    };
  }, ['each']);
})(_ || {});
