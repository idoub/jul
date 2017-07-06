import _ from './jul.js';

/**
 * Loop through every member of an arraylike object wrapped by an underscore object and map them to a different array.
 * 
 * @memberof jul
 * @alias jul(o).map
 * 
 * @param  {function} cb - The mapping function. The value returned from the function will be in the new array.
 * @param  {...*} params - Any params you want passed to the mapping function.
 * @return {array}       - The new array with values mapped from the current wrapped arraylike object.
 * 
 * @example
 *  _(['jul','jade','ruby','jasper','diamond','turquoise']).map(
 *      function(element,index,array,prefix){
 *          return prefix+element.charAt(0).toUpperCase()+element.slice(1);
 *      },
 *      'my '
 *  );
 */
_.prototype.map = function (cb, params) {
  var args = [].slice.call(arguments);
  args.shift();
  var results = [];
  for (var key in Object.keys(this.e)) {
    results.push(cb.apply(this, [this.e[key], key, this.e].concat(args)));
  }
  return results;
};

export default _;