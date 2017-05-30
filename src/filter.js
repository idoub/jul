(function () {
  'use strict';
  _.addModule('filter', function () {
    /**
     * <strong><i>Loop through every member of an arraylike object wrapped by an
     * underscore object and return an array that matches the filter callback.
     * </i></strong>
     * 
     * @param  {function} fn - The filter function. If the function returns true
     * , then the value of the current arraylike object will be added to the new
     * array.
     * @param  {...*} params - Any params you want passed to the filter function
     * .
     * @return {array}       - The new array with only the values of the current
     * wrapped arraylike object that met the filter criteria.
     * 
     * @example
     *  _(['jul','jade','ruby','jasper','diamond','turquoise']).filter(
     *      function(element,index,array,character){
     *          return element.indexOf(character) > -1;
     *      },
     *      'j'
     *  )
     */
    this.prototype.filter = function (fn, params) {
      var args = Array.from(arguments);
      args.shift();
      var out = [];
      for (var i = this.e.length; i--;) {
        if (fn.apply(this, [this.e[i], i, this.e].concat(args)) === true)
          out.unshift(this.e[i]);
      }
      return out;
    };
  });
})(_ || {});
