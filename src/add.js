import _ from './jul.js';

/**
 * Get a new underscore object from the concatenation of an existing underscore object and a new one constructed from the passed parameter.
 * 
 * @memberof jul
 * @alias jul(o).add
 * 
 * @param {object|string} obj - The object you want wrapped and concatenated or a string representing a css selector.
 * @return {jul}                - A new underscore object wrapping both the original object and the added object.
 */
_.prototype.add = function (obj) {
  var newObj = _(obj);
  return _(newObj.e.concat(this.e));
};

export default _;