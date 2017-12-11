import _ from './jul.js';

/**
 * Get a new jul from the concatenation of an existing jul and a new one constructed from the passed parameter.
 * 
 * @param {object|string} obj - The object you want wrapped and concatenated or a string representing a css selector.
 * @return {jul}              - A new jul wrapping both the original object and the added object.
 * 
 * @alias jul().add
 * @memberof jul
 */
_.prototype.add = function (obj) {
  var newObj = _(obj);
  return _(this.e.concat(newObj.e));
};

export default _;